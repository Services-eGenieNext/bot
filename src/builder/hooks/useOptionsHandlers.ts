/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModuleContext } from 'shared/context';
import { actions } from 'builder/features/slice';
import { BotWithBlockList } from 'shared/types';
import { uuidv4, logger } from 'shared/utils';
import { createStartBlock } from 'builder/lib/bots';

export const useOptionsHandlers = () => {
  const dispatch = useDispatch();
  const { options } = useModuleContext();

  useLayoutEffect(() => setOptionsOnce(options, dispatch), [dispatch, options]);
};

let optionsSet = false;

const setOptionsOnce = (options, dispatch) => {
  if (optionsSet) {
    return;
  }

  logger.debug('Setting values from options');
  dispatch(actions.setGlobalVariables(options.globalVariables));
  dispatch(actions.setUserVariables(options.userVariables));

  const bots = options.bots.length > 0 ? options.bots : getInitialBots();
  dispatch(actions.setBotsAction(bots));
  optionsSet = true;
};

const getInitialBots = () => {
  const initStartBlock = createStartBlock();
  const initBot: BotWithBlockList = {
    id: uuidv4(),
    type: 'parent',
    name: 'Primary',
    blocks: [initStartBlock],
  };

  return [initBot];
};
