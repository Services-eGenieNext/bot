/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import clsx from 'clsx';
import React, { FC, useCallback, useMemo } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { LocationDescriptorObject } from 'history';
import { BlockReference, LinkState } from 'user-ui/lib';
import { getOverviewPagePath, getQuestionPagePath } from 'user-ui/routes';

type LinkBaseProps = {
  className?: string;
  to: LocationDescriptorObject<LinkState>;
  asButton?: boolean;
  title?: string;
  disabled?: boolean;
  replace?: boolean;
};

const LinkBase: FC<LinkBaseProps> = props => {
  const { className, to, asButton, title, disabled, replace, children } = props;
  const history = useHistory<LinkState>();
  const location = history.location;

  const toWithState = useMemo(
    () => ({
      ...to,
      state: {
        ...location.state,
        ...to?.state,
        referrer: location,
      },
    }),
    [location, to],
  );

  const handleButtonClicked = useCallback(() => {
    !disabled && history.push(toWithState);
  }, [disabled, history, toWithState]);

  if (asButton) {
    return (
      <div
        role={'button'}
        tabIndex={0}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            handleButtonClicked();
          }
        }}
        className={clsx(className, disabled && 'disabled')}
        title={title}
        onClick={handleButtonClicked}
      >
        {children}
      </div>
    );
  }

  return (
    <Link<LinkState>
      className={className}
      to={!disabled ? toWithState : {}}
      title={title}
      replace={replace}
    >
      {children}
    </Link>
  );
};

type LinkProps = Omit<LinkBaseProps, 'to'> & {
  blockRef?: BlockReference;
  state?: LinkState;
};

const LinkQuestion: FC<LinkProps> = props => {
  const { blockRef, state, children, ...rest } = props;
  const pathname = blockRef && getQuestionPagePath(blockRef);
  const to = { pathname, state };

  return (
    <LinkBase to={to} {...rest}>
      {children}
    </LinkBase>
  );
};

const LinkOverview: FC<LinkProps> = props => {
  const { blockRef, state, children, ...rest } = props;
  const pathname = getOverviewPagePath(blockRef);

  const to = { pathname, state };

  return (
    <LinkBase to={to} {...rest}>
      {children}
    </LinkBase>
  );
};

const LinkRedirect: FC<LinkProps> = props => {
  const { blockRef, state, disabled, replace } = props;

  if (disabled) {
    return null;
  }

  const pathname = getOverviewPagePath(blockRef);
  const to = { pathname, state };

  return <Redirect to={to} push={!replace} />;
};

export default {
  Question: LinkQuestion,
  Overview: LinkOverview,
  Redirect: LinkRedirect,
};
