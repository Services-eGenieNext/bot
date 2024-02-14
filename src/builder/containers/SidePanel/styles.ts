/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';

export const panelSectionBase = {
  padding: '12px 8px',
  borderBottom: 'solid 1px #efefef',
  backgroundColor: '#fff',
};
export const panelSection = {
  ...panelSectionBase,
  '&:not(:first-child)': {
    borderTop: 'solid 1px #efefef',
    marginTop: 12,
  },
};

const styles = (theme: Theme) =>
  createStyles({
    sidePanel: {
      width: theme.customs.drawerWidth,
      minWidth: theme.customs.drawerWidth,
      borderRight: 'solid 1px #efefef',
      backgroundColor: theme.customs.sidePanelBackground,
      height: '100%',
    },
    sidePanelMain: {
      height: '100%',
    },
    emptyIconAvatar: {
      height: 50,
      width: 50,
      backgroundColor: theme.palette.grey['200'],
    },
    emptyPanelMessage: {
      textAlign: 'center',
      color: theme.palette.grey['500'],
      fontSize: pxToRem(12),
      padding: '10px 30px',
    },
  });

export default styles;

export const useStyles = makeStyles(styles);
