/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
import { logger } from 'shared/utils';
import { PollPeopleIcon } from 'shared/icons';
import { actions } from 'builder/features/slice';
import {
  getSelectedBlock,
  getSelectedResponse,
} from 'builder/features/selection/selectors';
import InputField from 'builder/components/InputField';
import ResponseButton from 'builder/components/ResponseButton';
import { Inputs } from 'builder/lib/validation';
import { useStyles } from '../styles';

const PredefinedResponsePanel: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const block = useSelector(getSelectedBlock);
  const response = useSelector(getSelectedResponse);

  const handleChange = useCallback(
    event => {
      const { name, value } = event.target;
      switch (name) {
        case Inputs.Title:
        case Inputs.Hint:
        case Inputs.Value:
          dispatch(actions.updateSelectedResponseProps({ [name]: value }));
          break;
        default:
          logger.warn(`change handler for (${name}) is not implemented`);
      }
    },
    [dispatch],
  );

  if (!response) {
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
          <div className={classes.panelTitleBold}>Response predefined</div>
          <div className={classes.inputFields}>
            <InputField
              name={Inputs.Title}
              label={'Title'}
              placeholder={'No title ...'}
              value={response.props?.title ?? ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={classes.panelSection}>
          <div className={classes.panelTitleBold}>
            <PollPeopleIcon size={'1.20em'} className={classes.titleIcon} />
            Options
          </div>
          {response.props?.options?.map((option, index) => (
            <>
              <ResponseButton
                className={classes.focusable}
                label={option.title || `Option ${index + 1}`}
                key={index}
                onClick={() => {
                  dispatch(
                    actions.setSelectedToOption({
                      blockId: block?.id,
                      componentId: response.id,
                      optionId: option.id,
                    }),
                  );
                }}
              />
            </>
          ))}

          <ResponseButton
            label={'Add'}
            buttonVariant={'add'}
            onClick={() => dispatch(actions.addNewResponseOption(response.id))}
          />
        </div>
      </Grid>
      <Grid item xs={12} className={classes.deleteButton}>
        <Button
          variant={'text'}
          className={classes.deleteButton}
          onClick={() => {
            if (window.confirm(`Delete response?`)) {
              dispatch(actions.deleteSelectedResponse());
            }
          }}
        >
          Delete Response
        </Button>
      </Grid>
    </Grid>
  );
};

export default PredefinedResponsePanel;
