/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';
import { panelSection } from '../styles';

export const useStyles = makeStyles((theme: Theme) => ({
  panelSection: {
    ...panelSection,
    padding: 12,
  },
  panelTitle: {
    fontSize: pxToRem(14),
  },
  paragraphsList: {
    marginTop: 20,
  },
  actionButtons: {
    marginTop: 36,
    '& button': {
      color: '#6e00e6',
    },
  },
  notFound: {
    color: '#545454',
    fontSize: pxToRem(13),
  },
}));
