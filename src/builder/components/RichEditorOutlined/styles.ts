/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';

const styles = createStyles({
  richEditorOutlined: {
    borderRadius: 4,
    border: 'solid 1px #dedede',
    '& .ql-toolbar': {
      borderBottom: 'solid 1px #dedede',
    },
  },
  editorFooter: {
    display: 'flex',
    flexFlow: 'row  nowrap',
    justifyContent: 'space-between',
    borderTop: 'solid 1px #dedede',
    height: 24,
  },
  lengthCounter: {
    flex: '1 1 100%',
    fontSize: pxToRem(10),
    color: '#444',
    textAlign: 'right',
    lineHeight: '22px',
    paddingRight: 10,
  },
  editorTitle: {
    margin: 10,
    fontSize: pxToRem(12),
    color: '#111',
    fontWeight: 'bold',
  },
});

export default styles;

export const useStyles = makeStyles(styles);
