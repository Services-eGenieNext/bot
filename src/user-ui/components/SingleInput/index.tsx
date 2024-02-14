/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import isEmpty from 'lodash/isEmpty';
import React, {
  forwardRef,
  ReactEventHandler,
  useCallback,
  useMemo,
} from 'react';
import {
  AnswerData,
  AnswerValue,
  ApiStatus,
  ResponseComponent,
} from 'shared/types';
import { AnswerChangeHandler } from 'shared/types/answers';
import { uuidv4 } from 'shared/utils';
import RangeInput from 'user-ui/components/RangeInput';
import FreeTextInput from '../FreeTextInput';
import PredefinedInput from '../PredefinedInput';

type SingleInputProps = {
  className?: string;
  component?: ResponseComponent;
  answer?: { [componentId: string]: AnswerValue | undefined };
  onChange: AnswerChangeHandler;
  onKeyPress?: ReactEventHandler;
  onClick?: ReactEventHandler;
  inline?: boolean;
  required?: boolean;
  onApiSubmit?: ReactEventHandler<HTMLElement>;
  isApiBlock?: boolean;
  apiStatus?: ApiStatus;
};

export const SingleInput = forwardRef<HTMLInputElement, SingleInputProps>(
  (props, ref) => {
    const {
      className,
      component,
      onChange,
      inline,
      answer,
      required,
      onKeyPress,
      onClick,
      isApiBlock,
      onApiSubmit,
      apiStatus,
    } = props;

    const componentId = useMemo(
      () => component?.id ?? uuidv4(),
      [component?.id],
    );

    const handleChange = useCallback(
      (answerData: Partial<AnswerData>) => {
        if (!answerData || !onChange) {
          return;
        }

        const { displayText } = answerData;

        onChange({
          ...answerData,
          displayText: displayText ?? '',
          componentId,
        });
      },
      [componentId, onChange],
    );

    const componentAnswer =
      answer && component?.id ? answer[component?.id] : undefined;

    const freeTextValue: string = useMemo(() => {
      if (!componentAnswer) {
        return '';
      }

      const { value, displayText } = componentAnswer;

      let result;

      if (!isEmpty(apiStatus)) {
        result = !apiStatus?.response ? value : displayText;
      } else {
        result = value ?? '';
      }
      return result ?? '';
    }, [apiStatus, componentAnswer]);

    return (
      <>
        {component?.type === 'freespeech' &&
          (component.props?.validation?.type === 'settlement' ? (
            <RangeInput
              className={className}
              component={component}
              value={Number(componentAnswer?.value) || 0}
              required={required}
              ref={ref}
              onKeyPress={onKeyPress}
              onClick={onClick}
              onChange={event => {
                handleChange({ value: event.currentTarget.value });
              }}
            />
          ) : (
            <FreeTextInput
              className={className}
              component={component}
              value={freeTextValue}
              required={required}
              ref={ref}
              onKeyPress={onKeyPress}
              onClick={onClick}
              onChange={event => {
                let answerData: Partial<AnswerData> = {
                  value: event.currentTarget.value,
                };

                if (apiStatus?.response) {
                  answerData = { displayText: event.currentTarget.value };
                }

                handleChange(answerData);
              }}
              isApiBlock={isApiBlock}
              onApiSubmit={e => {
                if (isApiBlock && onApiSubmit) {
                  onApiSubmit(e);
                }
              }}
              apiStatus={apiStatus}
            />
          ))}

        {component?.type === 'predefined' && (
          <PredefinedInput
            className={className}
            inline={inline}
            name={component.id}
            title={component?.props?.title}
            options={component.props?.options}
            selectedOptionId={componentAnswer?.selectedOptionId}
            required={required}
            ref={ref}
            onKeyPress={onKeyPress}
            onClick={onClick}
            onChange={event => {
              const selectedOptionId = event.currentTarget?.id;
              const opt = component?.props?.options?.find(
                opt => opt.id === selectedOptionId,
              );
              const value = opt?.value || opt?.title;
              handleChange({ value, selectedOptionId });
            }}
          />
        )}
      </>
    );
  },
);

SingleInput.displayName = 'SingleInput';
