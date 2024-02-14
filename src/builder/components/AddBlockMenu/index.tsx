/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Popover, PopoverProps } from '@material-ui/core';
import { BlockTypes } from 'shared/types';
import { actions } from 'builder/features/slice';
import { useNewBlockPosition } from 'builder/hooks';
import AddBlockMenuContent from './AddBlockMenuContent';
import { useStyles } from './styles';

export type AddMenuProps = Omit<PopoverProps, 'open'>;

export const useAddBlockMenu = (): [
  FC<AddMenuProps>,
  (event: any) => void,
  boolean,
] => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const newBlockPosition = useNewBlockPosition();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectBlock = useCallback(
    (type: BlockTypes) => {
      dispatch(actions.createBlock({ type, position: newBlockPosition }));
      handleClose();
    },
    [dispatch, newBlockPosition],
  );

  const open = Boolean(anchorEl);

  const Menu: FC<AddMenuProps> = ({
    anchorOrigin,
    transformOrigin,
    ...rest
  }) => (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      transitionDuration={300}
      classes={{
        paper: classes.popover,
      }}
      anchorOrigin={
        anchorOrigin ?? {
          vertical: 'bottom',
          horizontal: 'left',
        }
      }
      transformOrigin={
        transformOrigin ?? {
          vertical: 'top',
          horizontal: 'left',
        }
      }
      {...rest}
    >
      <div className={classes.popoverArrow} />
      <Paper elevation={8}>
        <AddBlockMenuContent onSelect={handleSelectBlock} />
      </Paper>
    </Popover>
  );
  return [Menu, handleClick, open];
};
