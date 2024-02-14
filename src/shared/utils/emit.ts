/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/throttle';
import { logger } from 'shared/utils';
import { getContext } from 'shared/context';

export const emitEvent = (eventType: string, event?: any) => {
  const { emitter } = getContext();
  if (!emitter) {
    logger.error('Emitter is not available in state yet.');
    return;
  }

  emitter.emit(eventType, cloneDeep(event));
};

export const deferredEmit = <T>(eventType: string) => {
  const { options } = getContext();
  return debounce(
    (event?: T) => emitEvent(eventType, event),
    options.updateInterval ?? 1000,
  );
};
