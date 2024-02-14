/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const styles = createStyles({
  indicator: {
    cursor: 'pointer',
    border: 0,
    padding: 0,
    backgroundColor: 'transparent',
    marginLeft: 4,
    minHeight: 10,
    borderRadius: 15,
    display: 'inline-block',
  },
  indicatorBar: {
    width: 16,
  },
  indicatorDot: {
    flex: 1,
    minWidth: 10,
    maxWidth: 10,
  },
});

export const useStyles = makeStyles(styles);
