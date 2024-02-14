/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import InputField from 'builder/components/InputField';
import { actions } from 'builder/features/slice';
import { getSelectedBlock } from 'builder/features/selectors';
import { TextBlockType } from 'shared/types';
import RichEditorOutlined from 'builder/components/RichEditorOutlined';

import { useStyles } from '../styles';

const ReadMoreProperties: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedBlock = useSelector(getSelectedBlock);
  const selectedTextBlock = selectedBlock as TextBlockType | undefined;

  const handleChange = useCallback(
    event => {
      if (!selectedBlock) {
        return;
      }
      const { value, name } = event.target;
      dispatch(
        actions.updateBlock({
          id: selectedBlock.id,
          readMore: {
            enabled: true,
            [name]: value,
          },
        } as TextBlockType),
      );
    },
    [dispatch, selectedBlock],
  );

  const readMore = selectedTextBlock?.readMore;
  const readMoreContent = readMore?.text;

  return (
    <div className={clsx(classes.panelSection, classes.editor)}>
      <div className={classes.panelTitleBold}>Read more</div>
      <div className={classes.inputLabel}>Label</div>
      <InputField
        name={'label'}
        placeholder={'Read More Label'}
        value={readMore?.label ?? ''}
        onChange={handleChange}
      />

      <div className={classes.inputLabel}>Excerpt</div>
      <RichEditorOutlined
        withVariablesMenu
        plainEditor
        name={'excerpt'}
        placeholder={'Read more excerpt ...'}
        initialContent={readMore?.excerpt ?? ''}
        onChange={handleChange}
      />

      <div className={classes.inputLabel}>Content</div>
      <RichEditorOutlined
        withVariablesMenu
        name={'text'}
        placeholder={'Read more content ...'}
        initialContent={readMoreContent ?? ''}
        onChange={handleChange}
      />
    </div>
  );
};

export default ReadMoreProperties;
