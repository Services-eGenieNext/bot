/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, {
  FC,
  MutableRefObject,
  ReactEventHandler,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AnswerChangeHandler,
  AnswerValue,
  BlockTypes,
  isApiBlock,
} from 'shared/types';
import { logger } from 'shared/utils';
import ListBlock from 'user-ui/components/ListBlock';
import TextBlock from 'user-ui/components/TextBlock';
import {
  getBlockByReference,
  getValidAnswerById,
} from 'user-ui/features/selectors';
import { actions } from 'user-ui/features/slice';
import { BlockReference, getDisplayText, getFirstAnswer } from 'user-ui/lib';

type BlockRendererProps = {
  className?: string;
  inputRefs?: MutableRefObject<HTMLInputElement[]>;
  onValidate?: () => boolean;
  onKeyPress: ReactEventHandler;
  onClick?: ReactEventHandler;
  blockRef: BlockReference | undefined;
};

const BlockRenderer: FC<BlockRendererProps> = props => {
  const { className, blockRef, inputRefs, onValidate, onKeyPress, onClick } =
    props;
  const block = useSelector(state => getBlockByReference(state, blockRef));
  const answers = useSelector(state =>
    getValidAnswerById(state, blockRef?.blockId),
  );
  const dispatch = useDispatch();

  const changeHandler: AnswerChangeHandler = useCallback(
    newAnswerValues => {
      const { componentId, selectedOptionId, value } = newAnswerValues;
      if (!blockRef) {
        return;
      }
      const { botId, blockId } = blockRef;

      const displayText = getDisplayText(block, newAnswerValues);
      const currentFirstAnswer = getFirstAnswer(answers);
      const answer: AnswerValue = {
        botId,
        blockId,
        componentId,
        selectedOptionId,
        value,
        displayText,
      };

      if (
        block &&
        isApiBlock(block) &&
        value &&
        currentFirstAnswer?.value &&
        currentFirstAnswer?.value !== value
      ) {
        logger.debug('answer value updated, resetting api data', {
          currentAnswer: currentFirstAnswer?.value,
          newAnswer: value,
        });

        dispatch(actions.apiReset({ blockRef }));
      }

      dispatch(actions.updateAnswer(answer));
    },
    [answers, block, blockRef, dispatch],
  );

  if (!block) {
    return null;
  }

  let BlockComponent: FC<BlockProps>;

  switch (block.type) {
    case BlockTypes.List:
      BlockComponent = ListBlock;
      break;
    case BlockTypes.API:
    case BlockTypes.Text:
      BlockComponent = TextBlock;
      break;
    case BlockTypes.Presentation:
    case BlockTypes.GDPR:
      BlockComponent = EmptyBlock;
      break;
    default:
      BlockComponent = function NotImplementedYet() {
        return <div>{block.type} block not implemented yet.</div>;
      };
  }

  return (
    <BlockComponent
      blockRef={blockRef}
      className={className}
      onChange={changeHandler}
      inputRefs={inputRefs}
      onValidate={onValidate}
      onKeyPress={onKeyPress}
      onClick={onClick}
    />
  );
};

export default BlockRenderer;

export type BlockProps = {
  blockRef: BlockReference | undefined;
  className?: string;
  inputRefs?: MutableRefObject<HTMLInputElement[]>;
  onChange: AnswerChangeHandler;
  onValidate?: () => boolean;
  onKeyPress: ReactEventHandler;
  onClick?: ReactEventHandler;
  key?: string | number;
};

function EmptyBlock() {
  return <></>;
}
