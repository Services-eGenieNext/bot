/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { Meta, Story } from '@storybook/react';
import { configureAppStore } from 'shared/store/configureStore';
import SidePanel from 'builder/containers/SidePanel';
import testBlocks from 'builder/containers/FlowDiagram/__tests__/fixtures/blocks';
import { botEditorSaga } from 'builder/features/saga';
import { reducer, sliceKey, actions } from 'builder/features/slice';
import { useInjectReducer, useInjectSaga } from 'shared/utils/redux-injectors';

const store = configureAppStore();

export default {
  title: 'App/SidePanel/Properties',
  component: SidePanel,
  decorators: [
    Story => {
      useInjectReducer({ key: sliceKey, reducer: reducer });
      useInjectSaga({ key: sliceKey, saga: botEditorSaga });
      return <Story />;
    },
    Story => {
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
  argTypes: {},
} as Meta;

const Template: Story<{ preActions: PayloadAction<any>[] }> = args => {
  const { preActions } = args;
  const dispatch = useDispatch();
  useEffect(() => {
    testBlocks?.forEach(block => dispatch(actions.createBlock(block)));
    preActions?.forEach(action => dispatch(action));
  }, [dispatch, preActions]);

  return <SidePanel />;
};

export const BlockNotSelected = Template.bind({});
BlockNotSelected.args = {
  preActions: [],
};

export const BlockSelected = Template.bind({});
BlockSelected.args = {
  preActions: [actions.setSelectedToBlock('block-0')],
};

export const PredefinedResponseSelected = Template.bind({});
PredefinedResponseSelected.args = {
  preActions: [
    actions.setSelectedToBlock('block-0'),
    actions.setSelectedToResponse('response-0'),
  ],
};

export const FreeSpeechResponseSelected = Template.bind({});
FreeSpeechResponseSelected.args = {
  preActions: [
    actions.setSelectedToBlock('block-2'),
    actions.setSelectedToResponse('response-0'),
  ],
};

export const TextMessageSelected = Template.bind({});
TextMessageSelected.args = {
  preActions: [actions.setSelectedToTextMessage()],
};

export const ReadMoreSelected = Template.bind({});
ReadMoreSelected.args = {
  preActions: [actions.setSelectedToReadMore()],
};
