/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const styles = createStyles({
  popover: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    padding: 20,
    marginTop: -10,
    marginLeft: 15,
  },
  popoverArrow: {
    position: 'absolute',
    top: 0,
    right: 40,
    borderBottom: '10px solid white',
    borderRight: '10px solid transparent',
    borderLeft: '10px solid transparent',
    borderTop: '10px solid transparent',
    zIndex: 5,
  },
});

export const useStyles = makeStyles(styles);
export default styles;
