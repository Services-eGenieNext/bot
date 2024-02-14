/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import clsx from 'clsx';
import InputField, { InputFieldProps } from '../InputField';
import { useStyles } from './styles';

export type VariableInputProps = InputFieldProps & {
  className?: string;
  namespace?: string;
};

const VariableInput: FC<VariableInputProps> = props => {
  const { className, label, namespace, ...others } = props;
  const classes = useStyles();
  return (
    <div className={className}>
      {label && <div className={classes.fieldLabel}>{label}</div>}
      <Grid
        container
        className={clsx(classes.container)}
        alignItems={'center'}
        alignContent={'center'}
      >
        <Grid item>
          <div className={clsx(classes.label, classes.labelLeft)}>
            {'{{'}
            {namespace ? `${namespace}.` : ''}
          </div>
        </Grid>
        <Grid item xs>
          <InputField className={classes.input} {...others} />
        </Grid>
        <Grid item>
          <div className={clsx(classes.label, classes.labelRight)}>{'}}'}</div>
        </Grid>
      </Grid>
    </div>
  );
};

export default VariableInput;
