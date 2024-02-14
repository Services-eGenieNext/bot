/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { LocationDescriptorObject } from 'history';
import { history } from 'shared/utils/history';
import { BlockReference, LinkState } from 'user-ui/lib/types';
import { getQuestionPagePath } from 'user-ui/routes';

export const redirectToQuestion = <T = LinkState>(
  blockRef: BlockReference,
  replace: boolean = false,
  state?: T,
) => {
  const redirect2 = (loc: LocationDescriptorObject<LinkState>) => {
    const currentLoc = history.location;
    if (replace || currentLoc.pathname === loc.pathname) {
      history.replace(loc);
    } else {
      history.push(loc);
    }
  };

  const currentState = history.location.state;

  setImmediate(() =>
    redirect2({
      pathname: getQuestionPagePath(blockRef),
      state: {
        ...currentState,
        ...state,
      },
    }),
  );
};

export const updateLocationState = <T = LinkState>(state: T) => {
  history.replace({
    ...history.location,
    state: { ...history.location.state, ...state },
  });
};
