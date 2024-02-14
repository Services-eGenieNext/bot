/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import clsx from 'clsx';
import React, { memo, ReactNode, useMemo } from 'react';
import { FormControlLabel, Switch, SwitchProps } from '@material-ui/core';
import { useStyles } from './styles';

export type ToggleProps = SwitchProps & {
  icon?: ReactNode;
  labelText: string;
  withoutSwitch?: boolean;
};

const Toggle: React.FC<ToggleProps> = memo(props => {
  const classes = useStyles(props);
  const {
    className,
    icon,
    labelText,
    checked,
    onChange,
    name,
    disabled,
    withoutSwitch,
    ...others
  } = props;

  const switchControl = useMemo(() => {
    return !withoutSwitch ? (
      <Switch
        checked={checked ?? false}
        onChange={disabled ? () => void 0 : onChange}
        name={name}
        classes={{
          root: classes.toggleRoot,
          switchBase: classes.toggleBase,
        }}
        {...others}
      />
    ) : (
      <div />
    );
  }, [
    checked,
    classes.toggleBase,
    classes.toggleRoot,
    disabled,
    name,
    onChange,
    others,
    withoutSwitch,
  ]);

  return (
    <FormControlLabel
      control={switchControl}
      labelPlacement={'start'}
      classes={{
        root: clsx(className, classes.toggleInputRoot),
      }}
      label={
        <>
          {icon && <div className={classes.toggleIcon}>{icon}</div>}
          <span className={classes.toggleLabel}>{labelText}</span>
        </>
      }
    />
  );
});

Toggle.displayName = 'Toggle';
export default Toggle;
