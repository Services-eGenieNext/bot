/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import last from 'lodash/last';
import { PlusIcon, TimesIcon } from 'shared/icons';
import { getAnswerById } from 'user-ui/features/answers/selectors';
import { getBlockByReference } from 'user-ui/features/bots/selectors';
import { actions } from 'user-ui/features/slice';
import { BlockProps } from 'user-ui/containers/BlockRenderer';
import { useLocales } from 'shared/hooks';
import MultipleInput from '../MultipleInput';
import ActionButton from '../ActionButton';
import ListAnswersPreview from '../ListAnswerPreview';
import classes from './styles.module.scss';

const ListBlock: FC<BlockProps> = props => {
  const {
    className,
    blockRef,
    onChange,
    inputRefs,
    onValidate,
    onKeyPress,
    onClick,
  } = props;
  const block = useSelector(state => getBlockByReference(state, blockRef));
  const currentAnswers = useSelector(state =>
    getAnswerById(state, blockRef?.blockId),
  );
  const dispatch = useDispatch();
  const { translate } = useLocales();

  const addNewAnswer = useCallback(() => {
    const blockId = block?.id;
    const valid = onValidate ? onValidate() : true;

    if (!valid || !blockId) {
      return;
    }

    dispatch(
      actions.addNewAnswer({
        blockId,
      }),
    );
  }, [block?.id, dispatch, onValidate]);

  const deleteAnswer = useCallback(() => {
    const blockId = block?.id;
    if (!blockId) {
      return;
    }

    dispatch(
      actions.deleteAnswer({
        blockId,
      }),
    );
  }, [block?.id, dispatch]);

  const lastAnswer = last(currentAnswers);

  const checkInputsValidity = () =>
    !!inputRefs?.current.every(t => t.checkValidity());

  if (!block) {
    return null;
  }

  return (
    <>
      {currentAnswers && (
        <ListAnswersPreview
          block={block}
          answers={currentAnswers}
          onCheckValidity={checkInputsValidity}
        />
      )}
      <MultipleInput
        className={className}
        block={block}
        onChange={onChange}
        answer={lastAnswer}
        required={block.required}
        ref={inputRefs}
        onKeyPress={onKeyPress}
        onClick={onClick}
      />
      <div className={classes.buttonsContainer}>
        {currentAnswers && currentAnswers.length > 1 && (
          <ActionButton
            className={'btn-add'}
            title={translate('buttons.remove')}
            //colorVariant={'red'}
            variant={'danger'}
            onClick={deleteAnswer}
            icon={<TimesIcon />}
            fullWidth
          />
        )}
        <ActionButton
          className={'btn-remove'}
          title={translate('buttons.add')}
          //colorVariant={'green'}
          variant={'success'}
          onClick={addNewAnswer}
          icon={<PlusIcon />}
          fullWidth
        />
      </div>
    </>
  );
};

export default ListBlock;
