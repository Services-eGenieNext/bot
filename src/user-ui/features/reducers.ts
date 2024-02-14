/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { botsReducers } from './bots/reducers';
import { answerReducers } from './answers/reducers';
import { variableReducers } from './variables/reducers';
import { navigationReducers } from './navigation/reducers';
import { apiReducers } from './api/reducers';

const reducers = {
  ...botsReducers,
  ...answerReducers,
  ...variableReducers,
  ...navigationReducers,
  ...apiReducers,
};

export default reducers;
