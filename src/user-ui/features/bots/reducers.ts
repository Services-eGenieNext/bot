/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { sanitizeBotsList, getObjectValues, logger } from 'shared/utils';
import { BlockNodesMap, BotWithBlockList } from 'shared/types';
import { isChapterBased, createBotsGraph } from 'user-ui/lib';
import { BotUiReducer } from '../state';

export interface BotsReducers {
  setBotsAction: BotUiReducer<BotWithBlockList[]>;
}

export const botsReducers: BotsReducers = {
  setBotsAction(state, action) {
    const bots = sanitizeBotsList(action.payload);
    const hasChapters = isChapterBased(bots);

    if (typeof hasChapters === 'undefined') {
      logger.error(
        'isChapterBased return undefined, possibly because parent bot not found',
      );
      return;
    }

    state.bots = bots;
    state.isChapterBased = hasChapters;
    let graph: BlockNodesMap;

    try {
      graph = createBotsGraph(state);
    } catch (err) {
      err.stack = err.message;
      logger.error(err);
      return;
    }

    const maxDepth = Math.max(...getObjectValues(graph).map(x => x.depth)) + 1;

    state.graph = graph;
    state.maxDepth = maxDepth;

    state.answers = {};
    state.validAnswers = {};
    state.initialized = true;
  },
};
