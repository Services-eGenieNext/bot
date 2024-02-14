/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  responsiveFontSizes,
} from '@material-ui/core/styles';

const _theme = createMuiTheme();
const breakpoints = _theme.breakpoints;

const customs = {
  sidePanelBackground: _theme.palette.grey['50'],
  drawerWidth: 256,
  toolbarHeight: 48,
  footerHeight: 48,
  appBarShadow: '0 7px 7px -7px '.concat(_theme.palette.divider),
  drawerShadow: '7px -1px 7px -7px '.concat(_theme.palette.divider),
  diagramPaneShadow: 'inset 0px 0px 5px 0px rgba(0,0,0,0.07)',
  toggleColor: {
    off: '#e74c3c',
    on: '#2ecc71',
  },
};

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    customs: typeof customs;
  }

  interface ThemeOptions {
    customs: typeof customs;
  }
}

export const pxToRem: (px: number) => string = px => {
  const rem = theme.typography.pxToRem(px);
  const [, valueStr, unit] = rem.match(/([\d.]+)(\w+)/) ?? [];
  const value = Number(valueStr).toFixed(3);
  return [value, unit].join('');
};

const theme = createMuiTheme({
  customs,
  mixins: {
    toolbar: {
      minHeight: customs.toolbarHeight,
      [`${breakpoints.up('xs')} and (orientation: landscape)`]: {
        minHeight: customs.toolbarHeight,
      },
      [breakpoints.up('sm')]: {
        minHeight: customs.toolbarHeight,
      },
    },
  },
  typography: {
    htmlFontSize:
      parseInt(window.getComputedStyle(document.body).fontSize) || 16,
    button: {
      fontSize: 12,
      fontWeight: 500,
    },
  },
  palette: {
    text: {
      primary: '#3d4851',
      secondary: '#637381',
    },
    primary: {
      main: '#6514dd',
    },
    secondary: {
      main: '#2fcc71',
    },
  },
});

export default responsiveFontSizes(theme);
