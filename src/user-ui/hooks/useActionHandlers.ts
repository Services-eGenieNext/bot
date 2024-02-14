/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BotWithBlockList } from 'shared/types';
import { getObjectValues } from 'shared/utils';
import { getSerializedSubmitData } from 'user-ui/lib';
import { useModuleContext } from 'shared/context';
import { selectBotUiDomain } from 'user-ui/features/bots/selectors';

export const useActionHandlers = () => {
  const { registerAction } = useModuleContext();
  const state = useSelector(selectBotUiDomain);

  const getBots = useCallback(
    () => getObjectValues(state.bots || {}),
    [state.bots],
  );

  const getData = useCallback(() => {
    if (!state) {
      return;
    }

    return getSerializedSubmitData(state);
  }, [state]);

  const getBotsHandler = useCallback(
    callback => {
      const bots = getBots();
      const botsWithList: BotWithBlockList[] = bots.map(bot => ({
        ...bot,
        blocks: getObjectValues(bot.blocks),
      }));

      if (typeof callback === 'function') {
        callback(botsWithList);
      }
      return botsWithList;
    },
    [getBots],
  );

  const getVarsHandler = useCallback(
    callback => {
      const { variables } = getData() || {};

      if (typeof callback === 'function') {
        callback(variables);
      }

      return variables;
    },
    [getData],
  );

  const getAnswersHandler = useCallback(
    callback => {
      const { responses } = getData() || {};

      if (typeof callback === 'function') {
        callback(responses);
      }

      return responses;
    },
    [getData],
  );

  const getParagraphIdsHandler = useCallback(
    callback => {
      const { paragraphIds } = getData() || {};

      if (typeof callback === 'function') {
        callback(paragraphIds);
      }

      return paragraphIds;
    },
    [getData],
  );

  useEffect(() => {
    registerAction('getBots', getBotsHandler);
    registerAction('getVars', getVarsHandler);
    registerAction('getAnswers', getAnswersHandler);
    registerAction('getParagraphIds', getParagraphIdsHandler);
  }, [
    getAnswersHandler,
    getBotsHandler,
    getParagraphIdsHandler,
    getVarsHandler,
    registerAction,
  ]);
};
