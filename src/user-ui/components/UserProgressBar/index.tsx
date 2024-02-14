/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { ProgressBar } from 'react-bootstrap';
import './progress.scss';

type UserProgressBarProps = {
  className?: string;
  percentage: number;
};

const UserProgressBar: FC<UserProgressBarProps> = props => {
  const { className, percentage } = props;
  const now = percentage < 0 ? 0 : percentage > 100 ? 100 : percentage;

  return (
    <ProgressBar
      variant={'lawly'}
      className={className}
      now={now * 0.9 + 10}
      label={<div className={'progress-label'}>{now} %</div>}
    />
  );
};

export default UserProgressBar;
