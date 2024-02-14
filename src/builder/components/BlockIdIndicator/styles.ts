/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { pxToRem } from 'shared/styles/theme';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      fontFamily: theme.typography.fontFamily,
      fontSize: pxToRem(12),
      border: 'solid 1px '.concat(theme.palette.grey['300']),
      borderRadius: '5px',
      height: '32px',
    },
    label: {
      padding: '0 10px',
      fontWeight: 600,
    },
    input: {
      fontSize: pxToRem(12),
      backgroundColor: theme.palette.grey['200'],
      padding: '0 10px',
      height: 30,
    },
    copyButton: {
      height: 30,
      width: 30,
      padding: 6,
    },
    copyIcon: {
      color: theme.palette.grey.A200,
      fontSize: pxToRem(14),
    },
    snackBar: {
      opacity: 0.8,
      color: '#eee',
    },
  });

export default styles;
