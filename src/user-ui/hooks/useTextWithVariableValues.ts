/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useSelector } from 'react-redux';
import { getVariables } from 'user-ui/features/variables/selectors';
import { replaceVariablesWithValues } from 'user-ui/lib';

export const useTextWithVariableValues = (input?: string): string => {
  const variables = useSelector(getVariables);
  return replaceVariablesWithValues(input, variables);
};

export const useTextArrayWithVariableValues = (input: string[]): string[] => {
  const variables = useSelector(getVariables);
  return input.map(t => replaceVariablesWithValues(t, variables));
};
