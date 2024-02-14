/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { flatten } from 'flat';
import cloneDeep from 'lodash/cloneDeep';
import { castDraft, Draft, Immutable } from 'immer';
import get from 'lodash/get';
import { getContext } from 'shared/context';
import {
  emitEvent,
  getObjectEntries,
  getObjectValues,
  isNumber,
} from 'shared/utils';
import { BotUiState, VariablesState } from 'user-ui/features/state';
import { getPreviousBlockAnswer } from 'user-ui/lib/answers';
import { findFirstBlock } from 'user-ui/lib/blocks';
import { getNext } from 'user-ui/lib/next';
import {
  AddVariablePayload,
  BlockReference,
  SerializedVariable,
  VariableType,
} from 'user-ui/lib/types';

export const getVariableValue = (
  state: Immutable<BotUiState>,
  stringValue: string | undefined,
): Record<string, unknown> | any[] | string | undefined => {
  const { variables } = state;
  const match = stringValue?.match(/{{(.+)}}/);

  if (!match || match.length < 1 || !match[1]) {
    return stringValue;
  }

  const variableName = match[1];

  const variableNamePath = variableName.split('.');
  const isResponseVariable = variableNamePath[0] === 'response';

  const value = castDraft(variables[variableName]);

  if (isResponseVariable) {
    return value;
  }
  if (typeof value === 'string' && value.match(/{{(.+)}}/)) {
    return getVariableValue(state, value);
  }

  return value;
};

export const addVariables = (
  currentVars: Immutable<VariablesState>,
  { variableType, variables }: AddVariablePayload,
): Immutable<VariablesState> => {
  const flatVars: Record<string, any> = flatten(variables, { safe: true });

  const vars = Object.fromEntries(
    Object.entries(flatVars).map(([key, value]) => {
      const varKey = variableType === 'global' ? key : `user.${key}`;
      return [varKey, value];
    }),
  );

  return { ...currentVars, ...vars };
};

const updatedVars: Record<VariableType, Record<string, string>> = {
  global: {},
  user: {},
};
let updatedVarTimerId;

export const emitVariablesUpdated = (
  variableType: VariableType,
  newVar: Record<string, unknown>,
) => {
  const eventData = flatten(newVar, { safe: true });
  const { options } = getContext();
  const updateInterval = options.updateInterval ?? 1000;
  Object.assign(updatedVars[variableType], eventData);
  clearTimeout(updatedVarTimerId);

  updatedVarTimerId = window.setTimeout(() => {
    getObjectEntries(updatedVars).forEach(([vType, vars]) => {
      if (getObjectValues(vars).length > 0) {
        emitEvent('variablesUpdated', {
          variableType: vType,
          variables: vars,
        });
        updatedVars[vType] = {};
      }
    });
  }, updateInterval);
};

export const resolveVariableValue = (
  state: Immutable<BotUiState>,
  bRef: BlockReference,
  value: string | undefined,
): Record<string, unknown> | string | any[] | undefined => {
  return value
    ? getVariableValue(state, value)
    : getPreviousBlockAnswer(state, bRef);
};

export const reCalculateStateVariables = (state: Draft<BotUiState>) => {
  let blockRef = findFirstBlock(state);
  state.variables = cloneDeep(state.optionVariables);

  if (!blockRef) {
    return;
  }

  do {
    blockRef = getNext(state, blockRef, true, true);
  } while (blockRef);
};

export const replaceVariablesWithValues = (
  text?: string,
  variables?: SerializedVariable[],
): string => {
  if (!text || !variables) {
    return '';
  }

  let _title = text;

  const inlineVariablesMatch = [
    ..._title.matchAll(/{{([\w.\d-_]+)}}/g),
  ].reverse();

  for (const match of inlineVariablesMatch) {
    const [matchedString, variableName] = match;
    const index = match.index;
    if (!matchedString || !variableName || !isNumber(index)) {
      continue;
    }

    const value = get(variables, variableName);
    const variableValue = value ? String(value) : '';

    _title =
      _title.substr(0, index) +
      variableValue +
      _title.substr(index + matchedString.length);
  }

  return _title;
};
