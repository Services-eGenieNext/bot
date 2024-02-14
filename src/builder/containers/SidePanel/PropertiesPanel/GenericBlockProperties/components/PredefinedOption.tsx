/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';
import { ComponentType, PredefinedOptions } from 'shared/types';
import { ScrubberIcon } from 'shared/icons';
import ResponseButton from 'builder/components/ResponseButton';
import Toggle from 'builder/components/Toggle';
import { actions } from 'builder/features/slice';
import { useStyles } from '../../styles';
import useHandleInputChange from '../hooks/useHandleInputChange';
import { OptionsProps } from './SingleResponseProperties';

const PredefinedOption: FC<OptionsProps> = props => {
  const { block, readOnly } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleChange = useHandleInputChange(block);
  const responses = block.components;
  const response = responses && responses[0];
  const isPredefinedComponent = response?.type === ComponentType.Predefined;

  const responseOptions: PredefinedOptions[] = get(
    responses,
    '[0].props.options',
    [],
  );

  const handleOptionClicked = useCallback(
    optionId => {
      if (!response?.id || !optionId) {
        return;
      }
      dispatch(
        actions.setSelectedToOption({
          blockId: block.id,
          componentId: response!.id,
          optionId: optionId,
        }),
      );
    },
    [block.id, dispatch, response],
  );

  const icon = useMemo(
    () => <ScrubberIcon revertColors secondaryColor={'white'} />,
    [],
  );

  return (
    <>
      <Toggle
        name={'enablePredefined'}
        labelText={'Predefined options'}
        icon={icon}
        onChange={handleChange}
        checked={isPredefinedComponent}
        disabled={readOnly}
      />
      {isPredefinedComponent && (
        <div className={classes.optionsContainer}>
          {responseOptions.map((option, index) => (
            <ResponseButton
              key={index}
              label={option.title || `Option ${index + 1}`}
              onClick={() => handleOptionClicked(option.id)}
            />
          ))}
          <ResponseButton
            buttonVariant={'add'}
            label={'Add'}
            onClick={() => dispatch(actions.addNewResponseOption(response?.id))}
          />
        </div>
      )}
    </>
  );
};

export default PredefinedOption;
