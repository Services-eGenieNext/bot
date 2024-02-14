/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createTypedIdentity } from 'shared/types';
import { pxToRem } from 'shared/styles/theme';
import { ConditionBlockProps } from './index';

const withProps = createTypedIdentity<Partial<ConditionBlockProps>>();

export const styles = createStyles({
  conditionBlock: {
    width: 112,
    height: 112,
    borderRadius: '50%',
    backgroundColor: '#fff',
    border: withProps(({ selected }) =>
      'solid 1px '.concat(selected ? '#6e00e6' : '#e3e3e3'),
    ),
    boxShadow: withProps(
      ({ selected }) =>
        `0 3px 10px 0 ${fade(selected ? '#6e00e6' : '#808080', 0.3)}`,
    ),
  },
  blockIcon: {
    position: 'absolute',
    top: 16,
    left: 36,
    border: '1px solid #0300e6',
    color: '#0300e6',
    backgroundColor: 'rgba(25, 21, 232, 0.15)',
  },
  blockTitle: {
    position: 'absolute',
    top: 60,
    left: 16,
    width: 84,
    textAlign: 'center',
    fontSize: pxToRem(12),
    color: '#111',
    maxHeight: '3em',
    overflow: 'hidden',
  },
  handleFalse: {
    left: '30px !important',
    backgroundColor: '#ff5e5e',
    border: '1px solid #e8e8e8',
  },
  handleTrue: {
    left: '60px !important',
    backgroundColor: '#52ea2a',
    border: '1px solid #e8e8e8',
  },
  handleSource: {
    top: '100px !important',
    width: '20px !important',
    height: '20px !important',
    transform: 'initial',
    fill: '#fff',
  },
  handleTarget: {
    width: '40px !important',
    height: '40px !important',
    borderRadius: '50%',
    opacity: 0,
  },
  paragraphs: {
    backgroundColor: '#fff',
    marginTop: 44,
    borderRadius: 4,
  },
});

export const useStyles = makeStyles(styles);
