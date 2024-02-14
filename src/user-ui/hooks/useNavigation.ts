/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { SyntheticEvent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isApiBlock, isPresentationBlock } from 'shared/types';
import { getObjectValues, logger } from 'shared/utils';
import { getApiStatus } from 'user-ui/features/api/selectors';
import { getBlockDepth } from 'user-ui/features/selectors';
import { actions } from 'user-ui/features/slice';
import { useCurrentAnswers } from 'user-ui/hooks/useCurrentAnswers';
import {
  useCurrentBlock,
  useCurrentBlockRef,
} from 'user-ui/hooks/useCurrentBlock';
import { getComponents } from 'user-ui/lib';

export const useNavigation = () => {
  const handlePrevious = useHandlePrevious();
  const handleNext = useHandleNext();
  const handleSkip = useHandleSkip();
  const nextDisabled = useNextDisabled();
  const skipDisabled = useSkipDisabled();
  const backDisabled = useBackDisabled();

  return {
    handlePrevious,
    handleNext,
    handleSkip,
    nextDisabled,
    skipDisabled,
    backDisabled,
  };
};

type NavigationHandler = (event?: SyntheticEvent) => any;

const useHandlePrevious = (): NavigationHandler => {
  const history = useHistory();

  return useCallback(() => {
    history.goBack();
  }, [history]);
};

const useHandleNext = (): NavigationHandler => {
  const dispatch = useDispatch();
  const currBlockRef = useCurrentBlockRef();
  const currBlock = useCurrentBlock();
  const nextDisabled = useNextDisabled();

  return useCallback(() => {
    if (!currBlockRef || !currBlock) {
      logger.error('Could not recognize current question', {
        blockRef: currBlockRef,
        block: currBlock,
      });
      return;
    }

    if (nextDisabled) {
      logger.debug('not possible to go next with current state', {
        currentBlock: currBlock,
      });
      return;
    }

    dispatch(actions.updateNext(currBlockRef));
  }, [currBlock, currBlockRef, dispatch, nextDisabled]);
};

const useHandleSkip = (): NavigationHandler => {
  const dispatch = useDispatch();
  const currBlockRef = useCurrentBlockRef();
  const currBlock = useCurrentBlock();
  const skipDisabled = useSkipDisabled();

  return useCallback(() => {
    if (!currBlockRef || !currBlock) {
      logger.error('Could not recognize current question', {
        blockRef: currBlockRef,
        block: currBlock,
      });
      return;
    }

    if (skipDisabled) {
      logger.debug('current block is not skippable.', {
        currentBlock: currBlock,
      });
      // return;
    }

    dispatch(actions.updateNext(currBlockRef));
  }, [currBlock, currBlockRef, dispatch, skipDisabled]);
};

const useNextDisabled = (): boolean => {
  const currBlock = useCurrentBlock();
  const currAnswers = useCurrentAnswers();
  const apiStatus = useSelector(state => getApiStatus(state, currBlock?.id));

  if (
    currBlock &&
    isApiBlock(currBlock) &&
    apiStatus &&
    !apiStatus.error &&
    !apiStatus.loading &&
    apiStatus.response
  ) {
    return false;
  }

  const answersArr = currAnswers?.flatMap(ans => getObjectValues(ans)) ?? [];
  const numOfInputs = getComponents(currBlock).length;
  const expectTotalAnswer = (currAnswers?.length || 1) * numOfInputs;
  const allHasValues = answersArr.every(a => a.value || a.selectedOptionId);
  return expectTotalAnswer !== answersArr?.length || !allHasValues;
};

const useSkipDisabled = (): boolean => {
  const currBlock = useCurrentBlock();
  return !currBlock || !currBlock.next?.id || isPresentationBlock(currBlock);
};

const useBackDisabled = (): boolean => {
  const currBlock = useCurrentBlock();
  const currBlockDepth = useSelector(state =>
    getBlockDepth(state, currBlock?.id || ''),
  );

  return !!currBlock && isPresentationBlock(currBlock) && currBlockDepth === 1;
};
