/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { useEffect } from 'react';
import { StylesProvider } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from 'shared/styles/theme';
import { useModuleContext } from 'shared/context';
import {
  sanitizeBotsList,
  createGenerateClassName,
  useInjectReducer,
  useInjectSaga,
  logger,
} from 'shared/utils';
import BotEditor from 'builder/containers/BotEditor';
import { botEditorSaga } from 'builder/features/saga';
import { reducer, sliceKey } from 'builder/features/slice';
import './fonts.css';

const generateClassName = createGenerateClassName({
  productionPrefix: 'lawly',
});

export function BotBuilder() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: botEditorSaga });
  const { emitter, options } = useModuleContext();

  useEffect(() => {
    return () => {
      emitter.emit('unloaded');
      emitter.all.set('unloaded', []);
    };
  }, [emitter]);

  const hasBots =
    options.bots &&
    options.bots.length > 0 &&
    Object.keys(sanitizeBotsList(options.bots)).length;

  if (!hasBots) {
    logger.error(
      'BotBuilder has been initialized with empty or invalid bots, therefore not rendering',
    );
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider generateClassName={generateClassName}>
        <BotEditor />
      </StylesProvider>
    </ThemeProvider>
  );
}
