/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { pxToRem } from 'shared/styles/theme';

export const styles = createStyles({
  blockRoot: {
    border: 'solid 1px #e3e3e3',
    boxShadow: `0 3px 10px 0 ${fade('#808080', 0.3)}`,
    width: 224,
    minHeight: 96,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#fff',

    '&$selected, .selected &': {
      border: 'solid 1px #6e00e6',
      boxShadow: `0 3px 10px 0 ${fade('#6e00e6', 0.3)}`,
    },
  },
  blockHeader: {
    height: '40px',
    lineHeight: '40px',
    verticalAlign: 'middle',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: pxToRem(16),
    borderRadius: 4,
    margin: 4,
    color: '#fff',
    '& > *': {
      marginLeft: 8,
    },
  },
  blockContent: {
    margin: '4px 0',
    paddingBottom: 12,
    cursor: 'initial',
  },
  headerIcon: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  headerTitle: {
    display: 'inline-block',
    maxWidth: 140,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dotsIcon: {
    display: 'inline-block',
    position: 'absolute',
    textAlign: 'center',
    verticalAlign: 'top',
    right: '8px',
    width: '16px',
    cursor: 'pointer',
  },
  menuItem: {
    fontSize: pxToRem(14),
  },
  blockHandle: {
    opacity: 0,
    '&$selected, .selected &': {
      opacity: 1,
    },
  },
  selected: {},
});

export const useStyles = makeStyles(styles);
