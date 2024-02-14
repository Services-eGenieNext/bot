/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import clsx from 'clsx';
import React, {
  ChangeEventHandler,
  forwardRef,
  ReactEventHandler,
} from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { ResponseComponent } from 'shared/types';
import './styles.scss';
import { getSettlementVariablesSum } from 'user-ui/features/variables/selectors';

type RangeInputProps = {
  className?: string;
  component?: ResponseComponent;
  value?: number;
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onKeyPress?: ReactEventHandler<HTMLInputElement>;
  onClick?: ReactEventHandler;
};

const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
  (props, ref) => {
    const {
      className,
      component,
      value = 0,
      required,
      onChange,
      onKeyPress,
      onClick,
    } = props;

    const { title } = component?.props ?? {};

    const settlementVariablesSum = useSelector(getSettlementVariablesSum);
    const settlementVariable = component?.props?.validation?.settlementVariable;
    const settlementSum = settlementVariablesSum[settlementVariable!] || 0;

    if (!component) {
      return null;
    }

    const min = 0;
    const max: number = 100 - settlementSum + value;
    const runnerPercentage: number = ((value - min) / (max - min)) * 100 || 0;

    return (
      <InputGroup className={clsx(className, 'lawly-range-input')}>
        <InputGroup.Prepend>
          <InputGroup.Text as={'label'} {...{ htmlFor: component.id }}>
            {title}
          </InputGroup.Text>
        </InputGroup.Prepend>
        <div className="range-value">{value}%</div>
        <FormControl
          type="range"
          min={min}
          max={max}
          id={component.id}
          name={component.id}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onClick={onClick}
          style={{
            background: `linear-gradient(to right, #00d166 0%, #00d166 ${runnerPercentage}%, #e9e9e9 ${runnerPercentage}%, #e9e9e9 100%)`,
          }}
          required={required}
          ref={ref}
        />
      </InputGroup>
    );
  },
);

RangeInput.displayName = 'RangeInput';

export default RangeInput;
