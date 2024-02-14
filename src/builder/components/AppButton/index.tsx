/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { ReactNode } from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { useStyles } from './styles';

export type AppButtonProps = ButtonProps & {
  text: string;
  icon: ReactNode;
  active?: boolean;
};

const AppButton: React.FC<AppButtonProps> = props => {
  const { text, icon, active, ...others } = props;
  const classes = useStyles({ text, active });

  return (
    <Button
      variant="outlined"
      size="small"
      className={classes.button}
      startIcon={icon}
      {...others}
    >
      <div className={classes.buttonLabel}>{text}</div>
    </Button>
  );
};

export default AppButton;
