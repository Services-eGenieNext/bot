/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Block, ResponseComponent } from 'shared/types';
import { actions } from 'user-ui/features/slice';
import { BlockAnswer, getComponents } from 'user-ui/lib';
import { useLocales } from 'shared/hooks';
import classes from '../ListAnswerPreview/styles.module.scss';

type ListAnswersOverviewProps = {
  className?: string;
  block: Block;
  answers: BlockAnswer[];
};

const ListAnswersOverview: FC<ListAnswersOverviewProps> = props => {
  const { className, block, answers } = props;

  const dispatch = useDispatch();
  const handleEditAnswer = useCallback(
    (index: number) => {
      dispatch(
        actions.moveAnswerToTail({
          blockId: block.id,
          index,
          keepLast: true,
        }),
      );
    },
    [block.id, dispatch],
  );

  const components = getComponents(block);

  return (
    <div
      className={clsx(className, classes.previewContainer, classes.overview)}
    >
      {answers.map((ans, index) => (
        <AnswerItem
          key={index}
          answer={ans}
          components={components}
          onClick={() => handleEditAnswer(index)}
        />
      ))}
    </div>
  );
};

export default ListAnswersOverview;

type AnswerItemProps = {
  answer: BlockAnswer;
  components: ResponseComponent[];
  onClick: () => any;
};

const AnswerItem: FC<AnswerItemProps> = props => {
  const { components, answer, onClick } = props;
  const { translate } = useLocales();

  return (
    <div
      role={'presentation'}
      className={clsx(classes.listItem)}
      onClick={onClick}
    >
      {components?.map((cmp, index) => (
        <div className={classes.questionItem} key={index}>
          <div className={classes.questionText}>{cmp.props?.title}</div>
          <div className={classes.answerText}>{answer[cmp.id]?.value}</div>
        </div>
      ))}
      <div className={classes.editBtn}>{translate('buttons.edit')}</div>
    </div>
  );
};
