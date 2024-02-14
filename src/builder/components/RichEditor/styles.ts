/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';
import { createTypedIdentity } from 'shared/types';
import { RichEditorProps } from './index';

const withProps = createTypedIdentity<Partial<RichEditorProps>>();

const styles = createStyles({
  root: {
    height: '100%',
    '& .ql-editor': {
      maxHeight: withProps(({ rowsMax }) =>
        rowsMax ? rowsMax * 16 + 24 : 'calc(100% - 290px)',
      ),
      minHeight: 120,
      overflowY: 'scroll',
      overflowX: 'hidden',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    '& .ql-disabled': {
      backgroundColor: '#f6f6f6',
    },
    '& .ql-container.ql-snow': {
      fontSize: pxToRem(13),
      fontFamily: "'Helvetica Neue', 'Roboto', Helvetica, Arial, sans-serif",
      border: 'none',
    },
    '& .ql-toolbar.ql-snow': {
      border: 'none',
      padding: 2,

      '&  button': {
        height: 20,
        width: 24,
        marginLeft: 2,
      },
      '& .ql-formats': {
        marginRight: 4,
      },
    },

    '& .ql-picker-label': {
      '&::before': {
        lineHeight: '12px',
      },
      '& svg': {
        width: 14,
      },
      paddingLeft: 4,
      outline: 'none',
    },

    '& .ql-picker': {
      height: 16, // 24px
      fontSize: '10px',
    },

    '& .ql-picker.ql-size': {
      width: 52,
    },

    '& .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg': {
      width: 14,
      marginTop: '-7px',
    },

    '& .ql-tooltip': {
      fontSize: pxToRem(12),
      left: '0 !important',
    },

    '& .ql-tooltip input[type=text]': {
      width: 104,
    },

    '& strong': {
      fontWeight: 600,
    },
  },
  editor: {
    display: 'flex',
    flexDirection: 'column-reverse',
    maxHeight: 'calc(100vh - 290px)',
  },
});

export default styles;

export const useStyles = makeStyles(styles);
