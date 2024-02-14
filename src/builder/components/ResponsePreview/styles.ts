/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';
import { createTypedIdentity } from 'shared/types';
import { ResponsePreviewProps } from './index';

const withProps = createTypedIdentity<ResponsePreviewProps>();

const styles = createStyles({
  button: {
    width: withProps(({ fullwidth }) => (fullwidth ? '100%' : 150)),
    height: 30,
    borderRadius: 8,
    border: 'solid 1px #f1f1f1',
    backgroundColor: '#ffffff',
    fontWeight: 400,
    textTransform: 'inherit',
    textAlign: 'left',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    '& .MuiButton-label': {
      display: 'inline-block',
    },
    '& .MuiButton-startIcon': {
      '& > svg': {
        verticalAlign: '-0.4em',
      },
      color: '#111',
      verticalAlign: '0.1em',
      display: 'inline-block',
    },
  },
  responseContent: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: '100%',
    '& > *': {
      maxWidth: ({ fullwidth }) => (fullwidth ? 'calc(100% - 40px)' : 150),
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  responsePlaceholder: {
    color: '#545454',
    fontStyle: 'italic',
    fontSize: pxToRem(10),
    lineHeight: pxToRem(12),
  },
  responseTitle: {
    color: '#111',
    fontSize: pxToRem(10),
    lineHeight: pxToRem(12),
  },
});

export default styles;

export const useStyles = makeStyles(styles);
