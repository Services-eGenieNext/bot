/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import {
  addEdge as addEdgeDefault,
  Connection,
  Edge,
  ElementId,
  Elements,
  FlowElement,
} from 'react-flow-renderer';
import last from 'lodash/last';
import cloneDeep from 'lodash/cloneDeep';
import { getObjectValues, logger } from 'shared/utils';
import { Block, BlocksMap, BlockTypes, isConditionBlock } from 'shared/types';
import { defaultEdgeProps } from 'builder/containers/FlowDiagram/configs';

const findBlockById = (blocks: Block[], blockId: string): Block | undefined => {
  return blocks.find(({ id }) => blockId === id);
};

const hasResponseConnectedToBlockId = (
  block: Block,
  blockId: string,
): boolean => {
  if (!block.components) {
    return false;
  }
  return (
    block.components
      .flatMap(r => r.props?.options)
      .findIndex(opt => opt?.next?.id === blockId) > -1
  );
};

const getResponseOutgoingBlockIds = (block: Block): string[] => {
  if (!block.components) {
    return [];
  }
  return block.components
    .flatMap(r => r.props?.options)
    .map(opt => opt?.next?.id)
    .filter((x): x is string => !!x);
};

export const getIncomerBlocks = (block: Block, blocks: Block[]): Block[] => {
  const blockId = block.id;
  return blocks.filter(blk => {
    const responseConnected = hasResponseConnectedToBlockId(blk, blockId);
    return responseConnected || blk.next?.id === blockId;
  });
};
export const getOutgoerBlocks = (block: Block, blocks: Block[]): Block[] => {
  const outgoingReposnseBlockId = getResponseOutgoingBlockIds(block);
  const outgoingBlockId = block.next?.id;
  return [outgoingBlockId, ...outgoingReposnseBlockId]
    .map(blockId => blockId && findBlockById(blocks, blockId))
    .filter((b): b is Block => !!b);
};

export const validateElementsConnection = (
  elements: FlowElement[],
  connection: Connection | Edge,
): boolean => {
  return validateConnection(elements, connection);
};

export const validateConnection = <T extends { id: string; type?: string }>(
  elements: T[],
  connection: Connection | Edge,
): boolean => {
  const { sourceNode, targetNode } = elements.reduce((acc, el) => {
    if (el.id === connection.source) {
      acc.sourceNode = el;
    } else if (el.id === connection.target) {
      acc.targetNode = el;
    }
    return acc;
  }, {} as { sourceNode?: T; targetNode?: T });

  if (!sourceNode || !targetNode) {
    return false;
  }

  const sourceNodeType = sourceNode.type as BlockTypes;
  const targetNodeType = targetNode.type as BlockTypes;

  if (
    (sourceNodeType === BlockTypes.Finish ||
      sourceNodeType === BlockTypes.Start ||
      sourceNodeType === BlockTypes.Quit) &&
    sourceNodeType === targetNodeType
  ) {
    logger.debug(
      'could not connect, two waypoint block cannot connect to each other',
    );
    return false;
  }

  if (
    sourceNodeType === BlockTypes.Start &&
    (targetNodeType === BlockTypes.Finish || targetNodeType === BlockTypes.Quit)
  ) {
    logger.debug(
      'could not connect, start block cannot connect directly to end block.',
    );
    return false;
  }

  if (targetNodeType === BlockTypes.Start) {
    logger.debug('could not connect, start block cannot be a target.');
    return false;
  }

  if (
    sourceNodeType === BlockTypes.Finish ||
    sourceNodeType === BlockTypes.Quit
  ) {
    logger.debug('could not connect, finish block cannot be a source block.');
    return false;
  }

  if (sourceNode.id === targetNode.id) {
    logger.debug('could not connect, block cannot connect to itself.');
    return false;
  }

  return true;
};

const getEdgeId = ({
  source,
  target,
  sourceHandle,
  targetHandle,
}: Connection | Edge): ElementId =>
  `edge-${source}:${sourceHandle}-${target}:${targetHandle}`;

export const addEdge: typeof addEdgeDefault = (edgeParams, elements) => {
  const newElements = addEdgeDefault(edgeParams, elements);
  const addedEdge = last(newElements) as Edge;
  addedEdge.id = getEdgeId(edgeParams);
  return newElements;
};

export const addConnectionToElements = (
  elements: Elements,
  connection: Connection | Edge,
) => {
  const isConnectionValid = validateElementsConnection(elements, connection);

  if (!isConnectionValid) {
    logger.debug('did not connect because connection was not valid');
    return elements;
  }

  return addEdge(
    {
      ...defaultEdgeProps,
      ...connection,
    },
    elements,
  );
};

export const addConnectionToBlock = (
  blocks: BlocksMap,
  connection: Connection | Edge,
): Block | undefined => {
  const { source, target, sourceHandle, targetHandle } = connection;

  const block = source && cloneDeep(blocks[source]);

  if (!block || !source || !target || !sourceHandle || !targetHandle) {
    return;
  }

  const blocksList = getObjectValues(blocks);

  const isConnectionValid = validateConnection(blocksList, connection);

  if (!isConnectionValid) {
    logger.warn('did not connect because connection was not valid');
    return;
  }

  const nextValue = {
    id: target,
    handles: {
      source: sourceHandle,
      target: targetHandle,
    },
  };

  if (sourceHandle?.startsWith('source.response')) {
    const [, optionId] = sourceHandle.match(/source\.response\.([^.]+)/) ?? [];

    const responseOption = block.components
      ?.flatMap(res => res.props?.options)
      .find(opt => {
        return opt?.id === optionId;
      });

    if (!responseOption) {
      return;
    }

    responseOption.next = nextValue;
  } else if (isConditionBlock(block)) {
    if (sourceHandle === 'source.condition.true') {
      block.nextTrue = nextValue;
    } else if (sourceHandle === 'source.condition.false') {
      block.nextFalse = nextValue;
    }
  } else {
    block.next = nextValue;
  }

  return block;
};
