/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'shared/styles/theme';
import { createTypedIdentity } from 'shared/types';
import { AppButtonProps } from './index';

const withProps = createTypedIdentity<Partial<AppButtonProps>>();
const styles = (theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      color: withProps(({ active }) =>
        active ? theme.palette.common.black : theme.palette.grey['500'],
      ),
      fontSize: pxToRem(12),
      fontWeight: 400,
    },
    buttonLabel: {
      paddingTop: 2,
    },
  });

export default styles;

export const useStyles = makeStyles(styles);
