/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createSelector } from '@reduxjs/toolkit';
import { Bot, ParagraphBinding, RootState, SelectedType } from 'shared/types';
import { getObjectValues } from 'shared/utils';
import { getSelectedBot, getSelectedOption } from 'builder/lib/state';
import { initialState } from '../state';

const selectDomain = (state: RootState) => state.botEditor || initialState;

export const getBots = createSelector([selectDomain], botEditorState => {
  return botEditorState.bots;
});

export const getBotById = createSelector(
  [getBots, (_, botId: string | undefined) => botId],
  (bots, botId): Bot | undefined => {
    return botId ? bots[botId] : undefined;
  },
);

export const getBotsList = createSelector([getBots], bots => {
  return getObjectValues(bots);
});

export const getBlocks = createSelector([selectDomain], botEditorState => {
  const selectedBot = getSelectedBot(botEditorState);
  return selectedBot?.blocks ?? {};
});

export const getBlocksList = createSelector([getBlocks], blocks => {
  return getObjectValues(blocks);
});

export const getBlockById = createSelector(
  [getBlocks, (_, blockId: string) => blockId],
  (blocks, blockId) => {
    return blocks && blockId ? blocks[blockId] : undefined;
  },
);

export const getSelectedParagraphs = createSelector([selectDomain], state => {
  const { selectedType, selectedBotId, selectedBlockId } = state.selected;

  let paragraphs: ParagraphBinding[] = [];

  if (!selectedBotId || !selectedBlockId) {
    return paragraphs;
  }

  const selectedBot = state.bots[selectedBotId];
  const selectedBlock = selectedBot?.blocks[selectedBlockId];
  const selectedOption = getSelectedOption(state);
  let responseParagraphs: ParagraphBinding[] = [];

  if (selectedOption && selectedOption.paragraphs) {
    responseParagraphs = selectedOption.paragraphs;
  }

  if (selectedType === SelectedType.Block) {
    paragraphs = selectedBlock?.paragraphs ?? [];
  } else if (
    selectedType === SelectedType.Response ||
    selectedType === SelectedType.Option
  ) {
    paragraphs = responseParagraphs;
  }
  return paragraphs;
});
