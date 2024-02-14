/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'shared/types';
import { getVarsData } from 'builder/lib/state';
import { initialState } from '../state';

const selectDomain = (state: RootState) => state.botEditor || initialState;

export const getGlobalVariables = createSelector(
  [selectDomain],
  botEditorState => botEditorState.variables.global,
);

export const getUserVariables = createSelector(
  [selectDomain],
  botEditorState => botEditorState.variables.user,
);

export const getVariables = createSelector(
  [selectDomain],
  botEditorState => botEditorState.variables,
);

export const getVariablesData = createSelector([selectDomain], botEditorState =>
  getVarsData(botEditorState),
);
