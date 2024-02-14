/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'shared/types';
import { getBlocks, getBots } from '../bots/selectors';
import { initialState } from '../state';

const selectDomain = (state: RootState) => state.botEditor || initialState;

export const getSelectedItem = createSelector(
  [selectDomain],
  botEditorState => botEditorState.selected,
);

export const getSelectedType = createSelector(
  [getSelectedItem],
  selected => selected.selectedType,
);

export const getSelectedBotId = createSelector(
  [getSelectedItem],
  selected => selected.selectedBotId,
);

export const getSelectedBot = createSelector(
  [getBots, getSelectedBotId],
  (bots, selectedBotId) => {
    return selectedBotId ? bots[selectedBotId] : undefined;
  },
);

export const getSelectedTabIndex = createSelector(
  [getSelectedItem],
  selected => selected.selectedTabIndex,
);

export const getSelectedBlock = createSelector(
  [getBlocks, getSelectedItem],
  (blocks, selectedItem) => {
    const selectedBlockId = selectedItem.selectedBlockId;
    if (selectedBlockId) {
      return blocks[selectedBlockId];
    }
  },
);

export const getSelectedResponse = createSelector(
  [getSelectedBlock, getSelectedItem],
  (block, selectedItem) => {
    if (block && block.components) {
      return block.components?.find(
        res => res.id === selectedItem.selectedComponentId,
      );
    }
  },
);

export const getSelectedOption = createSelector(
  [getSelectedResponse, getSelectedItem],
  (response, selectedItem) => {
    const optionId = selectedItem.selectedOptionId;
    const options = response?.props?.options;
    if (options && optionId) {
      return options.find(opt => opt.id === optionId);
    }
  },
);
