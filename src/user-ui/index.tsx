/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { useModuleContext } from 'shared/context';
import {
  useInjectReducer,
  useInjectSaga,
  sanitizeBotsList,
  logger,
  history,
  isArray,
} from 'shared/utils';
import { useActionHandlers } from 'user-ui/hooks';
import { userUiSaga } from 'user-ui/features/saga';
import { actions, reducer, sliceKey } from 'user-ui/features/slice';
import { updateLocationState } from 'user-ui/lib';
import {
  getFirstBlock,
  getResumed,
  getIsChapterBased,
} from './features/selectors';
import './styles.scss';
import OverviewPage from './pages/OverviewPage';
import QuestionPage from './pages/QuestionPage';
import {
  getQuestionPagePath,
  OVERVIEW_PAGE_ROUTE,
  QUESTION_PAGE_ROUTE,
} from './routes';

export function BotUi() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: userUiSaga });
  const { emitter, options } = useModuleContext();
  const dispatch = useDispatch();
  setOptionsOnce(options, dispatch);
  useActionHandlers();

  const loaded = useRef(false);
  const isChapterBased = useSelector(getIsChapterBased);
  const isResumed = useSelector(getResumed);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      if (!loaded.current) {
        emitter.emit('loaded');
        loaded.current = true;
      }
    }, 100);

    return () => {
      emitter.emit('unloaded');
      emitter.all.set('unloaded', []);
      window.clearTimeout(timerId);
    };
  }, [emitter]);

  const firstBlockInfo = useSelector(getFirstBlock);

  const hasBots = Boolean(
    options.bots?.length && Object.keys(sanitizeBotsList(options.bots)).length,
  );

  if (!hasBots) {
    logger.error(
      'BotUi has been initialized with empty or invalid bots, therefore not rendering',
    );
    return null;
  }

  let fallbackUrl = firstBlockInfo
    ? getQuestionPagePath(firstBlockInfo)
    : OVERVIEW_PAGE_ROUTE;

  if (isChapterBased && isResumed) {
    fallbackUrl = OVERVIEW_PAGE_ROUTE;
  }

  return (
    <div className="lawly-root">
      <Router history={history}>
        <Switch>
          <Route path={QUESTION_PAGE_ROUTE} exact>
            <QuestionPage />
          </Route>
          <Route path={OVERVIEW_PAGE_ROUTE}>
            <OverviewPage />
          </Route>
          <Route>
            <Redirect to={fallbackUrl} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

let optionsSet = false;

const setOptionsOnce = (options, dispatch) => {
  if (optionsSet) {
    return;
  }

  logger.debug('Setting variables from options');
  dispatch(actions.setOptionVariables(options.variableValues));

  if (!Array.isArray(options?.bots) || options.bots.length === 0) {
    logger.error('bots data is missing in options.');
    dispatch(actions.setBotsAction([]));
    return;
  }

  dispatch(actions.setBotsAction(options.bots));

  if (isArray(options.responses) && options.responses.length > 0) {
    dispatch(actions.setAnswersAction(options.responses));
    updateLocationState({ resumed: true, editing: true });
  }

  optionsSet = true;
};
