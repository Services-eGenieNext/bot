/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, {
  forwardRef,
  ReactEventHandler,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { debounce } from '@material-ui/core';
import {
  AnswerValue,
  Block,
  ResponseComponent,
  ComponentType,
} from 'shared/types';
import { AnswerChangeHandler } from 'shared/types/answers';
import { getComponents } from 'user-ui/lib';
import { SingleInput } from '../SingleInput';
import classes from './styles.module.scss';

type MultipleInputProps = {
  className?: string;
  block: Block;
  answer?: { [componentId: string]: AnswerValue | undefined };
  required?: boolean;
  onChange: AnswerChangeHandler;
  onKeyPress?: ReactEventHandler;
  onClick?: ReactEventHandler;
};

const MultipleInput = forwardRef<HTMLInputElement[], MultipleInputProps>(
  (props, ref) => {
    const { className, block, onChange, answer, onKeyPress, onClick } = props;
    const refStore = useRef<HTMLInputElement[]>([]);
    const setRef = useMemo(
      () =>
        debounce(() => {
          if (!ref) {
            return;
          }

          if (ref instanceof Function) {
            ref(refStore.current);
          } else {
            ref.current = refStore.current;
          }
        }, 100),
      [ref],
    );

    const addRef = useCallback(
      (el?: HTMLInputElement | null) => {
        if (el && refStore.current.indexOf(el) === -1) {
          refStore.current.push(el);
          setRef();
        }
      },
      [setRef],
    );
    return (
      <div className={className}>
        {getComponents(block)
          .filter(isComponentTypeValid)
          .map((comp, index) => (
            <SingleInput
              inline
              className={classes.inputItem}
              key={`${comp.id}-${index}`}
              onChange={onChange}
              component={comp}
              answer={answer}
              required={true}
              ref={addRef}
              onKeyPress={onKeyPress}
              onClick={onClick}
            />
          ))}
      </div>
    );
  },
);

MultipleInput.displayName = 'MultipleInput';
export default MultipleInput;

const isComponentTypeValid = (comp: ResponseComponent) => {
  return comp.type === ComponentType.Predefined || ComponentType.FreeSpeech;
};
