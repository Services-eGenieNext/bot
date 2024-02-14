/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { capitalize } from '@material-ui/core';
import { ValidationType } from 'shared/types';

export enum Inputs {
  Hint = 'hint',
  Title = 'title',
  Validation = 'validationType',
  Pattern = 'validationPattern',
  Value = 'value',
  SettlementVariable = 'settlementVariable',
}

export const validations: ValidationType[] = [
  'anything',
  'textarea',
  'date',
  'email',
  'name',
  'number',
  'phone',
  'unique_id',
  'settlement',
  'pattern',
];

export const getValidationLabel = (value: string) => {
  return value.split(/[_ .]/g).map(capitalize).join(' ');
};
