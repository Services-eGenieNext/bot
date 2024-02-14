/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useState } from 'react';
import {
  ListSubheader,
  ListItem,
  Menu,
  MenuItem,
  ListItemText,
} from '@material-ui/core';
import { useStyles } from './styles';
import { VariableItem, VariablesData, VariableSelectProps } from './types';
import { VariableButton } from './VariableButton';

export type VariableMenuProps = VariableSelectProps & {
  variables?: VariablesData;
};

export const VariableMenu: FC<VariableMenuProps> = props => {
  const classes = useStyles();
  const { className, variables, onSelect } = props;
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuSelect = (
    category: string,
    variable: string,
    variableItem: VariableItem,
  ) => {
    const variablePrefix = category !== 'global' ? category : undefined;
    const variableName = [variablePrefix, variable].filter(v => v).join('.');
    onSelect && onSelect(variableName, variableItem);
    handleClose();
  };

  const categories = variables
    ? ['global', 'user', 'response'].filter(category => variables[category])
    : [];
  return (
    <div className={className}>
      <VariableButton onClick={handleMenuClick} />
      <Menu
        className={classes.variableMenu}
        elevation={0}
        open={open}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handleClose}
      >
        {variables &&
          categories.map((category, index) => [
            <ListSubheader
              key={category + index}
              className={classes.menuSubheader}
            >
              {category}
            </ListSubheader>,
            ...Object.entries<VariableItem>(variables[category]).map(
              ([variable, item], index) => (
                <ListItem
                  button
                  dense
                  key={variable + index}
                  onClick={() => handleMenuSelect(category, variable, item)}
                >
                  <ListItemText primary={item.displayName} />
                </ListItem>
              ),
            ),
          ])}
        <MenuItem />
      </Menu>
    </div>
  );
};
