/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import mitt, { Emitter, EventType } from 'mitt';
import { whenPageReady } from 'shared/utils/pageReady';
import { logger } from 'shared/utils/logger';
import { RenderAsyncFunc } from 'shared/types/module';

class Module {
  loaded = false;
  actions = {};
  readonly #emitter: Emitter;
  readonly #mountNode: HTMLElement;
  readonly #renderAsync: RenderAsyncFunc;
  #initError?: Error;

  constructor(
    renderAsync: RenderAsyncFunc,
    private appName: string,
    selector: string,
    readonly options: any,
  ) {
    this.#renderAsync = renderAsync;
    const node = document.querySelector<HTMLElement>(selector);
    if (!node) {
      throw new Error('Cannot find DOM node with provided selector');
    }
    this.#mountNode = node;
    const emitter = (this.#emitter = mitt());
    const originalEmit = emitter.emit.bind(emitter);
    emitter.emit = (type, event) => {
      setTimeout(() => originalEmit(type, event), 10);
    };
    emitter.on('loaded', () => (this.loaded = true));
    emitter.on('unloaded', () => (this.loaded = false));
    emitter.on('*', (eventType, event) => {
      if (this.options.debug) {
        logEvent(eventType, event);
      }
    });

    whenPageReady(() => this.#renderApp().catch(logger.error));
  }

  on(eventName, eventHandler) {
    this.#getEmitter().on(eventName, eventHandler);
  }

  off(eventName, eventHandler) {
    this.#getEmitter().off(eventName, eventHandler);
  }

  trigger(actionName, eventData) {
    const eventType = `action:${actionName}`;
    if (!this.loaded) {
      return this.#getEmitter().on('loaded', () =>
        this.#getEmitter().emit(eventType, eventData),
      );
    }
    this.#getEmitter().emit(eventType, eventData);
  }

  destroy() {
    this.#destroyApp();
  }

  #destroyApp: () => void = () => void 0;

  #registerAction = (name, actionMethod) => {
    const addAction = () => {
      this.actions[name] = actionMethod;
      this.#emitter.all.delete(`action:${name}`);
      this.#emitter.on(`action:${name}`, (...args) => actionMethod(...args));
      this.#getEmitter().off('loaded', addAction);
    };

    if (!this.loaded) {
      this.#getEmitter().on('loaded', addAction);
    } else {
      addAction();
    }
  };

  #renderApp = async () => {
    try {
      const destroyApp = await this.#renderAsync({
        appName: this.appName,
        mountNode: this.#mountNode,
        emitter: this.#emitter,
        options: this.options,
        registerAction: this.#registerAction,
      });
      this.#destroyApp = () => {
        if (!this.#mountNode) {
          return;
        }
        destroyApp(this.#mountNode, this.#emitter);
      };
    } catch (err) {
      this.#initError = err;
      logger.error(err);
    }
  };

  #getEmitter = () => {
    if (this.#initError) {
      logger.error(`${this.appName} initialization failed with error.`);
      throw this.#initError;
    }
    return this.#emitter;
  };
}

export const ModuleFactory =
  (renderAsync: RenderAsyncFunc, appName: string) =>
  (selector: string, options: any = {}) => {
    return new Module(renderAsync, appName, selector, options);
  };

const logEvent = (eventType: EventType, event) => {
  const isAction = eventType.toString().startsWith('action');
  const type = isAction ? 'Action' : 'Event';
  if (isAction) {
    logger.debug(`${type}: ${String(eventType)}`, { event });
  } else {
    logger.info(`${type}: ${String(eventType)}`, { event });
  }
};
