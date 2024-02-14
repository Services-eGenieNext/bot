/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { setInitiallyPreferedLanguageToLS } from 'shared/locales/helper';
import { ModuleFactory } from 'shared/module';
import { RenderAsyncFunc } from 'shared/types';

const renderAsync: RenderAsyncFunc = async moduleContext => {
  setInitiallyPreferedLanguageToLS(moduleContext.options.language);
  const { renderApp } = await import(
    /* webpackChunkName: "app" */
    'shared/app'
  );
  return renderApp(moduleContext);
};

export const env = process.env;

export const BotBuilder = ModuleFactory(renderAsync, 'BotBuilder');
export const BotUi = ModuleFactory(renderAsync, 'BotUi');
