/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';

export const styles = () =>
  createStyles({
    container: {
      fontSize: pxToRem(12),
      border: 'solid 1px #dedede',
      borderRadius: '4px',
      height: '32px',
    },
    input: {
      '& .MuiOutlinedInput-root': {
        height: 30,
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 0,
      },
    },
    fieldLabel: {
      fontSize: pxToRem(12),
    },
    label: {
      lineHeight: '30px',
      height: '30px',
      minWidth: '32px',
      backgroundColor: '#fafafa',
      textAlign: 'center',
      padding: '0 8px',
    },
    labelLeft: {
      borderRight: 'solid 1px #dedede',
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px',
    },
    labelRight: {
      borderLeft: 'solid 1px #dedede',
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
    },
  });

export const useStyles = makeStyles(styles);
