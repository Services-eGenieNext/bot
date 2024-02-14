/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, ReactElement } from 'react';
import { Button, ButtonProps, Spinner } from 'react-bootstrap';
import clsx from 'clsx';
import { ArrowRightIcon } from 'shared/icons';
import classes from './styles.module.scss';

type ActionButtonProps = ButtonProps & {
  title?: string;
  fullWidth?: boolean;
  icon?: ReactElement;
  colorVariant?: 'green' | 'orange' | 'red';
  loading?: boolean;
};

const ActionButton: FC<ActionButtonProps> = props => {
  const {
    className,
    title,
    fullWidth,
    icon,
    colorVariant,
    loading,
    disabled,
    ...others
  } = props;

  /*
  const color = colorVariant ?? 'orange';

  const colorClasses: Record<typeof color, string | undefined> = {
    green: classes.greenBg,
    orange: classes.orangeBg,
    red: classes.redBg,
  };
*/
  //const bgClass = colorClasses[color];

  const spinner = (
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    />
  );

  return (
    <Button
      className={clsx(
        className,
        classes.actionButton,
        //bgClass,
        fullWidth && classes.fullWidth,
      )}
      variant={'success'}
      title={title}
      disabled={disabled || loading}
      {...others}
    >
      {title}
      <span className={classes.icon}>
        {loading ? spinner : icon ?? <ArrowRightIcon />}
      </span>
    </Button>
  );
};

export default ActionButton;
