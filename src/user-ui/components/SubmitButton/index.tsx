/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import clsx from 'clsx';
import classes from './styles.module.scss';

type SubmitButtonProps = ButtonProps & {};

const SubmitButton: FC<SubmitButtonProps> = props => {
  const { className, ...others } = props;
  return (
    <Button
      className={clsx(className, classes.submitButton)}
      variant={'none'}
      {...others}
    >
      Skicka in underlag
    </Button>
  );
};

export default SubmitButton;
