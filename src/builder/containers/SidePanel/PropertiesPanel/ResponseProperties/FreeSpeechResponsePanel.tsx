/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  RadioProps,
} from '@material-ui/core';
import ValidationConfigInput from 'builder/containers/SidePanel/PropertiesPanel/ResponseProperties/ValidationConfigInput';
import { SpellCheckIcon } from 'shared/icons';
import { logger } from 'shared/utils';
import { actions } from 'builder/features/slice';
import InputField from 'builder/components/InputField';
import { getSelectedResponse } from 'builder/features/selection/selectors';
import {
  getValidationLabel,
  Inputs,
  validations,
} from 'builder/lib/validation';
import { useStyles } from '../styles';

const FreeSpeechResponsePanel: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const response = useSelector(getSelectedResponse);
  const pattern = response?.props?.validation?.pattern;

  const handleChange = useCallback(
    event => {
      const { name, value } = event.target;
      switch (name) {
        case Inputs.Title:
        case Inputs.Hint:
          dispatch(actions.updateSelectedResponseProps({ [name]: value }));
          break;
        case Inputs.Validation:
          dispatch(
            actions.updateSelectedResponseProps({
              validation: {
                type: value,
                pattern,
              },
            }),
          );
          break;
        case Inputs.Pattern:
          dispatch(
            actions.updateSelectedResponseProps({
              validation: {
                type: 'pattern',
                pattern: value,
              },
            }),
          );
          break;
        case Inputs.SettlementVariable:
          dispatch(
            actions.updateSelectedResponseProps({
              validation: {
                type: 'settlement',
                settlementVariable: value,
              },
            }),
          );
          break;
        default:
          logger.warn(`Option change handler for (${name}) is not implemented`);
      }
    },
    [dispatch, pattern],
  );

  const radioProps: RadioProps = {
    color: 'primary',
    size: 'small',
    disableRipple: true,
    disableFocusRipple: true,
    disableTouchRipple: true,
  };

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
          <div className={classes.panelTitleBold}>Response Free Text</div>
          <div className={classes.inputFields}>
            <InputField
              name={Inputs.Title}
              label={'Label'}
              placeholder={'No Label ...'}
              value={response.props?.title ?? ''}
              onChange={handleChange}
            />
            <InputField
              name={Inputs.Hint}
              label={'Placeholder'}
              placeholder={'No placeholder...'}
              value={response.props?.hint ?? ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={classes.panelSection}>
          <div className={classes.panelTitleBold}>
            <SpellCheckIcon size={'1.20em'} className={classes.titleIcon} />
            Response validation
          </div>
          <RadioGroup
            className={classes.validationControls}
            aria-label="validation"
            name={Inputs.Validation}
            value={response.props?.validation?.type || 'anything'}
            onChange={handleChange}
          >
            {validations.map((validationType, index) => (
              <>
                <FormControlLabel
                  key={index}
                  value={validationType}
                  label={getValidationLabel(validationType)}
                  control={<Radio {...radioProps} />}
                />
                {response.props?.validation?.type === validationType && (
                  <ValidationConfigInput
                    validation={response.props.validation}
                    onChange={handleChange}
                  />
                )}
              </>
            ))}
          </RadioGroup>
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

export default FreeSpeechResponsePanel;
