/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { botsReducer } from './bots/reducers';
import { selectedReducers } from './selection/reducers';
import { metadataReducer } from './metadata/reducers';
import { variableReducers } from './variables/reducers';

export default {
  ...botsReducer,
  ...selectedReducers,
  ...metadataReducer,
  ...variableReducers,
};
