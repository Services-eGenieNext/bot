/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { APIBlockType, ApiTemplate } from 'shared/types';
import InputField from 'builder/components/InputField';
import RichEditorOutlined from 'builder/components/RichEditorOutlined';
import { actions } from 'builder/features/slice';
import { useStyles } from '../../styles';

type APISettingsProps = {
  block: APIBlockType;
  apiTemplate?: Partial<ApiTemplate>;
};

const APISettings: FC<APISettingsProps> = props => {
  const { block, apiTemplate } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleChange = useCallback(
    event => {
      const { name, value } = event.target;
      dispatch(actions.updateApi({ [name]: value }));
    },
    [dispatch],
  );

  const endpointDisabled = apiTemplate
    ? !apiTemplate.endpoint?.editable
    : false;
  const payloadDisabled = apiTemplate ? !apiTemplate.payload?.editable : false;

  return (
    <div className={classes.panelSection}>
      <div className={classes.inputLabel}>API Endpoint</div>
      <InputField
        name={'endpoint'}
        placeholder={'https://api.lawly.io'}
        value={block.api.endpoint}
        onChange={handleChange}
        disabled={endpointDisabled}
      />
      <div className={classes.inputLabel}>JSON Payload</div>
      <RichEditorOutlined
        plainEditor
        name={'payload'}
        initialContent={block.api.payload}
        onChange={handleChange}
        rowsMax={10}
        readonly={payloadDisabled}
      />
    </div>
  );
};

APISettings.displayName = 'APISettings';
export default APISettings;
