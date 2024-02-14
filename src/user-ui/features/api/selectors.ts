/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'shared/types';
import { initialState } from 'user-ui/features/state';

export const selectBotUiDomain = (state: RootState) =>
  state.botUi || initialState;

export const getApiStatus = createSelector(
  [selectBotUiDomain, (_, blockId: string | undefined) => blockId],
  (state, blockId) => {
    if (!blockId) {
      return;
    }
    return state.apiState[blockId];
  },
);
