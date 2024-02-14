/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Meta, Story } from '@storybook/react';
import React from 'react';
import {
  useSnackConfirm,
  SnackBarConfirm,
  SnackBarConfirmProps,
} from 'builder/components/SnackBarActionConfirm';

export default {
  title: 'App/Components/SnackBarActionConfirm',
  component: SnackBarConfirm,
} as Meta;

const Template: Story<SnackBarConfirmProps> = args => {
  const [SnackBar] = useSnackConfirm();
  return <SnackBar />;
};

export const Primary = Template.bind({});

Primary.args = {
  open: true,
  message: 'Action Confirmed!',
};
