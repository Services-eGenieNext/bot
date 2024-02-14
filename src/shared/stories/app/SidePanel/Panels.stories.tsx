/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { PayloadAction } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { Meta, Story } from '@storybook/react';
import { Provider, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'shared/utils';
import { configureAppStore } from 'shared/store/configureStore';
import SidePanel from 'builder/containers/SidePanel';
import testBlocks from 'builder/containers/FlowDiagram/__tests__/fixtures/blocks';
import { botEditorSaga } from 'builder/features/saga';
import { reducer, sliceKey, actions } from 'builder/features/slice';
import { BlockTypes } from 'shared/types';

const store = configureAppStore();

export default {
  title: 'App/SidePanel/Panels',
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

const Template: Story<{
  preActions: PayloadAction<any>[];
  tabIndex;
}> = args => {
  const { preActions, tabIndex } = args;
  const dispatch = useDispatch();
  useEffect(() => {
    testBlocks?.forEach(block => dispatch(actions.createBlock(block)));
    dispatch(actions.setSelectedTabIndex(tabIndex));
    preActions?.forEach(action => dispatch(action));
  }, [dispatch, preActions, tabIndex]);

  return <SidePanel />;
};

export const ParagraphEmptyPanel = Template.bind({});
ParagraphEmptyPanel.args = {
  preActions: [actions.setSelectedToBlock('block-1')],
  tabIndex: 2,
};

export const ParagraphTriggers = Template.bind({});
ParagraphTriggers.args = {
  preActions: [actions.setSelectedToBlock('block-0')],
  tabIndex: 2,
};

export const ParagraphResponseSelected = Template.bind({});
ParagraphResponseSelected.args = {
  preActions: [
    actions.setSelectedToBlock('block-0'),
    actions.setSelectedToResponse('response-0'),
  ],
  tabIndex: 2,
};

export const ConnectionEmptyPanel = Template.bind({});
ConnectionEmptyPanel.args = {
  preActions: [
    actions.createBlock({ type: BlockTypes.Text, id: '111' }),
    actions.setSelectedToBlock('111'),
  ],
  tabIndex: 1,
};
