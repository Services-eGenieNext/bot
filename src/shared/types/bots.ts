/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { BlockReference } from 'user-ui/lib';
import { Block } from './blocks';
import { PartialRecord } from './utils';

export type BotType = 'parent' | 'child' | 'side';

export type BotsMap = PartialRecord<string, Bot>;
export type BlocksMap = PartialRecord<string, Block>;

export type Bot = {
  id: string;
  name: string;
  type: BotType;
  blocks: BlocksMap;
};

export type BotWithBlockList = Omit<Bot, 'blocks'> & {
  blocks: Block[];
};

export type BlockNode = {
  blockId: string;
  botId: string;
  children: BlockReference[];
  parents: BlockReference[];
  depth: number;
};

export type BlockNodesMap = {
  [blockId: string]: BlockNode | undefined;
};

function isBotType(type: any): type is BotType {
  return ['parent', 'child', 'side'].includes(type);
}

export function isBot(bot: any): bot is Bot {
  const hasBlocksObject = typeof bot.blocks === 'object';
  return bot.id && bot.name && hasBlocksObject && isBotType(bot.type);
}

export function isBotWithBlockList(bot: any): bot is Bot {
  const hasBlocksArray = typeof bot?.blocks?.length !== 'undefined';
  return bot.id && bot.name && hasBlocksArray && isBotType(bot.type);
}
