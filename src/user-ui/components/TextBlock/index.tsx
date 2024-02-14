/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import React, { FC, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BlockTypes, ComponentType, ResponseComponent } from 'shared/types';
import { logger } from 'shared/utils';
import ApiConfirm from 'user-ui/components/ApiConfirm';
import ApiInput from 'user-ui/components/ApiInput';
import { SingleInput } from 'user-ui/components/SingleInput';
import { BlockProps } from 'user-ui/containers/BlockRenderer';
import { getAnswerById } from 'user-ui/features/answers/selectors';
import { getApiStatus } from 'user-ui/features/api/selectors';
import { getBlockByReference } from 'user-ui/features/bots/selectors';
import { actions } from 'user-ui/features/slice';
import { getComponents, isBlockRequired } from 'user-ui/lib';

const TextBlock: FC<BlockProps> = props => {
  const {
    className,
    blockRef,
    onChange,
    inputRefs,
    onKeyPress,
    onClick,
    key = 0,
  } = props;
  const { blockId } = blockRef ?? {};
  const currentAnswers = useSelector(state => getAnswerById(state, blockId));
  const apiStatus = useSelector(state => getApiStatus(state, blockId));
  const block = useSelector(state => getBlockByReference(state, blockRef));
  const dispatch = useDispatch();
  const required = isBlockRequired(block);

  const handleConfirmReject = useCallback(() => {
    dispatch(actions.apiReset({ blockRef }));
  }, [blockRef, dispatch]);

  const apiComponent: ResponseComponent | undefined = useMemo(
    () => cloneDeep(get(apiStatus, 'response.components[0]')),
    [apiStatus],
  );

  const component = getComponents(block)[0];

  const inputProps = useMemo(
    () => ({
      className,
      component,
      isApiBlock: block?.type === BlockTypes.API,
      onChange: onChange,
      answer: currentAnswers ? currentAnswers[0] : {},
      required,
      onKeyPress,
      onClick,
      ref: (el: HTMLInputElement) => {
        if (!el) {
          return;
        }
        const refs: HTMLInputElement[] = inputRefs?.current ?? [];
        const isAlreadyAdded = refs.some(i => {
          return i === el || (i.id === el.id && i.className === el.className);
        });

        if (!isAlreadyAdded) {
          refs.push(el);
        }
      },
      apiStatus: apiStatus,
    }),
    [
      apiStatus,
      block?.type,
      className,
      component,
      currentAnswers,
      inputRefs,
      onChange,
      onKeyPress,
      onClick,
      required,
    ],
  );

  if (!block) {
    return null;
  }

  const apiProps = apiComponent?.props;
  if (apiComponent && apiProps) {
    apiComponent.id = component?.id
      ? component.id
      : `${blockId}-api-comp-${key}`;

    if (apiProps.options) {
      apiProps.options = apiProps.options.map((opt, i) => {
        opt.id = `${blockId}-api-comp-${key}-opt-${i}`;
        return opt;
      });
    }

    switch (apiComponent.type) {
      case ComponentType.Confirm: {
        const lines = apiProps.lines;

        if (lines) {
          return <ApiConfirm lines={lines} onReject={handleConfirmReject} />;
        }
        break;
      }

      case ComponentType.FreeSpeech: {
        return (
          <ApiInput
            {...inputProps}
            component={apiComponent}
            onReject={handleConfirmReject}
          />
        );
      }
      default:
        logger.error(
          'Api return with component type/props with is unknown or not implemented yet.',
        );
    }
  }

  return (
    <SingleInput
      {...inputProps}
      onApiSubmit={() => {
        dispatch(actions.callApi({ blockRef }));
      }}
    />
  );
};

export default TextBlock;
