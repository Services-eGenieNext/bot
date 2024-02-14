/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Block } from 'shared/types';
import { getBlockByReference } from 'user-ui/features/bots/selectors';
import { BlockReference } from '../lib';

export const useCurrentBlock = (): Block | undefined => {
  const blockRef = useCurrentBlockRef();
  const selectBlock = useCallback(
    state => getBlockByReference(state, blockRef),
    [blockRef],
  );
  return useSelector(selectBlock);
};

export const useCurrentBlockRef = (): BlockReference | undefined => {
  const { botId, blockId } = useParams<Record<string, string | undefined>>();
  return useMemo(
    () => (botId && blockId ? { botId, blockId } : undefined),
    [blockId, botId],
  );
};
