/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { Component, ErrorInfo } from 'react';
import { logger } from 'shared/utils';

export class ErrorBoundary extends React.Component<
  { fallbackUI?: Component },
  { hasError: boolean; error?: Error; errorInfo?: ErrorInfo }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    logger.error(error, errorInfo);
    this.setState({ hasError: true, error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallbackUI ?? (
          <>
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error?.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </details>
          </>
        )
      );
    }

    return this.props.children;
  }
}
