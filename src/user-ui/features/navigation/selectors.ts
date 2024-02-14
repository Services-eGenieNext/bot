/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'shared/types';
import { initialState } from '../state';

const selectBotUiDomain = (state: RootState) => state.botUi || initialState;

export const getNavigation = createSelector([selectBotUiDomain], botUiState => {
  return botUiState.navigation;
});

export const getNavPrev = createSelector([selectBotUiDomain], botUiState => {
  return botUiState.navigation.previous;
});

export const getNavNext = createSelector([selectBotUiDomain], botUiState => {
  return botUiState.navigation.next;
});
