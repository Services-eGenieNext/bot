/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';
import { createTypedIdentity } from 'shared/types';
import { TextPreviewProps } from './index';

const withProps = createTypedIdentity<TextPreviewProps>();

const getBgColor = (opacity = 1) => `rgba(234,234,234, ${opacity})`;
const fontSize = 13;
const lineHeight = fontSize * 1.2;
const gutterSize = 8;
const getContainerHeight = (lines = 1) => lines * lineHeight + gutterSize * 2;
const getTextHeight = (lines = 1) => lines * lineHeight + gutterSize;

const getOverlayGradient = (lines = 1) => {
  if (lines < 2) {
    return 'none';
  }
  const endingPercentage = Math.min(100 / lines, 30);
  const gColor1 = getBgColor(1);
  const gColor2 = getBgColor(0.9);
  const gColor3 = getBgColor(0.05);
  return `linear-gradient(0deg, ${gColor1} 0%, ${gColor2} ${endingPercentage}%, ${gColor3} 90%)`;
};

const styles = createStyles({
  textPreviewContainer: {
    cursor: 'pointer',
    marginLeft: gutterSize / 2,
    marginRight: gutterSize / 2,
    height: withProps(({ lines }) => pxToRem(getContainerHeight(lines))),
    backgroundColor: getBgColor(),
    borderRadius: '12px',
    position: 'relative',
  },
  textOverlay: {
    height: '100%',
    width: '100%',
    backgroundImage: ({ lines }) => getOverlayGradient(lines),
    borderRadius: '12px',
    position: 'absolute',
    zIndex: 1,
  },
  textContent: {
    padding: gutterSize,
    margin: '0 4px',
    fontSize: pxToRem(fontSize),
    lineHeight: pxToRem(lineHeight),
    color: '#111111',
    overflow: 'hidden',
    height: ({ lines }) => pxToRem(getTextHeight(lines)),
    position: 'absolute',
    zIndex: 0,
    maxWidth: 'calc(100% - 16px)',
    textOverflow: 'ellipsis',
    whiteSpace: ({ lines = 1 }) => (lines > 1 ? 'normal' : 'nowrap'),
  },
  placeholder: {
    fontStyle: 'italic',
    color: '#bbb',
  },
});

export default styles;

export const useStyles = makeStyles(styles);
