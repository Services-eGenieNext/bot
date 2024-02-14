/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getObjectValues } from 'shared/utils';
import { Block, Bot, BotWithBlockList } from 'shared/types';
import { getBots } from 'builder/features/bots/selectors';
import { actions } from 'builder/features/slice';
import { useModuleContext } from 'shared/context';

export const useActionHandlers = () => {
  const dispatch = useDispatch();
  const { registerAction } = useModuleContext();

  const _bots = useSelector(getBots);
  const bots: Bot[] = useMemo(() => getObjectValues(_bots), [_bots]);

  const getBotsHandler = useCallback(
    callback => {
      const botsWithList: BotWithBlockList[] = bots.map(bot => ({
        ...bot,
        blocks: getObjectValues(bot.blocks),
      }));

      if (typeof callback === 'function') {
        callback(botsWithList);
      }
      return botsWithList;
    },
    [bots],
  );

  const setBotsHandler = useCallback(
    bots => {
      if (!Array.isArray(bots)) {
        return;
      }
      dispatch(actions.setBotsAction(bots));
    },
    [dispatch],
  );

  const setGlobalVarsHandler = useCallback(
    vars => {
      if (!Array.isArray(vars)) {
        return;
      }
      dispatch(actions.setGlobalVariables(vars));
    },
    [dispatch],
  );

  const setUserVarsHandler = useCallback(
    vars => {
      if (!Array.isArray(vars)) {
        return;
      }
      dispatch(actions.setUserVariables(vars));
    },
    [dispatch],
  );

  const updateBlockHandler = useCallback(
    (block?: Partial<Block>) => {
      if (!block) {
        return;
      }
      dispatch(actions.updateBlockAction(block));
    },
    [dispatch],
  );

  useEffect(() => {
    registerAction('setBots', setBotsHandler);
    registerAction('getBots', getBotsHandler);
    registerAction('updateBlock', updateBlockHandler);
    registerAction('setGlobalVars', setGlobalVarsHandler);
    registerAction('setUserVars', setUserVarsHandler);
  }, [
    getBotsHandler,
    registerAction,
    setBotsHandler,
    setGlobalVarsHandler,
    setUserVarsHandler,
    updateBlockHandler,
  ]);
};
