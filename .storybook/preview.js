import * as React from 'react';
import { ConnectedApp } from '../src';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [
  (Story) => (
    <ConnectedApp Component={Story} />
  ),
];