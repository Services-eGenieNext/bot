/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, {
  ChangeEventHandler,
  forwardRef,
  ReactEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
  WheelEventHandler,
} from 'react';
import { FormControl, InputGroup, Button, Spinner } from 'react-bootstrap';
import clsx from 'clsx';
import {
  ApiStatus,
  ResponseComponent,
  ResponseValidationType,
  ValidationType,
} from 'shared/types';
import { getRefValue } from 'shared/utils';
import {
  validateDate,
  validateEmail,
  validateName,
  validateNumber,
  validatePattern,
  validatePersonOrOrg,
  validatePhone,
} from 'user-ui/lib';
import './styles.scss';
import { useLocales } from 'shared/hooks';

type FreeTextInputProps = {
  className?: string;
  component?: ResponseComponent;
  value?: string;
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onKeyPress?: ReactEventHandler<HTMLInputElement>;
  onClick?: ReactEventHandler;
  isApiBlock?: boolean;
  onApiSubmit?: ReactEventHandler<HTMLElement>;
  apiStatus?: ApiStatus;
};

const FreeTextInput = forwardRef<HTMLInputElement, FreeTextInputProps>(
  (props, ref) => {
    const { translate } = useLocales();

    const {
      className,
      component,
      value,
      required,
      onChange,
      onKeyPress,
      onClick,
      isApiBlock,
      onApiSubmit,
      apiStatus,
    } = props;

    const [touched, setTouched] = useState(false);

    useEffect(() => {
      const inputRef = getRefValue(ref);
      inputRef?.setCustomValidity('');
      setTouched(!!value || !!inputRef?.value);
    }, [ref, value]);

    const validateInput = useCallback(
      (target: HTMLInputElement) => {
        const validationError = checkValidation(
          target.value,
          component?.props?.validation,
        );

        target.setCustomValidity(validationError);
      },
      [component?.props?.validation],
    );

    const isInvalid = useMemo(() => {
      if (!touched) {
        return false;
      }

      const validationError = checkValidation(
        value,
        component?.props?.validation,
      );

      return (required && !value) || !!validationError;
    }, [component?.props?.validation, required, touched, value]);

    const handleChange = useCallback(
      event => {
        setTouched(true);
        validateInput(event.target);
        onChange && onChange(event);
        const element = event.target;
        if (element.tagName === 'TEXTAREA') {
          element.style.height = '5px';
          element.style.height = Math.max(element.scrollHeight, 122) + 'px';
        }
      },
      [onChange, validateInput],
    );

    const handleBlur = useCallback(
      event => {
        setTouched(true);
        validateInput(event.target);
        if (touched) {
          event.target.reportValidity();
        }
      },
      [touched, validateInput],
    );

    const { title, hint, validation } = component?.props ?? {};

    const inputProps = useMemo(() => {
      const validationType = validation?.type;

      const inputType = getInputType(validationType);

      const inProps: {
        as: 'input' | 'textarea';
        rows?: number;
        type?: string;
      } =
        validationType === 'textarea'
          ? { as: 'textarea', rows: 3 }
          : { as: 'input', type: inputType };

      return inProps;
    }, [validation?.type]);

    const preventWheelOnNumber: WheelEventHandler<HTMLInputElement> = event => {
      if (event.currentTarget.type === 'number') {
        event.currentTarget.blur();
      }
    };

    if (!component) {
      return null;
    }

    const spinner = (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    );

    const isApiInsideListBlock = false;

    return (
      <InputGroup
        className={clsx(className, 'lawly-freetext', isApiBlock && 'api-input')}
      >
        <InputGroup.Prepend>
          <InputGroup.Text as={'label'} {...{ htmlFor: component.id }}>
            {title}
          </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          {...inputProps}
          id={component.id}
          name={component.id}
          placeholder={hint}
          value={value ?? ''}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={onKeyPress}
          onClick={onClick}
          onWheel={preventWheelOnNumber}
          isInvalid={isInvalid}
          required={required}
          ref={ref}
        />
        {isApiInsideListBlock && (
          <Button
            variant="primary"
            onClick={e => {
              onApiSubmit && onApiSubmit(e);
            }}
            onKeyPress={e => {
              if (onApiSubmit && (e.code === 'Space' || e.code === 'Enter'))
                onApiSubmit(e);
            }}
            disabled={!touched || isInvalid}
          >
            {apiStatus?.loading ? spinner : translate('buttons.next')}
          </Button>
        )}
      </InputGroup>
    );
  },
);

FreeTextInput.displayName = 'FreeTextInput';
export default FreeTextInput;

type InputType = 'tel' | 'email' | 'number' | 'date' | 'text';

const getInputType = (validationType?: ValidationType): InputType => {
  if (!validationType) {
    return 'text';
  }

  switch (validationType) {
    case 'phone':
      return 'tel';
    case 'email':
    case 'number':
    case 'date':
      return validationType;
    default:
      return 'text';
  }
};

const checkValidation = (
  value?: string,
  validation?: ResponseValidationType,
): string => {
  if (!value || !validation) {
    return '';
  }

  switch (validation.type) {
    case 'phone':
      return validatePhone(value);
    case 'email':
      return validateEmail(value);
    case 'number':
      return validateNumber(value);
    case 'date':
      return validateDate(value);
    case 'unique_id':
      return validatePersonOrOrg(value);
    case 'name':
      return validateName(value);
    case 'pattern':
      return validatePattern(value, validation.pattern);
    default:
      return '';
  }
};
