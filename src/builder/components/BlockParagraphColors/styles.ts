/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const styles = createStyles({
  paragraphColor: {
    margin: '8px 0 0 8px',
    '& > *': {
      marginLeft: '4px',
    },
  },
});

export default styles;

export const useStyles = makeStyles(styles);
