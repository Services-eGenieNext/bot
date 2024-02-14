/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'shared/types';
import {
  BlockAnswer,
  BlockReference,
  getPreviousBlockAnswer,
  getPreviousBlockRef,
  getQuestionSequence,
  SequenceInfo,
  SerializedSubmitData,
} from 'user-ui/lib';
import { getSerializedSubmitData } from 'user-ui/lib/serialize';
import { initialState } from '../state';

const selectDomain = (state: RootState) => state.botUi || initialState;

export const getAnswers = createSelector([selectDomain], botUiState => {
  return botUiState.answers;
});

export const getAnswerById = createSelector(
  [getAnswers, (_, blockId: string | undefined) => blockId],
  (answers, blockId): BlockAnswer[] | undefined => {
    if (!blockId) {
      return;
    }
    return answers[blockId];
  },
);

export const getValidAnswers = createSelector([selectDomain], state => {
  return state.validAnswers;
});

export const getValidAnswerById = createSelector(
  [getValidAnswers, (_, blockId: string | undefined) => blockId],
  (validAnswers, blockId): BlockAnswer[] | undefined => {
    if (!blockId) {
      return;
    }
    return validAnswers[blockId];
  },
);

export const getPreviousBlockValue = createSelector(
  [selectDomain, (_, currentBlock: BlockReference | undefined) => currentBlock],
  (state, currentBlock) => {
    if (!currentBlock) {
      return;
    }

    return getPreviousBlockAnswer(state, currentBlock);
  },
);

export const getPreviousBlock = createSelector(
  [selectDomain, (_, currentBlock: BlockReference | undefined) => currentBlock],
  (state, currentBlock) => {
    if (!currentBlock) {
      return;
    }

    return getPreviousBlockRef(state, currentBlock);
  },
);

export const getAnswerSequence = createSelector(
  [selectDomain],
  (state): SequenceInfo[] => {
    return getQuestionSequence(state);
  },
);

export const getAnswerSequenceAll = createSelector(
  [selectDomain],
  (state): SequenceInfo[] => {
    return getQuestionSequence(state, true);
  },
);

export const getSubmitData = createSelector(
  [selectDomain],
  (state): SerializedSubmitData => {
    return getSerializedSubmitData(state);
  },
);

export const getResumed = createSelector([selectDomain], (state): boolean => {
  return state.resumed;
});
