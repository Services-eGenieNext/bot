/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from './reducers';

const isDevEnv = process.env.NODE_ENV !== 'production';
const reduxLogger = createLogger({ level: 'debug', collapsed: true });

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware];

  if (isDevEnv) {
    middlewares.push(reduxLogger);
  }

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const store = configureStore({
    reducer: createReducer(),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(middlewares),
    devTools: isDevEnv && {
      name: 'Bot Builder Store',
      latency: 200,
      autoPause: true,
      shouldRecordChanges: false,
    },
    enhancers,
  });

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      forceReducerReload(store);
    });
  }

  return store;
}
