/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { logger } from 'shared/utils';
import { actions } from 'builder/features/slice';
import { ConditionBlockType, ConditionOperator } from 'shared/types';
import { getSelectedBlock } from 'builder/features/selectors';
import SelectField from 'builder/components/SelectField';
import InputField from 'builder/components/InputField';
import InputWithVariable from 'builder/components/InputWithVariable';
import { useStyles } from './styles';

const ConditionBlockProperties: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedBlock = useSelector(getSelectedBlock) as
    | ConditionBlockType
    | undefined;

  const operatorOptions = useMemo(() => {
    const getLabel = (opKey: string) => {
      return {
        [ConditionOperator.EXIST]: 'exist',
        [ConditionOperator.EQUAL]: 'equal (==)',
        [ConditionOperator.NOT_EQUAL]: 'not equal (!=)',
        [ConditionOperator.GREATER]: 'greater (>)',
        [ConditionOperator.GREATER_EQUAL]: 'greater or equal (>=)',
        [ConditionOperator.LESS]: 'less (<)',
        [ConditionOperator.LESS_EQUAL]: 'less or equal (<=)',
      }[opKey];
    };
    return Object.keys(ConditionOperator).map(x => ({
      label: getLabel(ConditionOperator[x]),
      value: ConditionOperator[x],
    }));
  }, []);

  const handleChange = event => {
    if (!selectedBlock) {
      logger.warn(
        'Updating block failed, could not get current selected block.',
      );
      return;
    }

    const { name, value } = event.target;
    const blockUpdate: Partial<ConditionBlockType> = { id: selectedBlock.id };
    switch (name) {
      case 'blockTitle':
        blockUpdate.title = value;
        break;
      case 'valueLeft':
        blockUpdate.valueLeft = value;
        break;
      case 'valueRight':
        blockUpdate.valueRight = value;
        break;
      case 'operator':
        blockUpdate.operator = value;
        break;
    }
    dispatch(actions.updateBlock(blockUpdate));
  };

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
        <div className={classes.panelTitle}>If (Empty = Previous response)</div>
        <div className={classes.fields}>
          <InputWithVariable
            name={'valueLeft'}
            placeholder={'Key'}
            value={selectedBlock.valueLeft}
            onChange={handleChange}
          />
          <SelectField
            name={'operator'}
            onOptionChange={handleChange}
            options={operatorOptions}
            value={selectedBlock.operator}
          />
          <InputWithVariable
            name={'valueRight'}
            placeholder={'Value'}
            value={selectedBlock.valueRight}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default ConditionBlockProperties;
