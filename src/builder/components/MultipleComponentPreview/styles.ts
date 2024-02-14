/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const styles = createStyles({
  previewContainer: {
    width: 200,
    margin: '0 auto',
    '& > *:not(:first-child)': {
      marginTop: 8,
    },
  },
});

export const useStyles = makeStyles(styles);
