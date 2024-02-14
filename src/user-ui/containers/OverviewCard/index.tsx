/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback, useMemo, useState } from 'react';
import { Card, Accordion } from 'react-bootstrap';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Bot } from 'shared/types';
import { useLocales } from 'shared/hooks';
import ActionButton from 'user-ui/components/ActionButton';
import OverviewRow from 'user-ui/components/OverviewRow';
import { useChapterHasError } from 'user-ui/components/OverviewRow/useCheckBlockForError';
import AccordionToggle from 'user-ui/containers/OverviewCard/AccordionToggle';
import OverviewCardHeader, {
  OverviewCardHeaderProps,
} from 'user-ui/containers/OverviewCard/OverviewCardHeader';
import { getNavigation } from 'user-ui/features/navigation/selectors';
import { getVariables } from 'user-ui/features/variables/selectors';
import {
  getComponents,
  getQuestionAnswer,
  getRefFromSequence,
  redirectToQuestion,
  QuestionAnswer,
  SequenceInfo,
} from 'user-ui/lib';

import overviewRowClasses from '../../components/OverviewRow/styles.module.scss';
import classes from './styles.module.scss';

export type OverviewCardProps = {
  sequence: SequenceInfo[];
  chapterBot: Bot;
  next?: SequenceInfo;
  completed?: boolean;
  current?: boolean;
  currentIndex: number;
  chapterBased?: boolean;
  index?: number;
};

export const OverviewCard: FC<OverviewCardProps> = props => {
  const { translate } = useLocales();
  const {
    sequence,
    chapterBot,
    next,
    completed,
    current,
    currentIndex,
    chapterBased,
    index = 0,
  } = props;

  const nextRef = useMemo(() => getRefFromSequence(next), [next]);
  const variables = useSelector(getVariables);
  const navigation = useSelector(getNavigation);
  const blocks = sequence.map(x => x.block);
  const chapterHasError = useChapterHasError(blocks);
  const currentBlock = navigation.current;

  const initialCollapsed = useMemo(() => {
    return (
      chapterBased &&
      completed &&
      !chapterHasError &&
      (currentBlock
        ? currentBlock.botId !== chapterBot.id
        : currentIndex > index)
    );
  }, [
    chapterBased,
    chapterBot.id,
    chapterHasError,
    completed,
    currentBlock,
    currentIndex,
    index,
  ]);

  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const eventKey = initialCollapsed ? '1' : '0';

  const questionAnswers: QuestionAnswer[] = useMemo(() => {
    return sequence.map(seq => getQuestionAnswer(seq, variables));
  }, [sequence, variables]);

  const started: boolean = useMemo(
    () => sequence.length > 0,
    [sequence.length],
  );

  const startClickHandler = useCallback(() => {
    if (!nextRef) {
      return;
    }

    redirectToQuestion(nextRef, false, { editing: started });
  }, [nextRef, started]);

  const active = completed || current;

  const startBtnTitle = started
    ? translate('buttons.goOnWithChapter', { n: index + 1 })
    : translate('buttons.startChapter', { n: index + 1 });

  const notToggleable = !chapterBased || !completed;

  const headerProps: OverviewCardHeaderProps = {
    ...props,
    chapterHasError,
    started,
  };

  return (
    <Accordion defaultActiveKey="0">
      <div className={classes.overviewCardContainer}>
        <Card
          className={clsx(
            classes.overviewCard,
            !active ? 'disabled' : undefined,
            notToggleable ? 'not-toggleable' : undefined,
            collapsed ? classes.collapsed : undefined,
          )}
        >
          <Card.Body>
            {chapterBased && (
              <AccordionToggle
                as="div"
                className={clsx(
                  overviewRowClasses.overviewRow,
                  classes.overviewHeader,
                )}
                eventKey={eventKey}
                onClick={() => setCollapsed(!collapsed)}
                disabled={!chapterBased || !completed}
              >
                <OverviewCardHeader {...headerProps} />
              </AccordionToggle>
            )}
            <Accordion.Collapse eventKey={eventKey}>
              <>
                {questionAnswers
                  .filter(qa => getComponents(qa.block).length > 0)
                  .map((qa, index) => (
                    <OverviewRow key={index} qa={qa} />
                  ))}
                {!completed && (
                  <div className={overviewRowClasses.overviewRow}>
                    <ActionButton
                      className={classes.startButton}
                      // colorVariant={'orange'}
                      variant={'success'}
                      title={startBtnTitle}
                      disabled={!active}
                      onClick={startClickHandler}
                      fullWidth
                    />
                  </div>
                )}
              </>
            </Accordion.Collapse>
          </Card.Body>
        </Card>
      </div>
    </Accordion>
  );
};
