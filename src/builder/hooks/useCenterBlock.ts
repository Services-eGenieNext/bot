/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useCallback } from 'react';
import { useZoomPanHelper, XYPosition } from 'react-flow-renderer';
import { useGraphDimension, useNodes } from 'builder/hooks/useFlowState';

export const useCenterBlock = () => {
  const [width, height] = useGraphDimension();
  const nodes = useNodes();
  const { transform } = useZoomPanHelper();
  return useCallback(
    (blockId: string) => {
      const node = nodes.find(n => n.id === blockId);
      if (!node) {
        return;
      }

      const {
        position,
        width: nodeWith,
        height: nodeHeight,
      } = node.__rf as {
        position: XYPosition;
        width: number;
        height: number;
      };
      const x = position.x * -1 + (width - nodeWith) / 2;
      const y = position.y * -1 + (height - nodeHeight) / 2;
      transform({ x, y, zoom: 1 });
    },
    [height, nodes, transform, width],
  );
};
