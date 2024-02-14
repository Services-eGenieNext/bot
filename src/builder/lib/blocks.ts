/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Connection, Elements, Node } from 'react-flow-renderer';
import {
  Block,
  BlockTypes,
  isConditionBlock,
  OutgoingBlock,
} from 'shared/types';
import { logger } from 'shared/utils';
import { addConnectionToElements } from 'builder/lib/connections';

export const isNodeSelectable = (node: Node | Block) => {
  return (
    node.type !== BlockTypes.Start &&
    node.type !== BlockTypes.Finish &&
    node.type !== BlockTypes.Quit
  );
};

export const createNodeFromBlock = (block: Block): Node => {
  return {
    id: block.id,
    type: block.type,
    position: { ...block.position },
  };
};

export const getConnectingBlocks = (
  blockId: String,
  blocks: Block[],
): Block[] => {
  return blocks.filter(b => {
    if (b.next?.id === blockId) {
      return true;
    } else if (b.components) {
      const connectedOption = b.components
        .flatMap(r => r.props?.options)
        .find(opt => opt?.next?.id === blockId);

      if (connectedOption) {
        return true;
      }
    } else if (isConditionBlock(b)) {
      return b.nextTrue?.id === blockId || b.nextFalse?.id === blockId;
    }
    return false;
  });
};

export const getBlockConnections = (block: Block): Connection[] => {
  const connections: Connection[] = [];

  if (block.next) {
    const sourceHandle = block.next.handles?.source ?? 'source.bottom';
    const targetHandle = block.next.handles?.target ?? 'target.top';

    connections.push({
      source: block.id,
      target: block.next.id,
      sourceHandle,
      targetHandle,
    });
  }

  if (block.components) {
    block.components
      .flatMap(r => r.props?.options)
      .forEach(opts => {
        const outgoingBlock = opts?.next;

        if (outgoingBlock) {
          const sourceHandleId =
            outgoingBlock.handles?.source || 'source.bottom';
          const targetHandleId = outgoingBlock.handles?.target || 'target.top';
          connections.push({
            source: block.id,
            target: outgoingBlock.id,
            sourceHandle: sourceHandleId,
            targetHandle: targetHandleId,
          });
        }
      });
  }

  if (isConditionBlock(block)) {
    const outgoings = [block.nextFalse, block.nextTrue];
    outgoings
      .filter((x): x is OutgoingBlock => !!x)
      .forEach(outgoingConn => {
        connections.push({
          source: block.id,
          target: outgoingConn.id,
          sourceHandle: outgoingConn.handles.source,
          targetHandle: outgoingConn.handles.target,
        });
      });
  }

  return connections;
};

export const convertBlocksToElements = (blocks: Block[]): Elements => {
  const [nodes, connections]: [Node[], Connection[]] = blocks.reduce(
    ([_nodes, _connections], block) => {
      return [
        [..._nodes, createNodeFromBlock(block)],
        [..._connections, ...getBlockConnections(block)],
      ];
    },
    [[], []] as [Node[], Connection[]],
  );

  const elements = connections.reduce((elements: Elements, conn) => {
    return addConnectionToElements(elements, conn);
  }, nodes);

  logger.debug('blocks converted to elements', { blocks, elements });
  return elements;
};
