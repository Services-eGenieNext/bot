/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import {
  Action,
  Bot,
  ComponentType,
  isTriggerBlock,
  PredefinedOptions,
} from 'shared/types';
import { getObjectValues } from 'shared/utils';
import { VariablesData } from 'builder/components/Variables/types';
import { BotEditorState } from 'builder/features/state';

export const getSelectedBot = (state: BotEditorState): Bot | undefined => {
  const selectedBotId = state.selected.selectedBotId;
  if (selectedBotId && state.bots[selectedBotId]) {
    return state.bots[selectedBotId];
  }

  const botsList = Object.values(state.bots);
  const selectedBot = botsList.find(bot => bot?.type === 'parent');

  if (!selectedBot) {
    return botsList[0];
  }

  return selectedBot;
};

export const getSelectedBlock = (state: BotEditorState) => {
  const selectedBlockId = state.selected.selectedBlockId;
  if (!selectedBlockId) {
    return;
  }

  const selectedBot = getSelectedBot(state);
  const blocks = selectedBot?.blocks;

  return blocks && blocks[selectedBlockId];
};

export const getSelectedResponse = (state: BotEditorState) => {
  const selectedComponentId = state.selected.selectedComponentId;
  if (!selectedComponentId) {
    const selectedBlock = getSelectedBlock(state);
    return selectedBlock?.components && selectedBlock.components[0];
  }

  const selectedBlock = getSelectedBlock(state);
  return selectedBlock?.components?.find(res => res.id === selectedComponentId);
};

export const getSelectedOption = (
  state: BotEditorState,
): PredefinedOptions | undefined => {
  const response = getSelectedResponse(state);
  return response?.props?.options?.find(
    opt => opt.id === state.selected.selectedOptionId,
  );
};

export const getVarsData = (state: BotEditorState): VariablesData => {
  const result: VariablesData = { user: {}, global: {}, response: {} };

  const varReducer = (acc, v) => {
    acc[v] = {
      displayName: v,
    };
    return acc;
  };

  result.user = state.variables.user.reduce(
    varReducer,
    {} as VariablesData['user'],
  );
  result.global = state.variables.global.reduce(
    varReducer,
    {} as VariablesData['global'],
  );

  const blocks = getObjectValues(state.bots).flatMap(bot =>
    getObjectValues(bot.blocks),
  );

  result.response = blocks.reduce((acc, b) => {
    if (isTriggerBlock(b)) {
      if (b.action === Action.SET_VARIABLE) {
        result.global[b.variable] = { displayName: b.variable };
      } else if (b.action === Action.SET_USER_VARIABLE) {
        result.user[b.variable] = { displayName: `user.${b.variable}` };
      }
    } else if (
      b.components &&
      b.components.filter(c => c.type !== ComponentType.None).length > 0
    ) {
      const vKey = `${b.id}`;
      const vName = b.title;
      acc[vKey] = { displayName: vName };
    }
    return acc;
  }, {} as VariablesData['response']);

  return result;
};
