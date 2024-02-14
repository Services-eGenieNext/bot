/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';

const styles = (theme: Theme) =>
  createStyles({
    inputField: {
      borderRadius: 4,
      border: 'solid 1px #dedede',
      '&  .MuiOutlinedInput-notchedOutline': {
        display: 'none',
      },
    },
    footer: {
      borderTop: 'solid 1px #dedede',
      height: 24,
    },
    variables: {
      paddingLeft: 4,
    },
    label: {
      fontSize: pxToRem(12),
    },
  });

export default styles;

export const useStyles = makeStyles(styles);
