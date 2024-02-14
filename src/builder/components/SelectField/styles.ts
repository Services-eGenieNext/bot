/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { pxToRem } from 'shared/styles/theme';

const styles = createStyles({
  selectField: {
    width: '100%',
    '& .MuiInputBase-input': {
      fontSize: pxToRem(14),
    },
    '& .MuiOutlinedInput-inputMarginDense': {
      paddingTop: 8,
      paddingBottom: 8,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#dedede',
    },
  },
  emptyLabel: {
    color: '#b4b4b4',
  },
  fieldLabel: {
    fontSize: pxToRem(12),
    color: '#111',
  },
});

export default styles;
