/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Immutable } from 'immer';
import { Block, isFinishBlock, isQuitBlock } from 'shared/types';
import { emitEvent, history, logger } from 'shared/utils';
import {
  BlockReference,
  getBlock,
  getNext,
  isBlockRefEqual,
  isViewableBlock,
} from 'user-ui/lib';
import { getOverviewPagePath } from 'user-ui/routes';
import { BotUiReducer } from '../state';

export interface NavigationReducers {
  setCurrent: BotUiReducer<BlockReference>;
  updateNext: BotUiReducer<BlockReference>;
}

export const navigationReducers: NavigationReducers = {
  setCurrent(state, action) {
    const current = action.payload;

    if (isBlockRefEqual(state.navigation.current, current)) {
      return;
    }

    state.navigation.previous = state.navigation.current;
    state.navigation.current = current;
    state.navigation.next = undefined;
  },
  updateNext(state, action) {
    const current = action.payload;

    const { bots } = state;
    const skipAnswered = history.location.state?.editing;
    let next: BlockReference | undefined;
    let nextBlock: Immutable<Block> | undefined;
    let _current = current;

    do {
      next = getNext(state, _current, skipAnswered, true);
      nextBlock = next && getBlock(bots, next);

      if (!next || !nextBlock) {
        break;
      }

      if (isQuitBlock(nextBlock)) {
        emitEvent('quit', next);
        return;
      }

      if (isFinishBlock(nextBlock)) {
        setImmediate(() => history.push(getOverviewPagePath()));
        return;
      }

      _current = next;
    } while (next && nextBlock && !isViewableBlock(nextBlock));

    state.navigation.previous = state.navigation.current;
    state.navigation.current = current;

    if (!next || !nextBlock) {
      logger.warn('could not find next block', { current, next });
      return;
    }

    state.navigation.next = next;
  },
};
