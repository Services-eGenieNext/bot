/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import styles from './styles';

export type InputFieldProps = TextFieldProps & {
  icon?: React.ReactNode;
};

const useStyles = makeStyles(styles);

const InputField: React.FC<InputFieldProps> = props => {
  const classes = useStyles(props);
  const {
    label,
    placeholder,
    icon,
    autoComplete,
    autoCorrect,
    className,
    ...others
  } = props;
  const labelText = typeof label === 'string' ? label : '';
  return (
    <div className={clsx(className, classes.inputField)}>
      {label && <div className={classes.fieldLabel}>{label}</div>}
      <TextField
        variant={'outlined'}
        size={'small'}
        fullWidth
        spellCheck={false}
        autoComplete={autoComplete ?? 'off'}
        autoCorrect={autoCorrect || 'off'}
        placeholder={placeholder || labelText}
        InputProps={{
          startAdornment: icon && (
            <InputAdornment position="start">{icon}</InputAdornment>
          ),
        }}
        {...others}
      />
    </div>
  );
};

export default InputField;
