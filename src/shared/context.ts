/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { useContext } from 'react';
import mitt from 'mitt';
import { ModuleContextType } from './types';

const moduleContextValue: ModuleContextType = {
  emitter: mitt(),
  appName: 'app',
  registerAction: () => void 0,
  mountNode: document.body,
  options: {
    debug: true,
    language: 'en',
    bots: [],
    updateInterval: 1000,
    userVariables: [],
    globalVariables: [],
    apiTemplates: [],
    variableValues: {
      user: {},
      global: {},
    },
    responses: [],
  },
};

export const ModuleContext =
  React.createContext<ModuleContextType>(moduleContextValue);

export const useModuleContext = () => {
  return useContext(ModuleContext);
};

export const setContext = (
  moduleContext: ModuleContextType,
): ModuleContextType => {
  return Object.assign(moduleContextValue, {
    ...moduleContext,
    options: {
      ...moduleContextValue.options,
      ...moduleContext.options,
    },
  });
};

export const getContext = (): ModuleContextType => {
  return moduleContextValue;
};
