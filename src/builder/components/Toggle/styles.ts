/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';
import { createTypedIdentity } from 'shared/types';
import { ToggleProps } from './index';

const withProps = createTypedIdentity<ToggleProps>();

export const styles = (theme: Theme) =>
  createStyles({
    toggleInputRoot: {
      width: '100%',
      justifyContent: 'space-between',
      marginLeft: 4,
    },
    toggleLabel: {
      fontSize: pxToRem(14),
    },
    toggleIcon: {
      display: 'inline-block',
      '& > svg': {
        marginRight: 4,
      },
    },
    toggleRoot: {
      width: 25,
      height: 16,
      padding: 0,
      margin: '8px 4px',
    },
    toggleBase: {
      padding: 2,
      '& + .MuiSwitch-track': {
        backgroundColor: '#e8e8e8',
        borderRadius: 12,
        border: 'none',
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
      },
      '& .MuiSwitch-thumb': {
        width: 12,
        height: 12,
        boxShadow: 'none',
      },
      '&.Mui-checked': {
        transform: `translateX(${9}px)`,
        '& + .MuiSwitch-track': {
          backgroundColor: '#e8e8e8',
          border: `1px solid`,
          borderColor: withProps(({ disabled }) =>
            disabled ? '#c1c1c1' : theme.customs.toggleColor.on,
          ),
        },
        '& .MuiIconButton-label': {
          color: withProps(({ disabled }) =>
            disabled ? '#c1c1c1' : theme.customs.toggleColor.on,
          ),
        },
      },
      '& .MuiIconButton-label': {
        color: withProps(({ disabled }) =>
          disabled ? '#c1c1c1' : theme.customs.toggleColor.off,
        ),
      },
    },
  });

export const useStyles = makeStyles(styles);
