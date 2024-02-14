/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useCallback, useMemo } from 'react';
import { Edge, Elements, Node, useStoreState } from 'react-flow-renderer';
import { createSelector } from '@reduxjs/toolkit';

const selectSelectedElements = createSelector<any, Elements, Elements>(
  state => state.selectedElements,
  r => r,
);

const selectNodes = createSelector<any, Node[], Node[]>(
  state => state.nodes,
  r => r,
);

const selectNodeById = createSelector(
  [selectNodes, (_, p: { nodeId }) => p],
  (nodes, { nodeId }) => nodes.find(n => n.id === nodeId),
);

const selectEdges = createSelector<any, Edge[], Edge[]>(
  state => state.edges,
  r => r,
);

const selectEdgeById = createSelector(
  [selectEdges, (_, p: { sourceId; sourceHandle }) => p],
  (edges, { sourceId, sourceHandle }) => {
    return edges.find(
      e => e.source === sourceId && e.sourceHandle === sourceHandle,
    );
  },
);

const selectEdgesByBlockId = createSelector(
  [selectEdges, (_, blockId: string | undefined) => blockId],
  (edges, blockId) => {
    return edges
      .filter(e => e.source === blockId)
      .reduce((acc, edge) => {
        if (edge.sourceHandle) {
          acc[edge.sourceHandle] = edge;
        }

        return acc;
      }, {} as Record<string, Edge>);
  },
);

const selectGraphDimension = createSelector<any, number, [number, number]>(
  [state => state.width, state => state.height],
  (width, height) => [width, height],
);

export const useSelectedElements = (): Elements => {
  const selectedElements = useStoreState(selectSelectedElements);
  return useMemo(() => selectedElements ?? [], [selectedElements]);
};

export const useGraphDimension = (): [number, number] => {
  const graphDimension = useStoreState(selectGraphDimension);
  return useMemo(() => graphDimension, [graphDimension]);
};

export const useNodes = (): Node[] => {
  const nodes = useStoreState(selectNodes);
  return useMemo(() => nodes, [nodes]);
};

export const useEdges = (): Edge[] => {
  const edges = useStoreState(selectEdges);
  return useMemo(() => edges, [edges]);
};

export const useEdgeById = (
  blockId?: string,
  sourceHandleId?: string,
): Edge | undefined => {
  const selectEdge = useCallback(
    state =>
      selectEdgeById(state, {
        sourceId: blockId,
        sourceHandle: sourceHandleId,
      }),
    [blockId, sourceHandleId],
  );
  const edges = useStoreState(selectEdge);
  return useMemo(() => edges, [edges]);
};

export const useEdgesByBlockId = (blockId?: string): Record<string, Edge> => {
  const selectEdge = useCallback(
    state => {
      return selectEdgesByBlockId(state, blockId);
    },
    [blockId],
  );
  const edges = useStoreState(selectEdge);
  return useMemo(() => edges, [edges]);
};

export const useNodeById = (nodeId?: string): Node | undefined => {
  const selectNode = useCallback(
    state => selectNodeById(state, { nodeId }),
    [nodeId],
  );
  const node = useStoreState(selectNode);
  return useMemo(() => node, [node]);
};
