/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { useStyles } from './styles';

export type VariableButtonProps = ButtonProps & {
  className?: string;
  label?: string;
};
export const VariableButton: FC<VariableButtonProps> = props => {
  const classes = useStyles();
  const { className, label, ...others } = props;
  return (
    <Button className={classes.variableButton} {...others}>
      {label ?? '{} variables'}
    </Button>
  );
};
