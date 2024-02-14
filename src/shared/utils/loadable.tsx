/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { lazy, Suspense } from 'react';

interface Opts {
  fallback: React.ReactNode;
}

type Unpromisify<T> = T extends Promise<infer P> ? P : never;

export const lazyLoad = <
  T extends Promise<any>,
  U extends React.ComponentType<any>,
>(
  importFunc: () => T,
  selectorFunc?: (s: Unpromisify<T>) => U,
  opts: Opts = { fallback: null },
) => {
  let lazyFactory: () => Promise<{ default: U }> = importFunc;

  if (selectorFunc) {
    lazyFactory = () =>
      importFunc().then(module => ({ default: selectorFunc(module) }));
  }

  const LazyComponent = lazy(lazyFactory);

  return function Loadable(props: React.ComponentProps<U>): JSX.Element {
    return (
      <Suspense fallback={opts.fallback!}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};
