/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { ApiStatus, BlockNodesMap, BotsMap, PartialRecord } from 'shared/types';
import { BlockAnswer, BlockReference } from 'user-ui/lib';

export interface BotUiState {
  bots: BotsMap;
  variables: VariablesState;
  optionVariables: VariablesState;
  answers: AnswersState;
  validAnswers: AnswersState;
  resumed: boolean;
  graph: BlockNodesMap;
  maxDepth: number;
  isChapterBased: boolean;
  navigation: NavigationState;
  apiState: ApiState;
  initialized: boolean;
}

/*
 * answerValue = answersState[blockId][0][componentId]
 */
export type AnswersState = {
  [blockId: string]: BlockAnswer[] | undefined;
};

export type NavigationState = {
  previous?: BlockReference;
  current?: BlockReference;
  next?: BlockReference;
};

export type ApiState = {
  [blockId: string]: ApiStatus;
};

export type VariablesState = PartialRecord<string, string | any[]>;

export type BotUiReducer<P = undefined> = CaseReducer<
  BotUiState,
  PayloadAction<P>
>;

export const initialState: BotUiState = {
  bots: {},
  variables: {},
  optionVariables: {},
  answers: {},
  validAnswers: {},
  resumed: false,
  graph: {},
  maxDepth: 0,
  isChapterBased: false,
  navigation: {},
  apiState: {},
  initialized: false,
};
