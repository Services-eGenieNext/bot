/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, ReactEventHandler, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { ArrowRightIcon } from 'shared/icons';
import { actions } from 'user-ui/features/slice';
import { useCurrentBlockRef } from 'user-ui/hooks';
import { useLocales } from 'shared/hooks';
import classes from './styles.module.scss';

type QuestionFooterProps = {
  onPrevious: ReactEventHandler;
  onSkip: ReactEventHandler;
  skipDisabled?: boolean;
  backDisabled?: boolean;
};

const QuestionFooter: FC<QuestionFooterProps> = props => {
  const { onPrevious, onSkip, skipDisabled, backDisabled } = props;
  const dispatch = useDispatch();
  const blockRef = useCurrentBlockRef();
  const { translate } = useLocales();

  const handleSkip = useCallback(
    event => {
      if (blockRef && !skipDisabled) {
        dispatch(actions.setAnswersAsSkipped(blockRef));
        onSkip(event);
      }
    },
    [blockRef, dispatch, onSkip, skipDisabled],
  );

  return (
    <div className={classes.footerContainer}>
      <Button
        className={clsx(classes.footerButton, classes.leftAligned)}
        variant={'none'}
        disabled={backDisabled}
        onClick={onPrevious}
      >
        <ArrowRightIcon className={classes.icon} flipX />
        <span className={classes.text}>{translate('buttons.previous')}</span>
      </Button>
      <Button
        className={clsx(classes.footerButton, classes.nextQuestionButton)}
        variant={'none'}
        disabled={skipDisabled}
        onClick={handleSkip}
      >
        <div className={classes.content}>
          <div className={classes.title}>
            {translate('buttons.skipQuestion')}
          </div>
          <div className={classes.subTitle}>
            {translate('buttons.skipQuestionSubTitle')}
          </div>
        </div>
        <ArrowRightIcon className={classes.icon} />
      </Button>
    </div>
  );
};

export default QuestionFooter;
