/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import styles from './styles';

export type ResponseButtonProps = ButtonProps & {
  className?: string;
  label: string;
  buttonVariant?: 'response' | 'add';
  onClick?: ButtonProps['onClick'];
  fullWidth?: boolean;
  selected?: boolean;
};

const useStyles = makeStyles(styles);

const ResponseButton: React.FC<ResponseButtonProps> = forwardRef(
  (props, ref) => {
    const classes = useStyles(props);
    const {
      label,
      className,
      onClick,
      fullWidth,
      buttonVariant,
      selected,
      ...rest
    } = props;

    return (
      <Button
        ref={ref}
        variant="outlined"
        size="small"
        className={clsx(
          className,
          classes.button,
          fullWidth && classes.fullWidth,
          buttonVariant === 'add' && classes.addBtn,
          selected && classes.selected,
        )}
        onClick={onClick}
        {...rest}
      >
        <div className={classes.buttonLabel}>{label}</div>
      </Button>
    );
  },
);

ResponseButton.displayName = 'ResponseButton';

export default ResponseButton;
