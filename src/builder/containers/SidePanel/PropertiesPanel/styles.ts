/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';
import { panelSection, panelSectionBase } from '../styles';

export const styles = (theme: Theme) =>
  createStyles({
    panelSectionAttached: panelSectionBase,
    panelSection: {
      ...panelSection,
      padding: 8,
    },
    optionsContainer: {
      marginTop: 8,
      '& > *': {
        margin: 'auto',
        display: 'block',
      },
    },
    editor: {
      maxHeight: '100%',
    },
    panelTitleBold: {
      margin: '8px 0',
      fontSize: pxToRem(12),
      color: '#111',
      fontWeight: 'bold',
    },
    titleIcon: {
      verticalAlign: '-0.3em',
      marginRight: '8px',
    },
    validationControls: {
      marginLeft: '24px',
      '& .MuiRadio-root': {
        padding: '2px 8px',
        '&:hover': {
          backgroundColor: 'initial',
        },
        '&:not(.Mui-checked)': {
          color: 'rgba(0, 0, 0, 0.2)',
        },
      },
      '& .MuiFormControlLabel-label': {
        fontSize: pxToRem(12),
      },
    },
    deleteButton: {
      color: theme.palette.error.light,
      textAlign: 'center',
      margin: 8,
    },
    panelGridContainer: {
      width: '100%',
      height: '100%',
    },
    requiredToggle: {
      padding: '4px 12px',
    },
    blockIdIndicator: {
      margin: 12,
    },
    inputLabel: {
      fontSize: pxToRem(12),
      '&:not(:first-child)': {
        marginTop: 12,
      },
    },
    inputFields: {
      '& > *:not(:first-child)': {
        marginTop: 16,
      },
    },
    apiSelect: {
      marginTop: 12,
    },
    previewContainer: {
      width: 200,
      margin: '0 auto',
      '& > *:not(:first-child)': {
        marginTop: 8,
      },
    },
    focusable: {
      '&:focus': {
        border: '1px solid #6e00e6',
        outline: 'none',
      },
    },
  });

export const useStyles = makeStyles(styles);
