/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { logger } from 'shared/utils';
import { getVarsData } from 'builder/lib/state';
import { emitVariableUpdated } from '../emit';
import { BotEditorReducer } from '../state';

export interface VariableReduces {
  setGlobalVariables: BotEditorReducer<string[] | undefined>;
  setUserVariables: BotEditorReducer<string[] | undefined>;
}

export const variableReducers: VariableReduces = {
  setGlobalVariables(state, action) {
    if (!isVariableOptionValid(action.payload)) {
      logger.warn(
        'Provided global variables are not valid, they will not be available.',
      );
      return;
    }
    state.variables.global = action.payload;
    emitVariableUpdated(getVarsData(state));
  },
  setUserVariables(state, action) {
    if (!isVariableOptionValid(action.payload)) {
      logger.warn(
        'Provided user variables are not valid, they will not be available.',
      );
      return;
    }
    state.variables.user = action.payload;
    emitVariableUpdated(getVarsData(state));
  },
};

const isVariableOptionValid = (variables): variables is string[] => {
  return (
    variables &&
    typeof variables.length !== 'undefined' &&
    variables.every(v => typeof v === 'string')
  );
};
