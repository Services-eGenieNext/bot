/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { Fab } from '@material-ui/core';
import { LayerPlusIcon, TimesIcon } from 'shared/icons';
import { useAddBlockMenu } from 'builder/components/AddBlockMenu';
import { useStyles } from './styles';

export type AddBlockButtonProps = {};

const AddBlockButton: FC<AddBlockButtonProps> = () => {
  const classes = useStyles();
  const [AddBlockMenu, handleAddMenuClick, isMenuOpen] = useAddBlockMenu();
  return (
    <>
      <Fab
        className={classes.addButton}
        color={isMenuOpen ? 'inherit' : 'primary'}
        size={'large'}
        aria-label="add"
        onClick={handleAddMenuClick}
      >
        {isMenuOpen ? (
          <TimesIcon className={classes.closeIcon} />
        ) : (
          <>
            <LayerPlusIcon className={classes.addButtonIcon} />
            <div className={classes.addButtonLabel}>+Block</div>
          </>
        )}
      </Fab>
      <AddBlockMenu
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      />
    </>
  );
};

export default AddBlockButton;
