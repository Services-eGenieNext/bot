/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const styles = createStyles({
  handle: {
    '&$disabled &.react-flow__handle.connectable': {
      pointerEvents: 'none',
    },
    '&.react-flow__handle-top.target, &.react-flow__handle-bottom.source': {
      width: 224,
      height: 20,
      borderRadius: 0,
      border: 0,
      background: 'rgba(0,0,0,0)',
    },
    '&.react-flow__handle-left.target, &.react-flow__handle-right.source': {
      width: 30,
      height: 'calc(100% - 75px)',
      borderRadius: 0,
      border: 0,
      background: 'rgba(0,0,0,0)',
    },
  },
  handleIcon: {
    position: 'absolute',
    height: 20,
    width: 20,
    fill: '#6e00e6',
    padding: 4,
    border: '1px solid #6e00e6',
    backgroundColor: '#fff',
    borderRadius: '50%',
    pointerEvents: 'none',
    display: 'initial',
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
    transform: 'initial',
    opacity: 1,
    '&$top': {
      top: -9,
      opacity: 0,
      left: 'calc(50% - 10px)',
    },
    '&$bottom': {
      bottom: -9,
      left: 'calc(50% - 10px)',
    },
    '&$left': {
      top: 'calc(50% - 10px)',
      left: -9,
      transform: 'rotate(-90deg)',
      opacity: 0,
    },
    '&$right': {
      top: 'calc(50% - 10px)',
      right: -11,
      transform: 'rotate(-90deg)',
    },
  },
  disabled: {
    visibility: 'hidden',
  },
  top: {},
  right: {},
  bottom: {},
  left: {},
});

export const useStyles = makeStyles(styles);
