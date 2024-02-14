/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
import { logger } from 'shared/utils';
import { ExclamationSquareIcon } from 'shared/icons';
import { actions } from 'builder/features/slice';
import InputField from 'builder/components/InputField';
import { getSelectedOption } from 'builder/features/selection/selectors';
import { Inputs } from 'builder/lib/validation';
import { useStyles } from '../styles';

const OptionProperties: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const option = useSelector(getSelectedOption);

  const handleChange = useCallback(
    event => {
      const { name, value } = event.target;
      switch (name) {
        case Inputs.Title:
        case Inputs.Hint:
        case Inputs.Value:
          dispatch(actions.updateSelectedOption({ [name]: value }));
          break;
        default:
          logger.warn(`Option change handler for (${name}) is not implemented`);
      }
    },
    [dispatch],
  );

  if (!option) {
    return null;
  }

  return (
    <Grid
      container
      alignContent={'space-between'}
      direction={'row'}
      className={classes.panelGridContainer}
    >
      <Grid item xs={12}>
        <div className={classes.panelSection}>
          <div className={classes.panelTitleBold}>Response option</div>
          <div className={classes.inputFields}>
            <InputField
              name={Inputs.Title}
              label={'Label'}
              placeholder={'Option Button Label'}
              value={option.title ?? ''}
              onChange={handleChange}
            />
            <InputField
              name={Inputs.Hint}
              label={'Hint warning'}
              placeholder={'No hint warning selected'}
              value={option.hint ?? ''}
              onChange={handleChange}
              icon={<ExclamationSquareIcon />}
            />
            <InputField
              name={Inputs.Value}
              label={'Variable Value'}
              placeholder={'No variable value'}
              value={option.value ?? ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.deleteButton}>
        <Button
          variant={'text'}
          className={classes.deleteButton}
          onClick={() => {
            if (window.confirm(`Delete option ${option.title}?`)) {
              dispatch(actions.deleteSelectedOption());
            }
          }}
        >
          Delete Option
        </Button>
      </Grid>
    </Grid>
  );
};

export default OptionProperties;
