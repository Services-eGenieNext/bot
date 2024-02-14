/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

// import React, { FC, forwardRef, ReactEventHandler, useMemo } from 'react';
import React, { forwardRef, ReactEventHandler, useMemo } from 'react';
import { Form, FormCheckProps } from 'react-bootstrap';
import clsx from 'clsx';
// import { CheckIcon, CommentAltExclIcon } from 'shared/icons';
import { CheckIcon } from 'shared/icons';
import { PredefinedOptions } from 'shared/types';
import './styles.scss';
import {
  useTextArrayWithVariableValues,
  useTextWithVariableValues,
} from 'user-ui/hooks/useTextWithVariableValues';

type PredefinedInputProps = {
  className?: string;
  name: string;
  options?: PredefinedOptions[];
  onChange?: OptionItemProps['onChange'];
  onKeyPress?: ReactEventHandler;
  onClick?: ReactEventHandler;
  selectedOptionId?: string;
  inline?: boolean;
  title?: string;
  required?: boolean;
};

const PredefinedInput = forwardRef<HTMLInputElement, PredefinedInputProps>(
  (props, ref) => {
    const {
      className,
      name,
      onChange,
      selectedOptionId,
      inline: _inline,
      title,
      options = [],
      required,
      onKeyPress,
      onClick,
    } = props;

    const optionLabels = useTextArrayWithVariableValues(
      options.map(opt => opt.title),
    );

    const inline: boolean = useMemo(() => {
      if (!_inline) {
        return false;
      }
      return optionLabels.every(label => label.length < 8);
    }, [_inline, optionLabels]);

    if (!options.length) {
      return null;
    }

    return (
      <Form.Group className={clsx(className, 'lawly-predefined-input')}>
        {inline && title && (
          <Form.Label className="input-title">{title}</Form.Label>
        )}

        <fieldset
          className={inline ? 'options-container-inline' : 'options-container'}
        >
          {options?.map((opt, index) => (
            <OptionItem
              key={index}
              name={name}
              opt={opt}
              onChange={onChange}
              selectedId={selectedOptionId}
              inline={inline}
              required={required}
              ref={ref}
              onKeyPress={onKeyPress}
              onClick={onClick}
            />
          ))}
        </fieldset>
      </Form.Group>
    );
  },
);

PredefinedInput.displayName = 'PredefinedInput';
export default PredefinedInput;

type OptionItemProps = {
  name: string;
  opt: PredefinedOptions;
  onChange?: FormCheckProps['onChange'];
  selectedId?: string;
  inline?: boolean;
  required?: boolean;
  onKeyPress?: ReactEventHandler;
  onClick?: ReactEventHandler;
};

const OptionItem = forwardRef<HTMLInputElement, OptionItemProps>(
  (props, ref) => {
    const {
      name,
      opt,
      selectedId,
      onChange,
      inline,
      required,
      onKeyPress,
      onClick,
    } = props;

    const optionLabel = useTextWithVariableValues(opt.title);

    const containerClassName = [
      inline ? 'option-item-inline' : 'option-item',
      selectedId === opt.id ? 'checked' : '',
    ].join(' ');

    return (
      <div className={containerClassName}>
        <Form.Check type="radio">
          <Form.Check.Input
            ref={ref}
            type="radio"
            id={opt.id}
            name={name}
            value={opt.id}
            onChange={onChange}
            checked={selectedId === opt.id}
            required={required}
            onKeyPress={onKeyPress}
            onClick={onClick}
          />
          <Form.Check.Label>
            <div className={'radio-btn'}>
              <CheckIcon className={'check-icon'} />
            </div>
            <div className={'radio-label'} title={optionLabel}>
              {optionLabel}
            </div>
          </Form.Check.Label>
        </Form.Check>
        {/* <OptionHint text={opt.hint} /> */}
      </div>
    );
  },
);

OptionItem.displayName = 'MultipleInput';

// const OptionHint: FC<{ text?: string }> = props => {
//   const { text } = props;
//   const hintText = useTextWithVariableValues(text);
//   if (!text) {
//     return null;
//   }
//   return (
//     <div className={'option-hint'}>
//       <div className={'hint-icon'}>
//         <CommentAltExclIcon />
//       </div>
//       <div className={'hint-text'}>{hintText}</div>
//     </div>
//   );
// };
