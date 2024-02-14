/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) =>
  createStyles({
    flowDiagram: {
      backgroundColor: '#fdfdfd',
      backgroundImage:
        'linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)',
      backgroundSize: '30px 30px',
      backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
      boxShadow: theme.customs.diagramPaneShadow,
      '& .react-flow__edge': {
        strokeDasharray: 0,
        transition: 'stroke-dasharray 200ms',
        '&.selected': {
          strokeDasharray: 4,
        },
      },
      '& .react-flow__edge-path': {
        strokeWidth: 2,
      },
      '& .react-flow__minimap-mask': {
        opacity: 0.8,
      },
    },
    flowControls: {
      boxSizing: 'content-box',
    },
  });

export const useStyles = makeStyles(styles);
