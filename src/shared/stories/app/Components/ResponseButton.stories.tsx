/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ResponseButton, {
  ResponseButtonProps,
} from 'builder/components/ResponseButton';

export default {
  title: 'App/Components/ResponseButton',
  component: ResponseButton,
} as Meta;

const Template: Story<ResponseButtonProps> = args => (
  <ResponseButton {...args} />
);

export const TextButton = Template.bind({});
TextButton.args = {};

export const AddButton = Template.bind({});
AddButton.args = {
  buttonVariant: 'add',
};
