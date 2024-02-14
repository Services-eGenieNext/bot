/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { SelectedType } from 'shared/types';
import { getSelectedBot } from 'builder/lib/state';
import { BotEditorReducer } from '../state';

type SelectOptionArgs = {
  blockId: string | undefined;
  componentId: string;
  optionId: string;
};

interface SelectedReducers {
  setSelectedToBlock: BotEditorReducer<string | undefined>;
  setSelectedToBot: BotEditorReducer<string | undefined>;
  setSelectedToResponse: BotEditorReducer<string>;
  setSelectedToOption: BotEditorReducer<SelectOptionArgs>;
  setSelectedToTextMessage: BotEditorReducer<string | undefined>;
  setSelectedToReadMore: BotEditorReducer<string | undefined>;
  setSelectedTabIndex: BotEditorReducer<number>;
}

export const selectedReducers: SelectedReducers = {
  setSelectedToBlock(state, action) {
    const blockId = action.payload;
    const selectedBlockId = blockId ?? state.selected.selectedBlockId;

    state.selected = {
      ...state.selected,
      selectedBlockId,
      selectedType: SelectedType.Block,
      selectedTabIndex: 0,
      selectedOptionId: undefined,
      selectedComponentId: undefined,
    };
  },
  setSelectedToBot(state, action) {
    const selectedBotId = action.payload ?? state.selected.selectedBotId;

    state.selected = {
      ...state.selected,
      selectedBotId,
      selectedType: SelectedType.Bot,
      selectedTabIndex: 0,
      selectedBlockId: undefined,
      selectedOptionId: undefined,
      selectedComponentId: undefined,
    };
  },
  setSelectedToResponse(state, action) {
    const componentId = action.payload;
    const selectedBlockId = state.selected.selectedBlockId;
    const selectedBot = getSelectedBot(state);
    const blocks = selectedBot?.blocks;

    const selectedBlock = selectedBlockId && blocks && blocks[selectedBlockId];
    if (!selectedBlock) {
      return;
    }

    state.selected = {
      ...state.selected,
      selectedBlockId: selectedBlock.id,
      selectedComponentId: componentId,
      selectedType: SelectedType.Response,
      selectedTabIndex: 0,
      selectedOptionId: undefined,
    };
  },
  setSelectedToOption(state, action) {
    const { blockId, componentId, optionId } = action.payload;
    const selectedBlockId = blockId ?? state.selected.selectedBlockId;
    state.selected = {
      ...state.selected,
      selectedBlockId,
      selectedComponentId: componentId,
      selectedOptionId: optionId,
      selectedType: SelectedType.Option,
      selectedTabIndex: 0,
    };
  },
  setSelectedToTextMessage(state, action) {
    const selectedBlockId = action.payload || state.selected.selectedBlockId;
    state.selected = {
      ...state.selected,
      selectedType: SelectedType.TextMessage,
      selectedTabIndex: 0,
      selectedBlockId,
      selectedComponentId: undefined,
      selectedOptionId: undefined,
    };
  },
  setSelectedToReadMore(state, action) {
    const selectedBlockId = action.payload || state.selected.selectedBlockId;
    state.selected = {
      ...state.selected,
      selectedType: SelectedType.ReadMoreContent,
      selectedTabIndex: 0,
      selectedBlockId,
      selectedComponentId: undefined,
      selectedOptionId: undefined,
    };
  },
  setSelectedTabIndex(state, action) {
    state.selected.selectedTabIndex = action.payload;
  },
};
