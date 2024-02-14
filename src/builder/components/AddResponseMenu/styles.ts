/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';

export const styles = createStyles({
  multiInputMenu: {
    '&  .MuiMenuItem-root': {
      fontSize: pxToRem(12),
    },
  },
});

export const useStyles = makeStyles(styles);
