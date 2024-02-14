/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const styles = createStyles({
  blockContent: {
    margin: '4px',
    '& > *': {
      marginTop: 4,
    },
  },
  focusable: {
    '&:focus': {
      border: '1px solid #6e00e6',
      outline: 'none',
    },
  },
  multipleComponent: {
    width: 184,
    maxHeight: 140,
    overflowY: 'scroll',
    cursor: 'initial',
    paddingLeft: 12,
    paddingRight: 4,
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar': {
      width: 8,
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '25px',
      background: '#777',
      opacity: 0.7,
    },
  },
});

export const useStyles = makeStyles(styles);
