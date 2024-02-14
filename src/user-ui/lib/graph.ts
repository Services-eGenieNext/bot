/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Immutable } from 'immer';
import memoize from 'lodash/memoize';
import uniq from 'lodash/uniq';
import {
  BlockNodesMap,
  BlockTypes,
  BotsMap,
  isConditionBlock,
  isOutletBlock,
} from 'shared/types';
import { getObjectValues, logger } from 'shared/utils';
import { BotUiState } from 'user-ui/features/state';
import {
  findFirstBlock,
  getBlock,
  getFirstBlockOfBot,
  isViewableBlock,
  findParentFromBotMap,
  getNextFromFinish,
  BlockReference,
  getComponents,
} from 'user-ui/lib';

const memo: <T extends (bots: BotsMap, bRef: BlockReference) => ReturnType<T>>(
  fun: T,
) => T = fun => memoize(fun, (_, { botId, blockId }) => `${botId}${blockId}`);

const getStartBlockParent = memo(
  (bots: Immutable<BotsMap>, bRef: BlockReference): BlockReference[] => {
    const { botId } = bRef;
    const parentBot = findParentFromBotMap(bots);
    const parentBotsBlock = getObjectValues(parentBot?.blocks);
    const outletBlock = parentBotsBlock.find(
      b => isOutletBlock(b) && b.nextBotId === botId,
    );

    if (!parentBot || !outletBlock) {
      return [];
    }

    return [
      {
        botId: parentBot.id,
        blockId: outletBlock.id,
      },
    ];
  },
);

const getFinishBlockChild = memo(
  (bots: Immutable<BotsMap>, bRef: BlockReference): BlockReference[] => {
    const child = getNextFromFinish(bots, bRef);
    return child ? [child] : [];
  },
);

const getOutletBlockChild = memo(
  (bots: Immutable<BotsMap>, bRef: BlockReference): BlockReference[] => {
    const block = getBlock(bots, bRef);
    if (!block || !isOutletBlock(block)) {
      return [];
    }

    const nextBotId = block.nextBotId;

    if (!nextBotId || !bots[nextBotId]) {
      logger.error(
        `Outlet block ${block.title} missing or contains invalid reference to child bot (${nextBotId})`,
      );
      return [];
    }

    const nextBlock = getFirstBlockOfBot(bots, nextBotId);

    if (!nextBlock) {
      logger.error(
        `Outlet block ${block.title} refers to a child bot without start block`,
      );
      return [];
    }

    return [{ botId: nextBotId, blockId: nextBlock.id }];
  },
);

const getParentBlocks = memo(
  (bots: Immutable<BotsMap>, bRef: BlockReference): BlockReference[] => {
    const { botId, blockId } = bRef;
    const block = getBlock(bots, bRef);

    if (block?.type === BlockTypes.Start) {
      return getStartBlockParent(bots, bRef);
    }

    const bot = bots[botId];
    if (!bot) {
      return [];
    }

    const blocks = getObjectValues(bot.blocks);

    const parents = blocks.filter(b => {
      if (b.next?.id === blockId) {
        return true;
      } else if (isConditionBlock(b)) {
        return b.nextTrue?.id === blockId || b.nextFalse?.id === blockId;
      } else {
        return getComponents(b)
          .flatMap(c => c.props?.options)
          .some(opt => opt?.next?.id === blockId);
      }
    });

    return uniq(parents.map(b => b.id)).map(blockId => ({
      botId: bot.id,
      blockId,
    }));
  },
);

const getChildBlocks = memo(
  (bots: Immutable<BotsMap>, bRef: BlockReference): BlockReference[] => {
    const block = getBlock(bots, bRef);

    if (block?.type === BlockTypes.Finish) {
      return getFinishBlockChild(bots, bRef);
    } else if (block && isOutletBlock(block)) {
      return getOutletBlockChild(bots, bRef);
    }

    const fromBlock = block?.next?.id;
    const fromOptions = getComponents(block)
      .flatMap(c => c.props?.options)
      .map(opt => opt?.next?.id);

    const fromCondition =
      block && isConditionBlock(block)
        ? [block.nextTrue?.id, block.nextFalse?.id]
        : undefined;

    return uniq(
      ([] as (string | undefined)[])
        .concat(fromBlock, fromOptions, fromCondition)
        .filter((id: string | undefined): id is string => !!id),
    ).map(blockId => ({ botId: bRef.botId, blockId }));
  },
);

export const createBotsGraph = (
  state: Immutable<BotUiState>,
  bRef?: BlockReference,
  _depth: number = 0,
  accumulatedParent: string[] = [],
  nodes: BlockNodesMap = {},
): BlockNodesMap | never => {
  const { bots } = state;
  let thisBlock: BlockReference;

  if (bRef) {
    thisBlock = bRef;
  } else {
    const firstBlock = findFirstBlock(state);
    if (!firstBlock) {
      return nodes;
    }

    thisBlock = firstBlock;
  }

  const { botId, blockId } = thisBlock;
  const thisNode = nodes[blockId];
  const depth = thisNode?.depth
    ? Math.max(thisNode.depth, _depth)
    : _depth || 0;
  const parents = getParentBlocks(bots, thisBlock);
  const children = getChildBlocks(bots, thisBlock);

  nodes[blockId] = {
    botId,
    blockId,
    depth,
    children,
    parents,
  };

  const childrenWithLowerDepth = children.filter(ch => {
    const childNode = nodes[ch.blockId];
    if (!childNode) {
      return true;
    }

    return childNode.depth <= depth;
  });

  for (const child of childrenWithLowerDepth) {
    const childBlock = getBlock(bots, child);
    const isChildViewable = isViewableBlock(childBlock);
    const newDepth = depth + (isChildViewable ? 1 : 0);

    if (accumulatedParent.indexOf(child.blockId) !== -1) {
      throw new Error(
        'Cycles were detected in the graph, stopped processing the data.',
      );
    }

    createBotsGraph(
      state,
      child,
      newDepth,
      [...accumulatedParent, blockId],
      nodes,
    );
  }

  return nodes;
};
