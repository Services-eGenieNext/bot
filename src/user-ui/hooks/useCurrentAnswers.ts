/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  getAnswerById,
  getValidAnswers,
} from 'user-ui/features/answers/selectors';
import { BlockAnswer } from 'user-ui/lib';
import { useCurrentBlock } from './useCurrentBlock';

export const useCurrentAnswers = () => {
  const block = useCurrentBlock();
  const selectAnswer = useCallback(
    state => getAnswerById(state, block?.id),
    [block?.id],
  );

  return useSelector(selectAnswer);
};

export const useCurrentValidAnswer = (): BlockAnswer[] | undefined => {
  const currentBlock = useCurrentBlock();
  const answers = useSelector(getValidAnswers);
  return currentBlock?.id ? answers[currentBlock?.id] : undefined;
};
