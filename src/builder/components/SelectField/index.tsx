/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useState,
} from 'react';
import { MenuItem, Select, SelectProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { isNil, isNumber } from 'shared/utils';
import styles from './styles';

export type SelectFieldProps<T> = SelectProps & {
  emptyLabel?: string;
  options: { label?: string; value?: T }[];
  onOptionChange: ChangeEventHandler<{ value: T }>;
  valueIndex?: number;
};

const useStyles = makeStyles(styles);

const SelectField = <T extends {}>(props: SelectFieldProps<T>) => {
  const classes = useStyles(props);
  const {
    emptyLabel,
    options,
    className,
    onChange,
    onOptionChange,
    onSelect,
    value,
    valueIndex,
    label,
    ...others
  } = props;

  const selectedValueIndex = isNumber(valueIndex)
    ? valueIndex
    : options.findIndex(opt => opt.value === value);

  const [selectedIndex, setIndex] = useState(selectedValueIndex);

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<any>, child) => {
      const newIndex = Number(event.target.value);
      const selectedOption = options[newIndex];
      const optionEvent: ChangeEvent<{ value: T }> = {
        ...event,
        target: {
          ...event.target,
          value: selectedOption?.value,
        },
      };
      onOptionChange(optionEvent);
      setIndex(newIndex);
      if (onChange) {
        onChange(event, child);
      }
    },
    [onChange, onOptionChange, options],
  );

  return (
    <div className={clsx(className, classes.selectField)}>
      {label && <div className={classes.fieldLabel}>{label}</div>}
      <Select
        fullWidth
        variant={'outlined'}
        margin={'dense'}
        displayEmpty={!!emptyLabel}
        value={selectedIndex}
        onChange={handleSelectChange}
        {...others}
      >
        {emptyLabel && (
          <MenuItem value={-1}>
            <em className={classes.emptyLabel}>{emptyLabel}</em>
          </MenuItem>
        )}
        {options
          .filter(({ label, value }) => !isNil(label) && !isNil(value))
          .map(({ label }, index) => (
            <MenuItem key={index} value={index}>
              {label}
            </MenuItem>
          ))}
      </Select>
    </div>
  );
};

export default SelectField;
