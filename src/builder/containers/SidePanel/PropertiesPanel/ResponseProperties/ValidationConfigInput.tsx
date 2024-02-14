/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { ChangeEventHandler, ComponentType, FC } from 'react';
import VariableInput from 'builder/components/VariableInput';
import InputField, { InputFieldProps } from 'builder/components/InputField';
import { Inputs } from 'builder/lib/validation';
import { ResponseValidationType, ValidationType } from 'shared/types';

type ValidationConfigInputProps = {
  validation: ResponseValidationType;
  onChange: ChangeEventHandler;
};

const ValidationConfigInput: FC<ValidationConfigInputProps> = props => {
  const { validation, onChange } = props;
  const {
    name,
    placeholder,
    getInputValue,
    component: InputComponent,
  } = validationConfigs[validation.type] ?? {};

  if (!(name && placeholder && getInputValue && InputComponent)) {
    return null;
  }

  return (
    <InputComponent
      name={name}
      placeholder={placeholder}
      value={getInputValue(validation) ?? ''}
      onChange={onChange}
    />
  );
};

export default ValidationConfigInput;

const validationConfigs: {
  [key in ValidationType]?: {
    name: string;
    placeholder: string;
    getInputValue: (value: ResponseValidationType) => string | undefined;
    component: ComponentType<InputFieldProps>;
  };
} = {
  pattern: {
    name: Inputs.Pattern,
    placeholder: 'RegExp pattern',
    getInputValue: validation => validation.pattern,
    component: InputField,
  },
  settlement: {
    name: Inputs.SettlementVariable,
    placeholder: 'Settlement variable',
    getInputValue: validation => validation.settlementVariable,
    component: VariableInput,
  },
};
