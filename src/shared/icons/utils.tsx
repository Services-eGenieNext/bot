/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { CSSProperties, FC, ReactElement } from 'react';
import clsx from 'clsx';
import theme from 'shared/styles/theme';
import { useStyles } from './styles';

type SVGComponentProps = React.SVGProps<SVGSVGElement> & { title?: string };
type SVGComponent = React.FunctionComponent<SVGComponentProps>;

export type IconProps = SVGComponentProps & {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryOpacity?: number;
  secondaryOpacity?: number;
  size?: string;
  flipX?: boolean;
  flipY?: boolean;
  colorVariant?: 'primary' | 'secondary';
  revertColors?: boolean;
  rotate?: number;
};

const useIcon = (Component: SVGComponent, props: IconProps): ReactElement => {
  const {
    className,
    primaryColor,
    secondaryColor,
    primaryOpacity = 1,
    secondaryOpacity = 0.4,
    size = 'inherit',
    flipX = false,
    flipY = false,
    colorVariant,
    revertColors,
    rotate,
    style,
    ...others
  } = props;

  const classes = useStyles();

  const primaryColorOverride = colorVariant
    ? theme.palette[colorVariant].main
    : primaryColor;

  const secondaryColorOverride = colorVariant
    ? theme.palette[colorVariant].main
    : secondaryColor;

  const transform = `scaleX(${flipX ? -1 : 1}) scaleY(${
    flipY ? -1 : 1
  }) rotate(${rotate || 0}deg)`;

  const iconStyle = {
    '--font-size': size,
    '--transform': transform,
    '--primary-color': revertColors
      ? secondaryColorOverride
      : primaryColorOverride,
    '--secondary-color': revertColors
      ? primaryColorOverride
      : secondaryColorOverride,
    '--primary-opacity': revertColors ? secondaryOpacity : primaryOpacity,
    '--secondary-opacity': revertColors ? primaryOpacity : secondaryOpacity,
  } as CSSProperties;

  return (
    <Component
      className={clsx(className, classes.svgInline)}
      style={{ ...iconStyle, ...style }}
      {...others}
    />
  );
};

export const createSvgIcon: (C: SVGComponent) => FC<IconProps> = Component => {
  const SvgIcon: FC<IconProps> = (props: IconProps) =>
    useIcon(Component, props);
  SvgIcon.displayName = 'SvgIcon';
  return SvgIcon;
};
