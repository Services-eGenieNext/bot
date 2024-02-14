/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { castImmutable } from 'immer';
import { ApiResponse } from 'shared/types';
import { BotUiReducer } from 'user-ui/features/state';
import { BlockReference, emitAnswersUpdated } from 'user-ui/lib';

export type ApiPayload = {
  blockRef?: BlockReference;
  apiResponse?: ApiResponse;
  apiError?: string;
};

export interface ApiReducers {
  callApi: BotUiReducer<ApiPayload>;
  apiSucceed: BotUiReducer<ApiPayload>;
  apiFailed: BotUiReducer<ApiPayload>;
  apiReset: BotUiReducer<ApiPayload>;
}

export const apiReducers: ApiReducers = {
  callApi(state, action) {
    const { blockRef } = action.payload;
    const blockId = blockRef?.blockId;

    if (!blockId) {
      return;
    }

    state.apiState[blockId] = {
      loading: true,
      error: undefined,
      response: undefined,
    };
  },
  apiSucceed(state, action) {
    const { blockRef, apiResponse } = action.payload;

    if (!blockRef) {
      return;
    }

    state.apiState[blockRef.blockId] = {
      loading: false,
      response: apiResponse,
      error: undefined,
    };

    emitAnswersUpdated(castImmutable(state), blockRef);
  },
  apiFailed(state, action) {
    const { blockRef, apiError } = action.payload;
    const blockId = blockRef?.blockId;

    if (!blockId) {
      return;
    }

    state.apiState[blockId] = {
      loading: false,
      response: undefined,
    };

    window.alert(apiError);
  },
  apiReset(state, action) {
    const { blockRef } = action.payload;
    if (!blockRef) {
      return;
    }

    const blockId = blockRef.blockId;

    state.apiState[blockId] = {};
    state.validAnswers[blockId] = [];
    emitAnswersUpdated(castImmutable(state), blockRef);
  },
};
