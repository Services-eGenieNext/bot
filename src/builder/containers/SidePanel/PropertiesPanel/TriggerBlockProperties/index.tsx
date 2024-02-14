/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { logger } from 'shared/utils';
import InputField from 'builder/components/InputField';
import SelectField from 'builder/components/SelectField';
import VariableInput from 'builder/components/VariableInput';
import { getSelectedBlock } from 'builder/features/selectors';
import { actions } from 'builder/features/slice';
import { Action, TriggerBlockType } from 'shared/types';
import InputWithVariable from 'builder/components/InputWithVariable';
import { useStyles } from './styles';

const ConditionBlockProperties: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedBlock = useSelector(getSelectedBlock) as
    | TriggerBlockType
    | undefined;

  const handleChange = useCallback(
    event => {
      if (!selectedBlock) {
        logger.warn(
          'Updating block failed, could not get current selected block.',
        );
        return;
      }

      const { name, value } = event.target;
      const blockUpdate: Partial<TriggerBlockType> = { id: selectedBlock.id };
      switch (name) {
        case 'blockTitle':
          blockUpdate.title = value;
          break;
        case 'action':
          blockUpdate.action = value;
          break;
        case 'variable':
          blockUpdate.variable = value;
          break;
        case 'value':
          blockUpdate.value = value;
          break;
        default:
          logger.warn(
            `Change handler for ${name} is not implemented in trigger block properties`,
          );
      }
      dispatch(actions.updateBlock(blockUpdate));
    },
    [dispatch, selectedBlock],
  );

  if (!selectedBlock) {
    return null;
  }

  return (
    <>
      <div className={clsx(classes.panelSection)}>
        <InputField
          name={'blockTitle'}
          label={'Block Name'}
          placeholder={'Block Title'}
          value={selectedBlock.title}
          onChange={handleChange}
        />
      </div>
      <div className={clsx(classes.panelSection)}>
        <div className={classes.fields}>
          <SelectField
            name={'action'}
            label={'Action'}
            value={selectedBlock.action || Action.SET_VARIABLE}
            onOptionChange={handleChange}
            options={[
              { label: 'Set variable', value: Action.SET_VARIABLE },
              { label: 'Set user variable', value: Action.SET_USER_VARIABLE },
            ]}
          />
          <VariableInput
            namespace={
              selectedBlock.action === Action.SET_USER_VARIABLE ? 'user' : ''
            }
            name={'variable'}
            label={'Variable'}
            value={selectedBlock.variable}
            onChange={handleChange}
          />
          <InputWithVariable
            name={'value'}
            label={'Value'}
            placeholder={'Empty = value from previous block'}
            value={selectedBlock.value}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default ConditionBlockProperties;
