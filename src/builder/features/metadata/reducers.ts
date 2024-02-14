/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { FlowTransform } from 'react-flow-renderer';
import { BotEditorReducer } from '../state';

export interface MetadataReducers {
  updateBotTransform: BotEditorReducer<{
    botId?: string;
    transform?: FlowTransform;
  }>;
}

export const metadataReducer: MetadataReducers = {
  updateBotTransform(state, action) {
    const { botId, transform } = action.payload;
    if (!botId) {
      return;
    }

    const defaultTransform = { x: 0, y: 0, zoom: 1 };
    const metadata = state.metadata;
    metadata[botId] = {
      ...metadata[botId],
      transform: transform ?? metadata[botId]?.transform ?? defaultTransform,
    };
  },
};
