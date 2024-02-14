/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { pxToRem } from 'shared/styles/theme';

const styles = (theme: Theme) =>
  createStyles({
    button: {
      '&:not(:first-child)': {
        marginTop: 8,
      },
      width: '150px',
      height: 30,
      overflow: 'hidden',
      borderRadius: 8,
      border: 'solid 1px #f1f1f1',
      margin: theme.spacing(1),
      backgroundColor: '#ffffff',
      color: '#111111',
      fontSize: pxToRem(12),
      fontWeight: 400,
      textTransform: 'inherit',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'block',
      '&$selected': {
        backgroundColor: 'rgba(110, 0, 230, 0.1)',
        border: '1px solid #6e00e6',
      },
    },
    addBtn: {
      color: '#6e00e6',
      border: 'dashed 1px #6e00e6',
    },
    fullWidth: {
      width: '100%',
    },
    buttonLabel: {
      paddingTop: 2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    selected: {},
  });

export default styles;
