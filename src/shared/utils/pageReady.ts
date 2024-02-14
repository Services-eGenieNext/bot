/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

export const isPageReady = (): boolean => {
  return (
    document.readyState === 'complete' || document.readyState === 'interactive'
  );
};

export const whenPageReady = <T extends (...args: [...any]) => any>(
  callback: T,
  ...args: Parameters<T>
) => {
  if (isPageReady()) {
    callback(...args);
  } else {
    window.addEventListener('DOMContentLoaded', () => callback(...args));
  }
};
