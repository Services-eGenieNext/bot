/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { getApp } from 'shared/app';
import { getContext } from 'shared/context';
import { configureAppStore } from 'shared/store/configureStore';
import { BotBuilder } from 'builder';

const renderer = createRenderer();
const store = configureAppStore();

describe('<App />', () => {
  let realUseContext;
  let useContextMock;

  beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = jest.fn();
  });

  afterEach(() => {
    React.useContext = realUseContext;
  });

  beforeAll(() => {
    jest.mock('app/builder/Loadable', () => require('builder/index'));
  });

  it('getApp should render BotBuilder using get app', async () => {
    renderer.render(getApp({ ...getContext(), appName: 'BotBuilder' }));
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput.props.children).toMatchSnapshot();
  });

  it('getApp should render BotBuilder directly', async () => {
    useContextMock.mockReturnValue({ store });
    renderer.render(<BotBuilder />);

    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput.props.children).toMatchSnapshot();
  });
});
