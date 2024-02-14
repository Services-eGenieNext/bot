/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import clsx from 'clsx';
import React, { FC } from 'react';
import { Card } from 'react-bootstrap';
import HtmlContent from 'shared/components/HtmlContent';
import { Block, isPresentationBlock } from 'shared/types';
import PresentationBlock from 'user-ui/components/PresentationBlock';
import ReadMoreModal from 'user-ui/components/ReadMoreModal';
import { useTextWithVariableValues } from 'user-ui/hooks/useTextWithVariableValues';
import classes from '../styles.module.scss';

type QuestionCardHeaderProps = { block: Block; className?: string };

export const QuestionCardHeader: FC<QuestionCardHeaderProps> = props => {
  const { block, className } = props;
  const questionTitle = useTextWithVariableValues(block.text);
  const readMore = block.readMore;
  const hasClassicReadMore =
    readMore?.enabled && !readMore.excerpt?.trim() && readMore.text?.trim();

  return (
    <Card.Header
      className={clsx(className, hasClassicReadMore && classes.hasReadMore)}
    >
      {hasClassicReadMore && (
        <ReadMoreModal
          htmlContent={readMore?.text ?? ''}
          buttonLabel={readMore?.label}
        />
      )}
      {isPresentationBlock(block) ? (
        <PresentationBlock block={block} />
      ) : (
        <Card.Title className={clsx(classes.questionTitle)}>
          <HtmlContent content={questionTitle} />
        </Card.Title>
      )}
    </Card.Header>
  );
};
