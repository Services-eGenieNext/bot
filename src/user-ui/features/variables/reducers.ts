/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { castDraft } from 'immer';
import cloneDeep from 'lodash/cloneDeep';
import { addVariables, SetVariablePayload } from 'user-ui/lib';
import { BotUiReducer } from '../state';

export interface VariableReduces {
  setOptionVariables: BotUiReducer<SetVariablePayload>;
}

export const variableReducers: VariableReduces = {
  setOptionVariables(state, action) {
    const { global, user } = action.payload;
    const variables = castDraft({
      ...addVariables({}, { variableType: 'global', variables: global }),
      ...addVariables({}, { variableType: 'user', variables: user }),
    });

    state.variables = cloneDeep(variables);
    state.optionVariables = cloneDeep(variables);
  },
};
