/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';

const styles = (theme: Theme) =>
  createStyles({
    tabButton: {
      '&.MuiTab-root': {
        minWidth: 'auto',
        maxHeight: theme.customs.toolbarHeight,
        border: 'solid 1px #efefef',
        borderRight: 'none',
        borderTop: 'none',
        fontSize: pxToRem(14),
        '&:first-child': {
          borderLeft: 'none',
        },
      },
      '&.Mui-selected': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.common.white,
        borderBottom: 'none',
      },
      '&.Mui-disabled': {
        color: theme.palette.grey.A100,
      },
      '& .MuiBadge-badge': {
        margin: 0,
        width: 60,
        marginTop: -4,
        flexFlow: 'row nowrap',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        textAlign: 'right',
      },
    },
    sidePanelBar: {
      height: theme.customs.toolbarHeight,
    },
    tabPanel: {
      overflow: 'scroll',
      height: '100%',
      userSelect: 'none',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    tabIcon: {
      display: 'block',
    },
    tabIndicator: {
      display: 'none',
    },
  });

export const useStyles = makeStyles(styles);
export default styles;
