/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import clsx from 'clsx';
import { CaretLeftIcon } from 'shared/icons';
import {
  AnswerValue,
  Block,
  PartialRecord,
  ResponseComponent,
} from 'shared/types';
import { actions } from 'user-ui/features/slice';
import { getComponents } from 'user-ui/lib';
import { useLocales } from 'shared/hooks';
import classes from './styles.module.scss';

type ListAnswersPreviewProps = {
  className?: string;
  block: Block;
  answers: Array<Partial<Record<string, AnswerValue>>>;
  onCheckValidity: () => boolean;
};

const ListAnswersPreview: FC<ListAnswersPreviewProps> = props => {
  const { className, block, answers, onCheckValidity } = props;
  const dispatch = useDispatch();

  const [expandedIndex, setExpandIndex] = useState(-1);

  const handleDeleteAnswer = useCallback(
    (index: number) => {
      dispatch(
        actions.deleteAnswerByIndex({
          blockId: block.id,
          index,
        }),
      );
    },
    [block.id, dispatch],
  );

  const handleEditAnswer = useCallback(
    (index: number) => {
      dispatch(
        actions.moveAnswerToTail({
          blockId: block.id,
          index,
          keepLast: onCheckValidity(),
        }),
      );
    },
    [block.id, dispatch, onCheckValidity],
  );

  const previewAnswer =
    answers.length > 1 ? answers.slice(0, answers.length - 1) : [];

  const components = getComponents(block);
  if (components.length === 0 || previewAnswer.length < 1) {
    return null;
  }

  return (
    <div
      className={clsx(
        className,
        classes.previewContainer,
        classes.questionCard,
      )}
    >
      {previewAnswer.map((ans, index) => (
        <AnswerItem
          key={index}
          expand={expandedIndex === index}
          answer={ans}
          components={components}
          onDeleteClick={() => handleDeleteAnswer(index)}
          onEditClick={() => handleEditAnswer(index)}
          onExpandClick={() =>
            setExpandIndex(expandedIndex !== index ? index : -1)
          }
        />
      ))}
    </div>
  );
};

export default ListAnswersPreview;

type AnswerItemProps = {
  answer: PartialRecord<string, AnswerValue>;
  components: ResponseComponent[];
  expand?: boolean;
  onEditClick: () => any;
  onDeleteClick: () => any;
  onExpandClick: () => any;
};

const AnswerItem: FC<AnswerItemProps> = props => {
  const {
    components,
    answer,
    onEditClick,
    onDeleteClick,
    onExpandClick,
    expand,
  } = props;
  const { translate } = useLocales();

  return (
    <div
      role={'presentation'}
      className={clsx(classes.listItem, !expand && classes.collapsed)}
      onClick={onExpandClick}
    >
      <CaretLeftIcon className={classes.expandIcon} rotate={expand ? -90 : 0} />
      {components?.map((cmp, index) => (
        <div className={classes.questionItem} key={index}>
          <div className={classes.questionText}>{cmp.props?.title}</div>
          <div className={classes.answerText}>{answer[cmp.id]?.value}</div>
        </div>
      ))}

      <div className={classes.itemButtons}>
        <Button
          variant={'warning'}
          title={translate('buttons.edit_alt')}
          block
          onClick={onEditClick}
        >
          {translate('buttons.edit_alt')}
        </Button>
        <Button
          variant={'danger'}
          title={translate('buttons.remove')}
          block
          onClick={onDeleteClick}
        >
          {translate('buttons.remove')}
        </Button>
      </div>
    </div>
  );
};
