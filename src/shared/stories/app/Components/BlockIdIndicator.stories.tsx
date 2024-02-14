/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React from 'react';

import { Story, Meta } from '@storybook/react';

import BlockIdIndicator, {
  BlockIdIndicatorProps,
} from 'builder/components/BlockIdIndicator';

export default {
  title: 'App/Components/BlockIdIndicator',
  component: BlockIdIndicator,
} as Meta;

const Template: Story<BlockIdIndicatorProps> = args => (
  <BlockIdIndicator {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  blockId: 'c75f8b19-62f2-46a7-b659-6a484b592014',
};
