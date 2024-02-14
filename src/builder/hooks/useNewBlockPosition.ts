/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useMemo } from 'react';
import { useStoreState, XYPosition } from 'react-flow-renderer';
import { createSelector } from '@reduxjs/toolkit';

const selectGraphData = createSelector<any, any, any>(
  [state => state.width, state => state.height, state => state.transform],
  (width, height, transform) => [width, height, transform],
);

export const useNewBlockPosition = () => {
  const [width, height, transform] = useStoreState(selectGraphData) as [
    number,
    number,
    [number, number, number],
  ];

  const [x, y, zoom] = transform;
  const blockDefaultWidth = 224;
  const blockDefaultHeight = 112;

  const position: XYPosition = useMemo(
    () => ({
      x: (width / zoom - blockDefaultWidth) / 2 - x / zoom,
      y: (height / zoom - blockDefaultHeight) / 2 - y / zoom,
    }),
    [height, width, x, y, zoom],
  );

  return position;
};
