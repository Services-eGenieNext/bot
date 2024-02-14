/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, MenuItem } from '@material-ui/core';
import { ComponentType } from 'shared/types';
import { actions } from 'builder/features/slice';
import ResponseButton from 'builder/components/ResponseButton';
import { useStyles } from './styles';

const AddResponseMenu: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleClose = useCallback(() => setAnchorEl(null), []);
  const addInput = useCallback(
    (type: ComponentType) => {
      dispatch(actions.addNewResponse(type));
      handleClose();
    },
    [dispatch, handleClose],
  );

  return (
    <>
      <ResponseButton
        buttonVariant={'add'}
        label={'Add'}
        onClick={event => setAnchorEl(event.currentTarget)}
      />
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={classes.multiInputMenu}
      >
        <MenuItem dense onClick={() => addInput(ComponentType.FreeSpeech)}>
          Free speech
        </MenuItem>
        <MenuItem dense onClick={() => addInput(ComponentType.Predefined)}>
          Predefined options
        </MenuItem>
      </Menu>
    </>
  );
};

export default AddResponseMenu;
