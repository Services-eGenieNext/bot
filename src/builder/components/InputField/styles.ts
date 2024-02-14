/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { pxToRem } from 'shared/styles/theme';

const styles = createStyles({
  inputField: {
    width: '100%',
    '& .MuiOutlinedInput-root.Mui-disabled': {
      backgroundColor: '#f6f6f6',
      color: '#111',
    },
    '& .MuiInputBase-input': {
      fontSize: pxToRem(13),
    },
    '& .MuiOutlinedInput-inputMarginDense': {
      paddingTop: 8,
      paddingBottom: 8,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#dedede',
    },
  },
  fieldLabel: {
    fontSize: pxToRem(12),
  },
});

export default styles;
