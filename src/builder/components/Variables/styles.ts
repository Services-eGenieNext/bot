/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';

export const styles = createStyles({
  variableButton: {
    height: '16px',
    lineHeight: '16px',
    padding: '0 5px',
    borderRadius: '4px',
    border: 'solid 1px #dedede',
    backgroundColor: '#fff',
    color: '#6e00e6',
    fontSize: pxToRem(10),
    textTransform: 'none',
    minWidth: 68,
    marginLeft: 8,
  },
  variableMenu: {
    '& .MuiList-root': {
      backgroundColor: '#444',
      color: '#fff',
      '& *:focus': {
        outline: 'none',
      },
    },
    '& .MuiMenu-paper': {
      maxHeight: 300,
      minWidth: 200,
      scrollbarWidth: 'thin',
      '&::-webkit-scrollbar': {
        width: '10px',
      },

      '&::-webkit-scrollbar-track': {
        backgroundColor: '#444',
        borderRadius: '10px',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },

      '&::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
        backgroundColor: '#555',
      },
    },
    '& .MuiListSubheader-root': {
      lineHeight: 2,
    },
    '& .MuiListItemText-root, & .MuiListSubheader-root': {
      margin: 0,
      color: 'inherit',
    },
  },
  menuSubheader: {
    textTransform: 'capitalize',
  },
});

export const useStyles = makeStyles(styles);
