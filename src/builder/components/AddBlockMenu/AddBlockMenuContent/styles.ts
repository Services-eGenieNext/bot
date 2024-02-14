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
    menuContainer: {
      padding: '8px 16px',
      width: '240px',
    },
    menuSection: {
      marginTop: 8,
      '&:first-child': {
        marginTop: 0,
      },
    },
    sectionTitle: {
      margin: `${theme.spacing(1)}px 0`,
      textAlign: 'center',
    },

    blockBorder: {
      position: 'relative',
      border: 'solid 1px '.concat(theme.palette.grey['100']),
      backgroundColor: 'transparent',
      width: 85,
      height: 85,
      borderRadius: 5,
    },
    actionBorder: {
      position: 'relative',
      border: 'solid 1px '.concat(theme.palette.grey['100']),
      backgroundColor: 'transparent',
      borderRadius: '50%',
      width: 85,
      height: 85,
    },
    waypointBorder: {
      position: 'relative',
      border: 'solid 1px '.concat(theme.palette.grey['100']),
      backgroundColor: theme.palette.common.black,
      transform: 'rotate(45deg)',
      width: 65,
      height: 65,
      borderRadius: 10,
      marginLeft: 8,
    },
    waypointIcon: {
      fontSize: '1.5em',
      top: '4px',
      position: 'absolute',
      width: '100%',
      textAlign: 'center',
      color: '#fff',
    },
    waypointTitle: {
      position: 'absolute',
      textAlign: 'center',
      fontSize: pxToRem(12),
      width: '100%',
      top: '36px',
      color: '#fff',
    },
    blockType: {
      cursor: 'pointer',
      position: 'relative',
      width: '85px',
      height: '85px',
      display: 'inline-block',
      marginLeft: 12,
      '&:first-child': {
        marginLeft: 0,
      },
    },
    blockAvatar: {
      position: 'absolute',
      top: '12px',
      left: '22px',
    },
    blockTitle: {
      position: 'absolute',
      textAlign: 'center',
      fontSize: pxToRem(12),
      width: '100%',
      top: '56px',
    },
    textBlock: {
      backgroundColor: '#6e00e6',
    },
    triggerBlock: {
      border: '1px solid',
      borderColor: '#6e00e6',
      color: '#6e00e6',
      backgroundColor: 'rgba(110, 0, 230, 0.15)',
    },
    conditionBlock: {
      border: '1px solid',
      borderColor: '#0300e6',
      color: '#0300e6',
      backgroundColor: 'rgba(25, 21, 232, 0.15)',
    },
  });

export const useStyles = makeStyles(styles);
export default styles;
