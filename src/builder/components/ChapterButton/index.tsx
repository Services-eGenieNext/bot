/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import clsx from 'clsx';
import { useStyles } from './styles';

export type ChapterButtonProps = {
  title?: string;
  icon?: ReactNode;
  active?: boolean;
  variant?: 'add' | 'normal';
  onClick?: ButtonProps['onClick'];
  className?: string;
};

const ChapterButton: FC<ChapterButtonProps> = props => {
  const { title, icon, variant, onClick, className, active } = props;
  const classes = useStyles({ active });

  return (
    <Button
      variant="outlined"
      size="small"
      className={clsx(
        className,
        classes.button,
        variant === 'add' ? classes.addButton : classes.chapterButton,
      )}
      startIcon={icon}
      title={title}
      onClick={onClick}
    >
      <div className={classes.buttonLabel}>{title}</div>
    </Button>
  );
};

export default ChapterButton;
