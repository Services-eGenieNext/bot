/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { FlowTransform } from 'react-flow-renderer';
import { BotsMap, Selected, SelectedType } from 'shared/types';

export interface BotEditorState {
  bots: BotsMap;
  metadata: {
    [id: string]: {
      transform: FlowTransform;
    };
  };
  selected: Selected;
  variables: {
    global: string[];
    user: string[];
  };
}

export type BotEditorReducer<P = undefined> = CaseReducer<
  BotEditorState,
  PayloadAction<P>
>;

export const initialState: BotEditorState = {
  bots: {},
  metadata: {},
  selected: {
    selectedType: SelectedType.Bot,
    selectedBotId: undefined,
    selectedBlockId: undefined,
    selectedComponentId: undefined,
    selectedTabIndex: 0,
  },
  variables: {
    global: [],
    user: [],
  },
};
