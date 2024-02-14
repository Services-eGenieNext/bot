/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';
import { createTypedIdentity } from 'shared/types';
import { ChapterButtonProps } from './index';

const withProps = createTypedIdentity<Partial<ChapterButtonProps>>();
const styles = createStyles({
  button: {
    height: 36,
    margin: '6px 2px',
    fontSize: pxToRem(12),
    fontWeight: 400,
    minWidth: 36,
    '& .MuiButton-iconSizeSmall > *:first-child': {
      fontSize: pxToRem(14),
    },
  },
  chapterButton: {
    color: withProps(({ active }) => (active ? '#6e00e6' : '#111')),
    backgroundColor: ({ active }) =>
      active ? 'rgba(110, 0, 230, 0.1)' : '#fafafa',
    borderColor: ({ active }) => (active ? '#6e00e6' : '#efefef'),
  },
  addButton: {
    padding: '3px 0 3px 10px',
    border: '1px dashed #6e00e6',
    color: '#6e00e6',
    backgroundColor: '#fff',
  },
  buttonLabel: {
    paddingTop: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 164,
    width: '100%',
    textAlign: 'left',
    textTransform: 'initial',
    letterSpacing: '0.01em',
    fontSize: pxToRem(13),
  },
});

export default styles;

export const useStyles = makeStyles(styles);
