/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createMemoryHistory, createHashHistory } from 'history';
import { isInsideWebView, LinkState } from 'user-ui/lib';

const isWebView = isInsideWebView();

const memoryHistory = createMemoryHistory<LinkState | undefined>();
const hashHistory = createHashHistory<LinkState | undefined>();

export const history = isWebView ? memoryHistory : hashHistory;
