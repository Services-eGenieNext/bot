/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

/**
 * Asynchronously loads the component for BotBuilder
 */

import { lazyLoad } from 'shared/utils/loadable';

export const BotBuilder = lazyLoad(
  () =>
    import(
      /* webpackChunkName: "builder" */
      './index'
    ),
  module => module.BotBuilder,
);
