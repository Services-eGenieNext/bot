/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import cloneDeep from 'lodash/cloneDeep';
import { Block } from 'shared/types';
import { getContext } from 'shared/context';
import { getObjectValues } from 'shared/utils';
import { deferredEmit, emitEvent } from 'shared/utils/emit';
import { VariablesData } from '../components/Variables/types';

let updatedTimerId: number;
let updated: { [botId: string]: { [blockId: string]: Block } } = {};

export const emitBlocksUpdate = (event: {
  botId?: string;
  blocks: Block[];
}) => {
  const eventData = cloneDeep(event);
  const botId = eventData.botId;

  if (!botId) {
    return;
  }

  const { options } = getContext();
  const updateInterval = options.updateInterval ?? 1000;
  updated[botId] = updated[botId] ?? {};
  eventData.blocks.forEach(blk => {
    const botUpdateEvents = (updated[botId] = updated[botId] ?? {});
    botUpdateEvents[blk.id] = blk;
  });

  clearTimeout(updatedTimerId);

  updatedTimerId = window.setTimeout(() => {
    Object.keys(updated).forEach(botId => {
      emitEvent('blocksUpdated', {
        botId,
        blocks: getObjectValues(updated[botId]),
      });
    });

    updated = {};
  }, updateInterval);
};

export const emitVariableUpdated =
  deferredEmit<VariablesData>('variablesUpdated');

export const emitBlockAdded = (event: { botId: string; block: Block }) => {
  emitEvent('blockAdded', event);
};

export const emitBlockRemoved = (event: { botId: string; blockId: string }) => {
  emitEvent('blockRemoved', event);
};
