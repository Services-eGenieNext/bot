/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    addButton: {
      '& .MuiFab-label': {
        flexDirection: 'column',
      },
      '&.MuiFab-colorInherit': {
        backgroundColor: '#111',
        color: '#fff',
      },
      height: '70px',
      width: '70px',
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 5,
    },
    addButtonIcon: {
      fontSize: '1.75em',
    },
    addButtonLabel: {
      marginTop: 4,
    },
    closeIcon: {
      fontSize: '3.5em',
      fill: '#fff',
    },
  });

export default styles;

export const useStyles = makeStyles(styles);
