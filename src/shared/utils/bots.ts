/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import cloneDeep from 'lodash/cloneDeep';
import {
  Block,
  BlockTypes,
  Bot,
  BotsMap,
  BotWithBlockList,
  ComponentType,
  isBlock,
  isBotWithBlockList,
} from 'shared/types';
import { logger } from './logger';

export const sanitizeBlocks = (
  bot: BotWithBlockList,
): { [id: string]: Block } => {
  const blocks = bot.blocks.map(b => {
    let id = b.id;
    if (b.type === BlockTypes.Start) {
      id = bot.id;
    }
    return { ...b, id };
  });

  const blockIds = new Set(blocks.map(b => b.id));
  return blocks.filter(isBlock).reduce((blocksMap, _) => {
    const newBlock = cloneDeep(_);
    const nextId = newBlock.next?.id;
    if (nextId && !blockIds.has(nextId)) {
      newBlock.next = undefined;
    }

    newBlock.components?.forEach(comp => {
      if (comp.type !== ComponentType.Predefined && comp.props?.options) {
        comp.props.options = undefined;
        return;
      }
      comp.props?.options?.forEach(opt => {
        if (!opt.next?.id) {
          opt.next = undefined;
          return;
        }

        if (!blockIds.has(opt.next.id)) {
          opt.next = undefined;
        } else if (opt.next.handles.source) {
          opt.next.handles.source = `source.response.${opt.id}`;
        }
      });
    });

    blocksMap[newBlock.id] = { ...newBlock };

    return blocksMap;
  }, {} as { [id: string]: Block });
};

export const sanitizeBotsList = (bots: BotWithBlockList[]): BotsMap => {
  const validBotList = bots.filter(isBotWithBlockList);
  if (validBotList.length !== bots.length) {
    logger.warn(
      'setBots: some/all of the provided bots were invalid, therefore skipped.',
    );
  }
  return validBotList.reduce((acc, botWithList) => {
    const blocks = sanitizeBlocks(botWithList);
    if (Object.keys(blocks).length !== botWithList.blocks.length) {
      logger.warn(
        `setBots: some of the provided block for bot(${botWithList.name}) were invalid, therefore skipped.`,
      );
    }
    acc[botWithList.id] = {
      ...botWithList,
      blocks,
    };
    return acc;
  }, {} as { [id: string]: Bot });
};
