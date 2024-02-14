/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Emitter } from 'mitt';
import {
  ConnectedAppProps,
  DestroyAppFunc,
  ModuleContextType,
  RenderAppFunc,
} from 'shared/types';
import { logger } from 'shared/utils';
import { ErrorBoundary } from 'shared/containers/ErrorBoundary';
import { configureAppStore } from 'shared/store/configureStore';
import { ModuleContext, setContext } from './context';
import 'shared/locales/i18n';
import 'react-app-polyfill/stable';
import { clearPreferredLanguageFromLS } from './locales/helper';

const ConnectedApp: FC<ConnectedAppProps> = ({ Component, moduleContext }) => {
  const contextValue = setContext(moduleContext);
  return (
    <ModuleContext.Provider value={contextValue}>
      <Provider store={store}>
        <React.StrictMode>
          <ErrorBoundary>
            <Component />
          </ErrorBoundary>
        </React.StrictMode>
      </Provider>
    </ModuleContext.Provider>
  );
};

export const store = configureAppStore();

export const getApp = (moduleContext: ModuleContextType) => {
  const { appName } = moduleContext;
  let AppComponent: FC = () => null;
  switch (appName) {
    case 'BotBuilder':
      AppComponent = require('builder/Loadable').BotBuilder;
      break;
    case 'BotUi':
      AppComponent = require('user-ui/Loadable').BotUi;
      break;
  }

  return (
    <ConnectedApp Component={AppComponent} moduleContext={moduleContext} />
  );
};

const destroyApp: DestroyAppFunc = (
  mountNode: HTMLElement,
  emitter: Emitter,
) => {
  const unmounted = ReactDOM.unmountComponentAtNode(mountNode);
  if (unmounted) {
    emitter.emit('destroyed');
  }
  clearPreferredLanguageFromLS();
};

export const renderApp: RenderAppFunc = moduleContext => {
  const { mountNode } = moduleContext;
  if (module.hot) {
    module.hot.accept(['builder/Loadable', './locales/i18n'], () => {
      ReactDOM.hydrate(getApp(moduleContext), mountNode);
    });
  }

  const App = () => getApp(moduleContext);
  if (mountNode.childElementCount > 0) {
    logger.warn(
      'The mount node contains child elements, hydrating instead of rendering.',
    );
    ReactDOM.hydrate(<App />, mountNode);
  } else {
    ReactDOM.render(<App />, mountNode);
  }

  return destroyApp;
};
