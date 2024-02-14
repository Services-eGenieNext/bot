/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { flatten } from 'flat';
import { castDraft, Immutable } from 'immer';
import { ParagraphBinding, PredefinedOptions } from 'shared/types';
import { getObjectValues } from 'shared/utils';
import { BotUiState } from 'user-ui/features/state';
import {
  getFirstAnswer,
  getQuestionSequence,
  isBlockNotAnswered,
} from './answers';
import { getComponents, isViewableBlock } from './blocks';
import {
  BlockAnswer,
  DeserializedAnswers,
  SequenceInfo,
  SerializedAnswer,
  SerializedSubmitData,
  SerializedVariable,
} from './types';

export const getSerializedVariables = (
  state: Immutable<BotUiState>,
): SerializedVariable[] => {
  const { variables } = state;
  return flatten({ ...variables }, { safe: true });
};

export const getSerializedResponse = (
  sequenceInfo: SequenceInfo,
): SerializedAnswer | null => {
  const {
    bot,
    block,
    answers: _answers = [],
    apiStatus: _apiStatus,
  } = sequenceInfo;
  if (!block || !bot) {
    return null;
  }

  const blockId = block.id;
  const botId = bot.id;
  const blockType = block.type;

  const numberOfComponents = getComponents(block).length;

  const answers = _answers.map(a => getObjectValues(castDraft(a)));
  const { response } = _apiStatus ?? {};

  return {
    botId,
    blockId,
    blockType,
    numberOfAnswers: answers.length,
    numberOfComponents: numberOfComponents,
    answers,
    apiResponse: response,
  };
};

export const getSerializedSubmitData = (
  state: Immutable<BotUiState>,
): SerializedSubmitData => {
  const sequence = getQuestionSequence(state, true);

  const serializedAnswers: SerializedAnswer[] = sequence
    .filter(s => isViewableBlock(s.block))
    .filter(s => !isBlockNotAnswered(s.block, s.answers) || s.skipped)
    .map(getSerializedResponse)
    .filter((sa): sa is SerializedAnswer => !!sa);

  const serializedVariables: SerializedVariable[] =
    getSerializedVariables(state);
  const paragraphIds: string[] = sequence.flatMap(({ block, answers }) => {
    const { selectedOptionId } = getFirstAnswer(answers) ?? {};
    const blockParagraphs: Immutable<ParagraphBinding[]> =
      block?.paragraphs ?? [];
    const options: Immutable<PredefinedOptions[]> =
      (block?.components && block.components[0]?.props?.options) ?? [];
    const selectedOption = options.find(o => o.id === selectedOptionId);
    const optionParagraphs: Immutable<ParagraphBinding[]> =
      selectedOption?.paragraphs ? selectedOption?.paragraphs : [];
    return [...blockParagraphs, ...optionParagraphs].map(({ id }) => id);
  });

  return {
    responses: serializedAnswers,
    variables: serializedVariables,
    paragraphIds,
  };
};

export const deserializeAnswers = (
  serializedAnswers: SerializedAnswer[],
): DeserializedAnswers => {
  return serializedAnswers.reduce(
    (desAcc, sans) => {
      desAcc.answers[sans.blockId] =
        sans.answers?.map(answer => {
          return answer.reduce((ansAcc, aVal) => {
            ansAcc[aVal.componentId] = aVal;
            return ansAcc;
          }, {} as BlockAnswer);
        }) ?? {};

      if (sans.apiResponse) {
        desAcc.apiState[sans.blockId] = { response: sans.apiResponse };
      }
      return desAcc;
    },
    { answers: {}, apiState: {} } as DeserializedAnswers,
  );
};
