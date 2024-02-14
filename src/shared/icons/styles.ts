/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const styles = createStyles({
  svgInline: {
    display: 'inline-block',
    fontSize: 'var(--font-size, 1em)',
    lineHeight: '1em',
    height: '1em',
    overflow: 'visible',
    verticalAlign: '-0.125em',
    transform: 'var(--transform)',
    '& .primary,.fa-primary': {
      fill: 'var(--primary-color, currentColor)',
      opacity: 'var(--primary-opacity)',
    },
    '& .secondary,.fa-secondary': {
      fill: 'var(--secondary-color, currentColor)',
      opacity: 'var(--secondary-opacity)',
    },
  },
});

export const useStyles = makeStyles(styles);
