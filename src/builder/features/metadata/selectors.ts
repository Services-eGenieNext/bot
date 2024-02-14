/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'shared/types';
import { getSelectedBot } from 'builder/lib/state';
import { initialState } from '../state';

const selectDomain = (state: RootState) => state.botEditor || initialState;

export const getBotTransform = createSelector(
  [selectDomain],
  botEditorState => {
    const selectedBot = getSelectedBot(botEditorState);
    if (!selectedBot) {
      return;
    }
    return botEditorState.metadata[selectedBot.id]?.transform;
  },
);
