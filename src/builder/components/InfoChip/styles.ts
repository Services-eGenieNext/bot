/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { InfoChipProps } from 'builder/components/InfoChip/index';
import { pxToRem } from 'shared/styles/theme';
import { createTypedIdentity } from 'shared/types';

const withProps = createTypedIdentity<Partial<InfoChipProps>>();

const styles = createStyles({
  infoChip: {
    width: '100%',
    '&:not(:first-child)': {
      marginTop: '12px',
    },
    '&.MuiChip-outlined': {
      border: '1px solid #efefef',
    },
    '& .MuiChip-label': {
      width: 'calc(100% - 56px)',
      paddingLeft: 8,
    },
  },
  colorChip: {
    '&.MuiChip-icon': {
      backgroundColor: withProps(({ color }) => color),
      borderRadius: '50%',
      height: '30px',
      width: '30px',
      margin: 0,
    },
  },
  viewLabel: {
    '&.MuiChip-deleteIcon': {
      height: '30px',
      lineHeight: '30px',
      color: '#6e00e6',
      width: 'auto',
      paddingRight: 4,
      fontSize: pxToRem(10),
    },
  },
});

export const useStyles = makeStyles(styles);
