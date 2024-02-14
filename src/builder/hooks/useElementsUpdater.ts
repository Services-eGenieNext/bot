/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Elements, useZoomPanHelper } from 'react-flow-renderer';
import { useModuleContext } from 'shared/context';
import { logger } from 'shared/utils';
import { getBlocksList, getBotTransform } from 'builder/features/selectors';
import { convertBlocksToElements } from 'builder/lib/blocks';

export const useElementsUpdater: UseElementsUpdate = () => {
  const [elements, setElements] = useState<Elements>([]);
  const { transform } = useZoomPanHelper();
  const botTransform = useSelector(getBotTransform);
  const blocks = useSelector(getBlocksList);
  const { emitter } = useModuleContext();
  const loaded = useRef(false);

  useEffect(() => {
    const newElements = convertBlocksToElements(blocks);
    logger.debug('Updating elements.', { newElements });
    setElements(newElements);
    const timerId = window.setTimeout(() => {
      if (!loaded.current) {
        emitter.emit('loaded');
        loaded.current = true;
      }
    }, 100);
    return () => window.clearTimeout(timerId);
  }, [blocks, emitter]);

  useEffect(() => {
    transform(botTransform || { x: 0, y: 0, zoom: 1 });
  }, [botTransform, transform]);

  return [elements, setElements];
};

export type UseElementsUpdate = () => [
  Elements,
  Dispatch<SetStateAction<Elements>>,
];
