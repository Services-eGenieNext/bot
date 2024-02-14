/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Emitter } from 'mitt';
import { FC } from 'react';
import { PartialRecord } from 'shared/types/utils';
import { ApiTemplate } from 'shared/types/api';
import { SerializedAnswer } from 'user-ui/lib';
import { BotWithBlockList } from './bots';

export type ModuleOptions = {
  debug: boolean;
  language: string;
  bots: BotWithBlockList[];
  updateInterval: number;
  globalVariables: string[];
  userVariables: string[];
  apiTemplates: ApiTemplate[];
  variableValues: {
    user: PartialRecord<string, any>;
    global: PartialRecord<string, any>;
  };
  responses: SerializedAnswer[];
};

export type ModuleContextType = {
  appName: string;
  mountNode: HTMLElement;
  emitter: Emitter;
  options: ModuleOptions;
  registerAction: (name: string, actionMethod: (arg: any) => any) => any;
};

export type ConnectedAppProps = {
  Component: FC;
  moduleContext: ModuleContextType;
};

export type RenderAsyncFunc = (
  moduleContext: ModuleContextType,
) => Promise<DestroyAppFunc>;

export type RenderAppFunc = (
  moduleContext: ModuleContextType,
) => DestroyAppFunc;

export type DestroyAppFunc = (mountNode: HTMLElement, emitter: Emitter) => void;
