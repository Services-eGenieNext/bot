/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useModuleContext } from 'shared/context';
import { getObjectValues } from 'shared/utils';
import OverviewFooter from 'user-ui/components/OverviewFooter';
import { getSettlementVariablesSum } from 'user-ui/features/variables/selectors';
import {
  ChapterData,
  findNextNeedAnswer,
  getChapterSequence,
  getRefFromSequence,
  isChapterCompleted,
  redirectToQuestion,
} from 'user-ui/lib';
import { OverviewCard } from 'user-ui/containers/OverviewCard';
import {
  getAnswerSequenceAll,
  getSubmitData,
} from 'user-ui/features/answers/selectors';
import {
  getChapters,
  getIsChapterBased,
} from 'user-ui/features/bots/selectors';
import { useLocales } from 'shared/hooks';
import classes from './styles.module.scss';

const Overview: FC = () => {
  const { translate } = useLocales();
  const { emitter } = useModuleContext();
  const chapterBased = useSelector(getIsChapterBased);
  const sequence = useSelector(getAnswerSequenceAll);
  const chapters = useSelector(getChapters);
  const submitData = useSelector(getSubmitData);
  const history = useHistory();
  const settlementVariablesSum = useSelector(getSettlementVariablesSum);
  const isSettlementsValid = getObjectValues(settlementVariablesSum).every(
    v => v === 100,
  );
  const chapterIds = chapters.map(({ id }) => id);

  const isCompleted = useCallback(
    (botId?: string) => isChapterCompleted(sequence, chapterBased, botId),
    [chapterBased, sequence],
  );

  const isSubmittable = useMemo(() => {
    return isSettlementsValid && chapterIds.every(isCompleted);
  }, [chapterIds, isCompleted, isSettlementsValid]);

  const nextNeedAnswer = useMemo(
    () => findNextNeedAnswer(sequence),
    [sequence],
  );

  const currentIndex = useMemo(() => {
    const currentChapterId = nextNeedAnswer?.bot?.id;
    return currentChapterId
      ? chapterIds.indexOf(currentChapterId)
      : chapterIds.length - 1;
  }, [chapterIds, nextNeedAnswer?.bot?.id]);

  const isCurrentChapter = useCallback(
    (index: number, botId?: string) => {
      if (!botId) {
        return false;
      }

      return currentIndex === index;
    },
    [currentIndex],
  );

  const chapterSequences: Record<string, ChapterData> = useMemo(
    () => getChapterSequence(sequence, chapters, chapterBased),
    [chapters, chapterBased, sequence],
  );

  useEffect(() => {
    const nextBlockRef = getRefFromSequence(nextNeedAnswer);

    if (!chapterBased && nextNeedAnswer) {
      nextBlockRef && redirectToQuestion(nextBlockRef, true);
    }
  }, [chapterBased, history, nextNeedAnswer]);

  useEffect(() => {
    emitter.emit('overviewPageReached', {
      chapterBased,
      submitData,
      isCompleted,
      isSubmittable,
    });
  }, [chapterBased, emitter, isCompleted, isSubmittable, submitData]);

  return (
    <Container className={classes.overviewPage}>
      <div className={classes.title}>
        {!chapterBased && translate('generics.isThisCorrect')}
      </div>
      <div className={classes.chapterCards}>
        {Object.entries(chapterSequences).map(([botId, chapter], index) => (
          <OverviewCard
            key={index}
            index={index}
            current={isCurrentChapter(index, botId)}
            currentIndex={currentIndex}
            chapterBased={chapterBased}
            completed={isCompleted(botId)}
            sequence={chapter.sequence}
            next={nextNeedAnswer}
            chapterBot={chapter.bot}
          />
        ))}
      </div>
      <OverviewFooter
        disabled={!isSubmittable}
        onSubmit={() => emitter.emit('submit', submitData)}
      />
    </Container>
  );
};

export default Overview;
