/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import clsx from 'clsx';
import React, { FC, forwardRef, ReactEventHandler } from 'react';
import { Button } from 'react-bootstrap';
import {
  AnswerChangeHandler,
  AnswerValue,
  ApiStatus,
  ResponseComponent,
} from 'shared/types';
import { SingleInput } from 'user-ui/components/SingleInput';
import { TimesIcon, UserCheckIcon } from 'shared/icons';
import classes from './styles.module.scss';

type ApiInputProps = {
  className?: string;
  component: ResponseComponent;
  onChange: AnswerChangeHandler;
  answer?: { [componentId: string]: AnswerValue | undefined };
  apiStatus?: ApiStatus;
  onKeyPress?: ReactEventHandler;
  onReject: ReactEventHandler;
  inline?: boolean;
  required?: boolean;
};

const ApiInput: FC<ApiInputProps> = forwardRef<HTMLInputElement, ApiInputProps>(
  (props, ref) => {
    const {
      className,
      component,
      onChange,
      answer,
      onKeyPress,
      onReject,
      inline,
      required,
      apiStatus,
    } = props;

    const componentAnswer =
      answer && component?.id ? answer[component?.id] : undefined;

    return (
      <div className={clsx(className, classes.apiInput)}>
        <div className={classes.head}>
          <UserCheckIcon className={classes.checkIcon} secondaryOpacity={1} />
          <span className={classes.headText}>{componentAnswer?.value}</span>
          <Button
            variant={'danger'}
            className={classes.rejectBtn}
            onClickCapture={e => {
              onReject(e);
              e.stopPropagation();
            }}
          >
            <TimesIcon /> Ta bort
          </Button>
        </div>
        <SingleInput
          className={classes.inputField}
          component={component}
          onChange={onChange}
          answer={answer}
          onKeyPress={onKeyPress}
          inline={inline}
          required={required}
          apiStatus={apiStatus}
          ref={ref}
        />
      </div>
    );
  },
);

ApiInput.displayName = 'ApiInput';
export default ApiInput;
