/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import clsx from 'clsx';
import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RichEditorOutlined from 'builder/components/RichEditorOutlined';
import { getSelectedBlock } from 'builder/features/selectors';
import { actions } from 'builder/features/slice';
import { TextBlockType } from 'shared/types';
import { logger } from 'shared/utils';
import { useStyles } from '../styles';

const TextMessageProperties: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedBlock = useSelector(getSelectedBlock);
  const selectedTextBlock = selectedBlock as TextBlockType | undefined;

  const handleChange = useCallback(
    event => {
      if (!selectedBlock) {
        logger.warn(
          'Updating block failed, could not get current selected block.',
        );
        return;
      }
      const { value } = event.target;
      dispatch(
        actions.updateBlock({
          id: selectedBlock.id,
          text: value,
        } as TextBlockType),
      );
    },
    [dispatch, selectedBlock],
  );

  return (
    <div className={clsx(classes.panelSection, classes.editor)}>
      <div className={classes.panelTitleBold}>Text message</div>
      <RichEditorOutlined
        withVariablesMenu
        name={'textMessage'}
        placeholder={'Add text message ...'}
        initialContent={selectedTextBlock?.text}
        onChange={handleChange}
      />
    </div>
  );
};

export default TextMessageProperties;
