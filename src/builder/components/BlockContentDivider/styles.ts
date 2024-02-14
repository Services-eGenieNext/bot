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
    separator: {
      height: 2,
      width: '100%',
      margin: '8px 0 !important',
      padding: '0 !important',
      backgroundImage:
        'linear-gradient(to right, #f1f1f1 60%, rgba(255,255,255,0) 0%)',
      backgroundPosition: 'bottom',
      backgroundSize: '8px 1px',
      backgroundRepeat: 'repeat-x',
    },
    title: {
      color: '#d5d5d5',
      fontSize: pxToRem(10),
      textAlign: 'center',
      margin: '4px',
    },
  });

export const useStyles = makeStyles(styles);
