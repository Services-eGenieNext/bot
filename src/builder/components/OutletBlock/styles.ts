/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const styles = createStyles({
  header: {
    backgroundColor: '#111',
  },
  blockContent: {
    marginTop: '4px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 180,
    '& > *': {
      marginTop: 4,
    },
  },
  focusable: {
    '&:focus': {
      border: '1px solid #6e00e6',
      outline: 'none',
    },
  },
  chapterBtn: {
    width: 150,
  },
});

export const useStyles = makeStyles(styles);
