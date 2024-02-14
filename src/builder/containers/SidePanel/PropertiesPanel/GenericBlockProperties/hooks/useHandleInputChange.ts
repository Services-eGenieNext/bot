/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Block, ComponentType } from 'shared/types';
import { actions } from 'builder/features/slice';

const useHandleInputChange = (block: Block) => {
  const dispatch = useDispatch();

  const handleChange: HandleChange = useCallback(
    event => {
      if (!block) {
        return;
      }
      const { name, checked } = event.target;
      if (!checked) {
        dispatch(
          actions.updateSelectedResponse({
            type: ComponentType.None,
          }),
        );
        return;
      }

      switch (name) {
        case 'enablePredefined':
          dispatch(
            actions.updateSelectedResponse({
              type: ComponentType.Predefined,
            }),
          );
          break;
        case 'enableFreeSpeech':
          dispatch(
            actions.updateSelectedResponse({
              type: ComponentType.FreeSpeech,
            }),
          );
          break;
      }
    },
    [block, dispatch],
  );
  return handleChange;
};

type HandleChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  checked: boolean,
) => void;

export default useHandleInputChange;
