/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';

export const styles = (theme: Theme) =>
  createStyles({
    waypointBlock: {
      position: 'relative',
      padding: '14px',
    },
    diamond: {
      width: '80px',
      height: '80px',
      transform: 'rotate(45deg)',
      backgroundColor: '#111',
      borderRadius: 10,
    },
    blockIcon: {
      color: '#fff',
      position: 'absolute',
      zIndex: 2,
      textAlign: 'center',
      width: 80,
      height: 40,
      top: 10,
    },
    blockTitle: {
      position: 'absolute',
      zIndex: 2,
      width: 80,
      fontSize: pxToRem(12),
      color: '#fff',
      textAlign: 'center',
      left: 14,
      top: 50,
    },
    handle: {
      padding: 16,
      opacity: 0,
    },
  });

export const useStyles = makeStyles(styles);
