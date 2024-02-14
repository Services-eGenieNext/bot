/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { ComponentType } from 'react';

export type UseVariables = () => {
  variablesData: VariablesData;
  VariablesSelect: ComponentType<VariableSelectProps>;
};

export type VariableItem = {
  displayName: string;
};

export type VariablesData = {
  global: { [key: string]: VariableItem };
  user: { [key: string]: VariableItem };
  response: { [key: string]: VariableItem };
};

export type VariableSelectHandler = (
  variable: string,
  variableItem: VariableItem,
) => void | undefined;

export type VariableSelectProps = {
  className?: string;
  onSelect?: VariableSelectHandler;
};
