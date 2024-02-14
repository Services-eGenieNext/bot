/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { useVariablesData } from 'builder/hooks';
import { UseVariables, VariableSelectProps } from './types';
import { VariableMenu } from './VariableMenu';

export const useVariables: UseVariables = () => {
  const variablesData = useVariablesData();
  return {
    variablesData,
    VariablesSelect,
  };
};

export const VariablesSelect: FC<VariableSelectProps> = props => {
  const { className, onSelect } = props;
  const variablesData = useVariablesData();
  return (
    <VariableMenu
      className={className}
      variables={variablesData}
      onSelect={onSelect}
    />
  );
};
