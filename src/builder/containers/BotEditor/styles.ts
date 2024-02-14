/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const bodyStyle = (theme: Theme) => {
  const { fontSize, fontWeight, letterSpacing, lineHeight } =
    theme.typography.body2;

  return {
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
  };
};

const styles = (theme: Theme) =>
  createStyles({
    '@global': {
      html: {
        boxSizing: 'border-box',
      },
      '*, *::before, *::after': {
        boxSizing: 'inherit',
      },
      '.MuiPaper-root': {
        ...bodyStyle(theme),
      },
      '.wrapper': {
        height: '100%',
      },
    },
    root: {
      display: 'flex',
      height: '100%',
      color: theme.palette.text.primary,
      ...bodyStyle(theme),
      '& *:focus': {
        outline: 'none',
      },
    },
    main: {
      flexGrow: 1,
      width: '100%',
    },
    diagram: {
      height: `calc(100% - ${theme.customs.footerHeight}px)`,
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    diagramFooter: {
      height: `${theme.customs.footerHeight}px`,
      display: 'flex',
      flexFlow: 'row nowrap',
      maxWidth: 'calc(100vw - 260px)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    appBar: {
      '&.MuiAppBar-root': {
        zIndex: 0,
      },
      height: theme.customs.toolbarHeight,
      width: '100%',
      ...theme.mixins.toolbar,
    },
    chapterButton: {
      minWidth: 'fit-content',
    },
  });

export const useStyles = makeStyles(styles);
export default styles;
