/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createSelector } from '@reduxjs/toolkit';
import { castDraft, castImmutable } from 'immer';
import { Block, Bot, RootState } from 'shared/types';
import { getObjectValues, logger } from 'shared/utils';
import {
  findFirstBlock,
  getBlock,
  BlockReference,
  findParentFromBotMap,
  getChapterBots,
} from 'user-ui/lib';

import { initialState } from '../state';

export const selectBotUiDomain = (state: RootState) =>
  state.botUi || initialState;

export const getBots = createSelector([selectBotUiDomain], botUiState => {
  return botUiState.bots;
});

export const getBotsList = createSelector([getBots], bots => {
  return getObjectValues(bots);
});

export const getParentBot = createSelector([selectBotUiDomain], botUiState => {
  return castDraft(findParentFromBotMap(botUiState.bots));
});

export const getIsChapterBased = createSelector(
  [selectBotUiDomain],
  state => state.isChapterBased,
);

export const getChapters = createSelector(
  [selectBotUiDomain],
  (state): Bot[] => {
    return castDraft(getChapterBots(state));
  },
);

export const getFirstBlock = createSelector([selectBotUiDomain], state => {
  return findFirstBlock(state);
});

export const getBlockByReference = createSelector(
  [getBots, (_, blockRef: BlockReference | undefined) => blockRef],
  (bots, blockRef): Block | undefined => {
    if (!blockRef) {
      return;
    }
    const readOnlyBlocks = castImmutable(bots);
    return castDraft(getBlock(readOnlyBlocks, blockRef));
  },
);

export const getProgressPercent = createSelector(
  [selectBotUiDomain, (_, blockId: string | undefined) => blockId],
  (state, blockId): number => {
    if (!blockId) {
      return 0;
    }
    const blockDepth = state.graph[blockId]?.depth;
    if (typeof blockDepth === 'undefined') {
      logger.warn(
        'could not find block in graph when calculating progress, returning dummy',
      );
      return Math.floor(Math.random() * 10 + 45);
    }
    return Math.floor((blockDepth / state.maxDepth) * 100);
  },
);

export const getBlockDepth = createSelector(
  [selectBotUiDomain, (_, blockId: string | undefined) => blockId],
  (state, blockId): number => {
    if (!blockId) {
      return 0;
    }
    const blockDepth = state.graph[blockId]?.depth;
    if (typeof blockDepth === 'undefined') {
      logger.warn(
        'could not find block in graph when calculating progress, returning dummy',
      );
      return 0;
    }
    return blockDepth;
  },
);
