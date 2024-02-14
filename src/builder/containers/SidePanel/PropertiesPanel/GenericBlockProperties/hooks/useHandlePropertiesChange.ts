/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Block, TextBlockType } from 'shared/types';
import { logger } from 'shared/utils';
import { actions } from 'builder/features/slice';

const useHandleChange = (selectedBlock?: Block) => {
  const dispatch = useDispatch();
  return useCallback(
    event => {
      if (!selectedBlock) {
        return;
      }
      const { name, value, checked } = event.target;
      switch (name) {
        case 'blockTitle':
          dispatch(
            actions.updateBlock({
              id: selectedBlock.id,
              title: value,
            } as TextBlockType),
          );
          break;
        case 'enableReadMore':
          dispatch(
            actions.updateBlock({
              id: selectedBlock.id,
              readMore: {
                ...(selectedBlock.readMore ?? {}),
                enabled: checked,
              },
            } as TextBlockType),
          );
          break;
        case 'setRequired':
          dispatch(
            actions.updateBlock({
              id: selectedBlock.id,
              required: checked,
            } as TextBlockType),
          );
          break;
        case 'templateChanged':
          dispatch(actions.setApiTemplate(value));
          break;
        default:
          logger.warn(
            `there is no on-change handler for property name ${name}`,
          );
      }
    },
    [dispatch, selectedBlock],
  );
};

export default useHandleChange;
