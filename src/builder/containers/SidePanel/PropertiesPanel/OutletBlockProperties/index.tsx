/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { getObjectValues, logger } from 'shared/utils';
import { useModuleContext } from 'shared/context';
import { actions } from 'builder/features/slice';
import { OutletBlockType } from 'shared/types';
import {
  getSelectedBlock,
  getBots,
  getSelectedBotId,
} from 'builder/features/selectors';
import SelectField from 'builder/components/SelectField';
import ResponseButton from 'builder/components/ResponseButton';
import { useStyles } from './styles';

const OutletBlockProperties: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { emitter } = useModuleContext();
  const selectedBlock = useSelector(getSelectedBlock) as
    | OutletBlockType
    | undefined;

  const bots = useSelector(getBots);
  const selectedBotId = useSelector(getSelectedBotId);
  const botOptions = useMemo(
    () =>
      getObjectValues(bots)
        .map(bot => ({ label: bot.name, value: bot.id }))
        .filter(opt => opt.value !== selectedBotId),
    [bots, selectedBotId],
  );

  const handleChange = useCallback(
    event => {
      const botId = event.target.value;
      if (!selectedBlock) {
        logger.warn(
          'Updating block failed, could not get current selected block.',
        );
        return;
      }

      dispatch(
        actions.updateBlock({
          id: selectedBlock.id,
          nextBotId: botId,
        } as OutletBlockType),
      );
    },
    [dispatch, selectedBlock],
  );

  return (
    <div className={clsx(classes.panelSection)}>
      <div className={classes.panelTitle}>Outlet to bot</div>
      <SelectField
        emptyLabel={'No bot selected'}
        value={selectedBlock?.nextBotId}
        options={botOptions}
        onOptionChange={handleChange}
      />
      <div className={classes.actionButtons}>
        <ResponseButton
          onClick={() => emitter.emit('chapterAddClicked')}
          buttonVariant={'add'}
          label={'+ Child bot'}
          fullWidth
        />
      </div>
    </div>
  );
};

export default OutletBlockProperties;
