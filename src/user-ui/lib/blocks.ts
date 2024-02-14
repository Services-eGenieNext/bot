/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { castDraft, Immutable } from 'immer';
import {
  APIBlockType,
  Block,
  BlockTypes,
  BotsMap,
  ComponentType,
  ListBlockType,
  PresentationBlockType,
  ResponseComponent,
  TextBlockType,
} from 'shared/types';
import { getObjectValues, logger } from 'shared/utils';
import { BotUiState } from 'user-ui/features/state';
import { findParentFromBotMap } from 'user-ui/lib/bots';
import { BlockReference } from './types';

export const getBlock = (
  bots: Immutable<BotsMap>,
  bRef: BlockReference,
): Immutable<Block> | undefined => {
  const { botId, blockId } = bRef;
  return bots[botId]?.blocks && bots[botId]?.blocks[blockId];
};

export const getComponents = (
  block?: Block | Immutable<Block>,
): ResponseComponent[] => {
  if (!block?.components) {
    return [];
  }
  const components = block.components.filter(
    c => c.type !== ComponentType.None,
  );
  return castDraft(components);
};
export const isBlockRefEqual = (
  bRef1?: BlockReference,
  bRef2?: BlockReference,
) => {
  return bRef1?.botId === bRef2?.botId && bRef1?.blockId === bRef2?.blockId;
};

export const findFirstBlock = (
  state: Immutable<BotUiState>,
): BlockReference | undefined => {
  const { bots } = state;
  const parentBot = findParentFromBotMap(bots);
  if (!parentBot || !parentBot.blocks) {
    logger.error('could not find parent bot', { bots });
    return;
  }

  const parentBotId = parentBot.id;
  const firstBlock = getFirstBlockOfBot(bots, parentBotId);

  if (!firstBlock) {
    return;
  }

  return {
    botId: parentBot.id,
    blockId: firstBlock.id,
  };
};

export const getFirstBlockOfBot = (
  bots: Immutable<BotsMap>,
  botId: string,
): Immutable<Block> | undefined => {
  const bot = bots[botId];

  if (!bot || !bot.blocks) {
    logger.error('could not find bot when trying to get first bot');
    return;
  }

  const blocksList = getObjectValues(bot.blocks);
  const startBlock = blocksList.find(block => block.type === 'start');

  if (!startBlock) {
    logger.error('could not find start block when trying to get first block');
    return;
  }

  const firstBlock = blocksList.find(block => block.id === startBlock.next?.id);

  if (!firstBlock) {
    logger.error('could not find first block connected to start block');
    return;
  }
  return firstBlock;
};

const VIEWABLE_BLOCK_TYPES = [
  BlockTypes.Text,
  BlockTypes.List,
  BlockTypes.API,
  BlockTypes.Presentation,
  BlockTypes.GDPR,
];

const LOGICAL_BLOCK_TYPES: BlockTypes[] = getObjectValues(BlockTypes).filter(
  type => !VIEWABLE_BLOCK_TYPES.includes(type),
);

export const isViewableBlock = (
  block?: Block | Immutable<Block>,
): block is
  | TextBlockType
  | ListBlockType
  | PresentationBlockType
  | APIBlockType => {
  return !!block?.type && VIEWABLE_BLOCK_TYPES.includes(block.type);
};

export const isLogicalBlock = (block?: Block | Immutable<Block>): boolean => {
  return !!block?.type && LOGICAL_BLOCK_TYPES.includes(block?.type);
};

export const isBlockRequired = (block: Block | undefined): boolean => {
  return (
    block?.required ||
    (!block?.next && getComponents(block)[0]?.type === ComponentType.Predefined)
  );
};
