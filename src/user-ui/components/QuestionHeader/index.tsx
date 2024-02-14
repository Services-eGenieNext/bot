/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCurrentBlockRef } from 'user-ui/hooks';
import { getProgressPercent } from 'user-ui/features/bots/selectors';
import UserProgressBar from '../UserProgressBar';
import classes from './styles.module.scss';

type QuestionHeaderProps = {
  className?: string;
  currentStep?: number;
  totalSteps?: number;
};

const QuestionHeader: FC<QuestionHeaderProps> = props => {
  const { className } = props;
  const { blockId } = useCurrentBlockRef() ?? {};

  const selectProgressPercent = useCallback(
    state => getProgressPercent(state, blockId),
    [blockId],
  );

  const progressPercent = useSelector(selectProgressPercent);

  return (
    <div className={clsx(className, classes.navbar)}>
      <div className={classes.progress}>
        <UserProgressBar percentage={progressPercent || 0} />
        <FontAwesomeIcon className={classes.flagIcon} icon={faFlagCheckered} />
      </div>
    </div>
  );
};

export default QuestionHeader;
