/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { pxToRem } from 'shared/styles/theme';

const styles = createStyles({
  predefinedPreview: {
    width: '100%',
    border: 'solid 1px #f1f1f1',
    borderRadius: 7,
    backgroundColor: '#f7f7f7',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 8,
    '& .MuiButton-outlinedSizeSmall': {
      padding: 0,
      border: 0,
    },
  },
  addOptButton: {
    border: 0,
    backgroundColor: 'transparent',
    color: '#6e00e6',
    textAlign: 'center',
    fontSize: pxToRem(10),
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    padding: 4,
    cursor: 'pointer',
  },
  resOptionsContainer: {
    padding: '0 16px',
  },
});

export default styles;
