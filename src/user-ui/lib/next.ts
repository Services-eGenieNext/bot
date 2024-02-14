/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { castDraft, Immutable } from 'immer';
import isEqual from 'lodash/isEqual';
import {
  Action,
  BlockTypes,
  BotsMap,
  ConditionOperator,
  isConditionBlock,
  isOutletBlock,
  isTriggerBlock,
} from 'shared/types';

import { getObjectValues, logger } from 'shared/utils';
import { BotUiState } from 'user-ui/features/state';
import {
  addVariables,
  BlockReference,
  emitVariablesUpdated,
  findParentFromBotMap,
  getBlock,
  getComponents,
  getFirstAnswer,
  getFirstBlockOfBot,
  getTypedValue,
  isBlockNotAnswered,
  resolveVariableValue,
  VariableType,
} from 'user-ui/lib';

const getReferencingOutlet = (
  bots: Immutable<BotsMap>,
  _botId: string,
): BlockReference | undefined => {
  const parentBot = findParentFromBotMap(bots);
  const parentBlocks = getObjectValues(parentBot?.blocks);
  const outletBlock =
    parentBlocks &&
    parentBlocks.find(it => isOutletBlock(it) && it.nextBotId === _botId);

  if (!parentBot || !outletBlock) {
    return;
  }

  return {
    botId: parentBot.id,
    blockId: outletBlock.id,
  };
};

export const getNextFromFinish = (
  bots: Immutable<BotsMap>,
  bRef: BlockReference,
): BlockReference | undefined => {
  const block = getBlock(bots, bRef);

  if (!block || block.type !== BlockTypes.Finish) {
    logger.error(
      'passed block in getNextFromFinish is undefined or not an exit block',
      { block },
    );
    return;
  }

  const botId = bRef.botId;

  if (!botId) {
    logger.error('could not find bot id of block in getNextFromFinish method');
    return;
  }

  const outletReference = getReferencingOutlet(bots, botId);
  const outletBlock = outletReference && getBlock(bots, outletReference);
  const nextBlockId = outletBlock?.next?.id;
  if (!outletReference || !nextBlockId) {
    return;
  }

  return { botId: outletReference.botId, blockId: nextBlockId };
};

export const getNextFromCondition = (
  state: Immutable<BotUiState>,
  bRef: BlockReference,
): BlockReference | undefined => {
  const { bots } = state;
  const block = getBlock(bots, bRef);
  if (!block || !isConditionBlock(block)) {
    logger.error(
      'passed block in getNextFromCondition is undefined or not an condition block',
      { block },
    );
    return;
  }
  const botId = bRef.botId;

  const {
    valueLeft: _valueLeft,
    valueRight: _valueRight,
    operator,
    nextFalse,
    nextTrue,
  } = block;

  let conditionResult: boolean;

  const getValue = (v): number | string | boolean => {
    const resolvedValue = resolveVariableValue(state, bRef, v);

    const value = getTypedValue(resolvedValue);
    return value !== null && value !== undefined ? value : '';
  };

  const valueLeft = getValue(_valueLeft);
  const valueRight = getValue(_valueRight);

  switch (operator) {
    case ConditionOperator.EQUAL:
      conditionResult = valueLeft === valueRight;
      break;
    case ConditionOperator.EXIST:
      conditionResult = !!valueLeft;
      break;
    case ConditionOperator.GREATER:
      conditionResult = valueLeft > valueRight;
      break;
    case ConditionOperator.GREATER_EQUAL:
      conditionResult = valueLeft >= valueRight;
      break;
    case ConditionOperator.LESS:
      conditionResult = valueLeft < valueRight;
      break;
    case ConditionOperator.LESS_EQUAL:
      conditionResult = valueLeft <= valueRight;
      break;
    case ConditionOperator.NOT_EQUAL:
      conditionResult = valueLeft !== valueRight;
      break;
  }

  const nextBlock = conditionResult ? nextTrue : nextFalse;
  const nextBlockId = nextBlock?.id;
  if (botId && nextBlockId) {
    return { botId, blockId: nextBlockId };
  }
};

export const getNextFromTrigger = (
  state: Immutable<BotUiState>,
  bRef: BlockReference,
  updateState: boolean = false,
): BlockReference | undefined => {
  const { bots } = state;
  const block = getBlock(bots, bRef);
  if (!block || !isTriggerBlock(block)) {
    logger.error(
      'passed block in getNextFromTrigger is undefined or not a trigger block',
      { block },
    );
    return;
  }

  const { next, value, variable, action } = block;

  if (updateState) {
    const variableType =
      action === Action.SET_USER_VARIABLE ? 'user' : 'global';
    const resolvedValue = resolveVariableValue(state, bRef, value);

    if (resolvedValue) {
      updateStateVariables(
        castDraft(state),
        variableType,
        variable,
        resolvedValue,
      );
    }
  }

  const botId = bRef.botId;
  const nextBlockId = next?.id;

  if (botId && nextBlockId) {
    return { botId, blockId: nextBlockId };
  }
};

export const updateStateVariables = (
  state: BotUiState,
  variableType: VariableType,
  variableName: string,
  value: any,
) => {
  const newVar = { [variableName]: value };

  const { variables } = state;
  const updatedVariables = addVariables(variables, {
    variableType,
    variables: newVar,
  });

  const newVariableState = Object.assign({}, variables, updatedVariables);

  if (!isEqual(newVariableState, variables)) {
    Object.assign(variables, updatedVariables);
    emitVariablesUpdated(variableType, newVar);
  }
};

const getNextFromText = (
  state: Immutable<BotUiState>,
  bRef: BlockReference,
  updateState?: boolean,
): BlockReference | undefined => {
  const { bots, answers } = state;
  const { botId } = bRef;
  const block = getBlock(bots, bRef);

  if (!block) {
    return;
  }

  let nextBlockId: string | undefined = block?.next?.id;

  const firstComponent = getComponents(block)[0];
  const blockAnswers = answers[block.id];
  const firstAnswer = blockAnswers && blockAnswers[0];

  const value = getFirstAnswer(blockAnswers)?.value;

  if (typeof value !== 'undefined') {
    if (updateState) {
      const variableName = `response.${block.id}`;
      updateStateVariables(castDraft(state), 'global', variableName, value);
    }

    if (firstComponent?.type === 'predefined') {
      const firstComponentAnswer =
        firstAnswer && firstComponent && firstAnswer[firstComponent.id];
      const selectedOptionId = firstComponentAnswer?.selectedOptionId;
      const optionNextId = firstComponent.props?.options?.find(
        opt => opt.id === selectedOptionId,
      )?.next?.id;
      nextBlockId = optionNextId ?? block.next?.id;
    }
  }

  if (botId && nextBlockId) {
    return {
      botId,
      blockId: nextBlockId,
    };
  }
};

export const getNextFromOutlet = (
  bots: Immutable<BotsMap>,
  bRef: BlockReference,
): BlockReference | undefined => {
  const block = getBlock(bots, bRef);
  if (!block || !isOutletBlock(block)) {
    logger.error(
      'passed block in getNextFromOutletBlock is undefined or not a outlet block',
      { block },
    );
    return;
  }

  const nextBotId = block.nextBotId;
  const nextBlock = nextBotId ? getFirstBlockOfBot(bots, nextBotId) : undefined;

  if (nextBotId && nextBlock) {
    return { botId: nextBotId, blockId: nextBlock.id };
  }
};

export const getNext = (
  state: Immutable<BotUiState>,
  bRef: BlockReference,
  skipAnswered: boolean = false,
  updateState: boolean = false,
): BlockReference | undefined => {
  const { botId, blockId } = bRef;
  const { bots, validAnswers } = state;
  const block = getBlock(bots, bRef);
  if (!block) {
    logger.warn('could not find block to calculate next block', blockId);
    return;
  }

  let next: BlockReference | undefined;

  switch (block.type) {
    case BlockTypes.Text:
    case BlockTypes.List:
    case BlockTypes.API:
      next = getNextFromText(state, bRef, updateState);
      break;
    case BlockTypes.Finish:
      next = getNextFromFinish(bots, bRef);
      break;
    case BlockTypes.Condition:
      next = getNextFromCondition(state, bRef);
      break;
    case BlockTypes.Trigger:
      next = getNextFromTrigger(state, bRef, updateState);
      break;
    case BlockTypes.Outlet:
      next = getNextFromOutlet(bots, bRef);
      break;
    default:
      if (block.next?.id) {
        next = { botId, blockId: block.next?.id };
      }
  }

  const nextBlock = next && getBlock(bots, next);
  const blockAnswers = nextBlock && validAnswers[nextBlock.id];
  if (next && skipAnswered && !isBlockNotAnswered(nextBlock, blockAnswers)) {
    return getNext(state, next, skipAnswered, updateState);
  }

  return next;
};
