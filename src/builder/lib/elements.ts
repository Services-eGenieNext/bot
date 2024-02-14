/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Edge, Elements, isEdge, isNode, Node } from 'react-flow-renderer';

export const getEdgesAndNodes = (elements: Elements): [Node[], Edge[]] => {
  const [nodes, edges]: [Node[], Edge[]] = elements.reduce(
    ([_nodes, _edges], element) => {
      if (isEdge(element)) {
        _edges.push(element);
      }
      if (isNode(element)) {
        _nodes.push(element);
      }
      return [_nodes, _edges];
    },
    [[], []] as [Node[], Edge[]],
  );

  return [nodes, edges];
};
