/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { call, put, select, takeLatest } from 'redux-saga/effects';
import { Block, isApiBlock } from 'shared/types';
import { logger } from 'shared/utils';
import { request } from 'shared/utils/request';
import { getAnswerById } from 'user-ui/features/answers/selectors';
import { ApiPayload } from 'user-ui/features/api/reducers';
import { getBlockByReference } from 'user-ui/features/bots/selectors';
import { getVariables } from 'user-ui/features/variables/selectors';
import {
  BlockAnswer,
  getFirstAnswer,
  replaceVariablesWithValues,
} from 'user-ui/lib';
import { actions } from './slice';

export function* invokeApi(action) {
  const { blockRef }: ApiPayload = action.payload;
  const block: Block | undefined = yield select(state =>
    getBlockByReference(state, blockRef),
  );

  if (!block || !isApiBlock(block)) {
    yield put(
      actions.apiFailed({ blockRef, apiError: 'block does not have api type' }),
    );
    return;
  }

  const { endpoint = '', payload = '' } = block.api;

  if (!endpoint) {
    yield put(
      actions.apiFailed({
        blockRef,
        apiError: 'api block missing endpoint value',
      }),
    );
    return;
  }

  const blockAnswers: BlockAnswer[] | undefined = yield select(state =>
    getAnswerById(state, block?.id),
  );

  const variables = yield select(state => getVariables(state));

  const firstAnswer = getFirstAnswer(blockAnswers);
  const answerValue = firstAnswer?.value ?? '';

  const resolveVariables = (text: string = '') => {
    const resolvedInput = text.trim().replace('{{this.input}}', answerValue);
    return replaceVariablesWithValues(resolvedInput, variables);
  };

  const apiUrl = resolveVariables(endpoint);
  const data = resolveVariables(payload);

  const [apiResponse, error] = yield call(request, apiUrl, {
    method: data ? 'post' : 'get',
    body: data ? data : undefined,
    headers: [['content-type', 'application/json']],
  });

  if (error || !isApiResponseValid(apiResponse)) {
    const apiError = error?.message || error || 'Api response was invalid.';

    yield put(actions.apiFailed({ blockRef, apiError }));
    logger.error('API call returned with error', apiError);
    return;
  }

  yield put(actions.apiSucceed({ blockRef, apiResponse }));
}

export function* userUiSaga() {
  yield takeLatest(actions.callApi.type, invokeApi);
}

const isApiResponseValid = (response: any): boolean => {
  const components = response?.components;
  const componentsValid = components?.every(c =>
    c.type?.match(/^(confirm|freespeech|predefined)$/),
  );

  return Boolean(components?.length > 0 && componentsValid);
};
