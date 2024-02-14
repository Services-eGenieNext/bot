/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import clsx from 'clsx';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import HtmlContent from 'shared/components/HtmlContent';
import { useModuleContext } from 'shared/context';
import { ExclamationTriangleIcon } from 'shared/icons';
import { ComponentType, isApiBlock, isListBlock } from 'shared/types';
import Link from 'user-ui/components/Link';
import ListAnswerOverview from 'user-ui/components/ListAnswerOverview';
import { useCheckBlockForError } from 'user-ui/components/OverviewRow/useCheckBlockForError';
import { useTextWithVariableValues } from 'user-ui/hooks/useTextWithVariableValues';
import { getComponents, QuestionAnswer } from 'user-ui/lib';
import classes from './styles.module.scss';

type OverviewRowProps = {
  qa: QuestionAnswer;
};

const OverviewRow: FC<OverviewRowProps> = props => {
  const { qa } = props;
  const { emitter } = useModuleContext();
  const questionTitle = useTextWithVariableValues(qa.block?.text);
  const missingAnswer = qa.required && qa.missingAnswer;
  const [disabled, setDisabled] = useState(false);

  const safeDisable = useCallback(() => {
    setDisabled(true);
    setTimeout(() => setDisabled(false), 5000);
  }, []);

  useEffect(() => {
    emitter.on('submit', safeDisable);
    return () => emitter.off('submit', safeDisable);
  }, [emitter, safeDisable]);

  const errorMessage = useCheckBlockForError(qa.block);

  return (
    <Link.Question
      className={classes.overviewRow}
      blockRef={qa.blockRef}
      state={{ editing: true }}
      disabled={disabled}
      asButton
    >
      {errorMessage && !qa.missingAnswer && (
        <div className={classes.alertColor}>
          <ExclamationTriangleIcon
            className={classes.alertIcon}
            size={'0.9em'}
          />
          {errorMessage}
        </div>
      )}
      <HtmlContent
        className={clsx(
          classes.questionText,
          missingAnswer && classes.alertColor,
        )}
        content={questionTitle}
      />

      <AnswerValue {...props} />
    </Link.Question>
  );
};

export default OverviewRow;

const AnswerValue: FC<OverviewRowProps> = props => {
  const { qa } = props;
  const { answers, firstAnswer, block, missingAnswer, apiStatus } = qa;

  const singleAnswer: string[] | undefined = useMemo(() => {
    const components = getComponents(block);
    const apiConfirm = apiStatus?.response?.components?.find(
      c => c.type === ComponentType.Confirm,
    );
    if (components.length !== 1 || !firstAnswer) {
      return;
    }

    const apiLines = apiConfirm?.props?.lines;
    const { displayText, value } = firstAnswer;
    const lines: string[] = [];
    if (block && isApiBlock(block)) {
      if (apiLines) {
        lines.push(...apiLines);
      } else if (displayText !== value) {
        lines.push(...[displayText ?? '', value ?? '']);
      }
    } else {
      lines.push(displayText || value || '');
    }

    return lines;
  }, [apiStatus?.response?.components, block, firstAnswer]);

  return (
    <>
      {singleAnswer ? (
        <div className={classes.answerContainer}>
          <div className={classes.singleAnswer}>
            <span>{singleAnswer[0]}</span>
          </div>
          {singleAnswer[1] && (
            <div className={classes.singleAnswerHint}>
              <span>{singleAnswer[1]}</span>
            </div>
          )}
        </div>
      ) : null}
      {answers && block && isListBlock(block) && (
        <ListAnswerOverview block={block} answers={answers} />
      )}
      {missingAnswer && (
        <div className={classes.answerContainer}>
          <div className={classes.svara}>Svara</div>
        </div>
      )}
    </>
  );
};
