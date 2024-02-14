/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Immutable } from 'immer';
import {
  Block,
  BlocksMap,
  BlockTypes,
  Bot,
  BotsMap,
  BotType,
  isConditionBlock,
  isOutletBlock,
} from 'shared/types';
import { getObjectValues, isArray, logger } from 'shared/utils';
import { BotUiState } from 'user-ui/features/state';
import {
  getBlock,
  getFirstBlockOfBot,
  isLogicalBlock,
} from 'user-ui/lib/blocks';
import { getNextFromCondition } from 'user-ui/lib/next';
import { BlockReference } from 'user-ui/lib/types';

export const getChapterBots = (
  state: Immutable<BotUiState>,
): Immutable<Bot>[] => {
  const { bots } = state;
  const botsList = getObjectValues(bots);

  if (!isChapterBased(bots)) {
    return botsList;
  }

  const parentBot = findParentBot(botsList);

  if (!parentBot) {
    return [];
  }

  let currentBlock = getFirstBlockOfBot(bots, parentBot.id);
  const chapterIds: string[] = [];
  while (currentBlock && currentBlock.type !== BlockTypes.Finish) {
    if (isOutletBlock(currentBlock) && currentBlock.nextBotId) {
      chapterIds.push(currentBlock.nextBotId);
    }
    const bRef: BlockReference = {
      botId: parentBot.id,
      blockId: currentBlock.id,
    };

    const nextBlockId = currentBlock.next?.id;
    const nextRefFromBlock = nextBlockId
      ? {
          botId: parentBot.id,
          blockId: nextBlockId,
        }
      : undefined;

    const nextRef: BlockReference | undefined = isConditionBlock(currentBlock)
      ? getNextFromCondition(state, bRef)
      : nextRefFromBlock;

    currentBlock = nextRef && getBlock(bots, nextRef);
  }

  return chapterIds
    .map(id => bots[id])
    .filter((bot: Immutable<Bot> | undefined): bot is Bot => !!bot);
};

export const findParentBot = <T extends { type: BotType }>(
  bots: Immutable<T[]>,
) => {
  return bots.find(bot => bot.type === 'parent');
};

export const isChapterBased = (
  bots: Immutable<BotsMap>,
): boolean | undefined => {
  const botsList = getObjectValues(bots);
  const parentBotBlocks: Immutable<BlocksMap> | undefined =
    findParentBot(botsList)?.blocks;

  if (!parentBotBlocks) {
    logger.error('could not find parent bot in isChapterBased method');
    return;
  }
  const blocksList: Immutable<Block[]> = isArray(parentBotBlocks)
    ? (parentBotBlocks as Immutable<Block[]>)
    : getObjectValues(parentBotBlocks as Immutable<BlocksMap>);

  return blocksList.every(isLogicalBlock);
};

export const findParentFromBotMap = (
  bots: Immutable<BotsMap>,
): Immutable<Bot> | undefined => {
  const botsList: Immutable<Bot[]> = getObjectValues(bots);
  return findParentBot(botsList);
};
