/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { castImmutable } from 'immer';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import { AnswerValue, ResponseComponent } from 'shared/types';
import { getObjectEntries, logger } from 'shared/utils';
import {
  BlockReference,
  deserializeAnswers,
  emitAnswersUpdated,
  getBlock,
  getSerializedVariables,
  reCalculateStateVariables,
  refreshPredefinedValues,
  sanitizedAnswers,
  SerializedAnswer,
} from 'user-ui/lib';
import { BotUiReducer } from '../state';

export interface AnswerReducers {
  setAnswersAction: BotUiReducer<SerializedAnswer[]>;
  updateAnswer: BotUiReducer<AnswerValue>;
  addNewAnswer: BotUiReducer<{ blockId: string }>;
  deleteAnswer: BotUiReducer<{ blockId: string }>;
  deleteAnswerByIndex: BotUiReducer<{ blockId: string; index: number }>;
  moveAnswerToTail: BotUiReducer<{
    blockId: string;
    index: number;
    keepLast?: boolean;
  }>;
  setAnswersAsValid: BotUiReducer<BlockReference>;
  setAnswersAsSkipped: BotUiReducer<BlockReference>;
}

export const answerReducers: AnswerReducers = {
  setAnswersAction(state, action) {
    if (!state.initialized) {
      logger.error(
        'Bot configs are not initialized, could not set resume response values.',
      );
      return;
    }

    const serializedAnswers = sanitizedAnswers(action.payload);
    const { answers, apiState } = deserializeAnswers(serializedAnswers);
    state.answers = state.validAnswers = answers;
    state.apiState = apiState;

    reCalculateStateVariables(state);
    const variables = getSerializedVariables(state);
    state.answers = state.validAnswers = refreshPredefinedValues(
      state.bots,
      state.answers,
      variables,
    );
    state.resumed = true;
  },
  updateAnswer(state, action) {
    const { blockId, componentId } = action.payload;
    const answers = (state.answers[blockId] = state.answers[blockId] ?? []);
    const index = answers.length > 0 ? answers.length - 1 : 0;
    const lastAnswer = answers[index];
    const newComponentAnswer = Object.fromEntries(
      getObjectEntries(action.payload).filter(
        ([key, value]) => typeof value !== 'undefined',
      ),
    ) as AnswerValue;

    const currentComponentAnswer: AnswerValue | undefined =
      lastAnswer && lastAnswer[componentId];

    const componentAnswer: AnswerValue = {
      ...currentComponentAnswer,
      ...newComponentAnswer,
    };

    answers[index] = {
      ...(answers[index] ?? {}),
      [componentId]: componentAnswer,
    };
  },
  addNewAnswer(state, action) {
    const { blockId } = action.payload;
    const answers = (state.answers[blockId] = state.answers[blockId] ?? []);
    answers.push({});
  },
  deleteAnswer(state, action) {
    const { blockId } = action.payload;
    const answers = (state.answers[blockId] = state.answers[blockId] ?? []);
    answers.pop();
  },

  deleteAnswerByIndex(state, action) {
    const { blockId, index } = action.payload;
    const answers = (state.answers[blockId] = state.answers[blockId] ?? []);
    answers.splice(index, 1);
  },

  moveAnswerToTail(state, action) {
    const { blockId, index, keepLast } = action.payload;
    const answers = (state.answers[blockId] = state.answers[blockId] ?? []);
    const ans = cloneDeep(answers.splice(index, 1)[0]);
    if (ans) {
      if (!keepLast) {
        answers.pop();
      }
      answers.push(ans);
    }
  },
  setAnswersAsValid(state, action) {
    const blockRef = action.payload;
    const { blockId } = blockRef;
    state.validAnswers[blockId] = state.answers[blockId] =
      state.answers[blockId] ?? [];

    const block = getBlock(state.bots, blockRef);
    const apiStatus = state.apiState[blockId];
    const componentId = get(block, 'components[0].id');
    if (apiStatus) {
      const apiComponent: ResponseComponent | undefined = get(
        apiStatus,
        'response.components[0]',
      );
      const variableName = apiComponent?.props?.variable;
      const variableValue = get(
        state.validAnswers,
        `${blockId}[0].${componentId}.displayText`,
      );

      if (variableName && variableValue) {
        set(apiStatus, `response.data.${variableName}`, variableValue);
      }
    }
    reCalculateStateVariables(state);
    emitAnswersUpdated(castImmutable(state), blockRef);
  },
  setAnswersAsSkipped(state, action) {
    const blockRef = action.payload;
    const { blockId } = blockRef;

    if (!blockId) {
      return;
    }

    const validAnswers = cloneDeep(state.validAnswers[blockId]);
    state.answers[blockId] = validAnswers ?? [];
    state.apiState[blockId] = {};

    emitAnswersUpdated(castImmutable(state), blockRef);
  },
};
