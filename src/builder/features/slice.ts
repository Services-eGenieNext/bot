/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createSlice } from 'shared/utils/@reduxjs/toolkit';
import { initialState } from './state';
import reducers from './reducers';

const botEditorSlice = createSlice({
  name: 'botEditor',
  initialState,
  reducers,
});

export const { actions, reducer, name: sliceKey } = botEditorSlice;
