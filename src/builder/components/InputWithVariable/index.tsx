/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback, useRef } from 'react';
import InputField, { InputFieldProps } from '../InputField';
import { VariablesSelect } from '../Variables';
import { VariableSelectHandler } from '../Variables/types';
import { useStyles } from './styles';

const InputWithVariable: FC<InputFieldProps> = props => {
  const classes = useStyles();
  const { label, ...others } = props;
  const inputRef = useRef<HTMLInputElement>();
  const handleSelect: VariableSelectHandler = useCallback(variable => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    const variableText = `{{${variable}}}`;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;

    nativeInputValueSetter?.call(input, variableText);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, []);

  return (
    <div>
      {label && <div className={classes.label}>{label}</div>}
      <div className={classes.inputField}>
        <InputField inputRef={inputRef} {...others} />
        <div className={classes.footer}>
          <VariablesSelect
            className={classes.variables}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default InputWithVariable;
