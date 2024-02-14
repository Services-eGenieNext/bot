/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVariablesData } from 'builder/features/variables/selectors';
import { VariablesData } from 'builder/components/Variables/types';

export const useVariablesData = (): VariablesData => {
  const variables = useSelector(getVariablesData);
  return useMemo(() => variables, [variables]);
};
