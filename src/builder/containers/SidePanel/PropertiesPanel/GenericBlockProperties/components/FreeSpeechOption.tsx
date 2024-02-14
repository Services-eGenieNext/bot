/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { TypewriterIcon } from 'shared/icons';
import { ComponentType } from 'shared/types';
import FreeSpeechPreview from 'builder/components/FreeSpeechPreview';
import Toggle from 'builder/components/Toggle';
import { useStyles } from '../../styles';
import useHandleInputChange from '../hooks/useHandleInputChange';
import { OptionsProps } from './SingleResponseProperties';

const FreeSpeechOption: FC<OptionsProps> = props => {
  const { block, readOnly } = props;
  const classes = useStyles();
  const handleChange = useHandleInputChange(block);

  const responses = block.components;
  const response = responses && responses[0];
  const isFreeSpeechComponent = response?.type === ComponentType.FreeSpeech;

  return (
    <>
      <Toggle
        name={'enableFreeSpeech'}
        labelText={'Free speech'}
        icon={<TypewriterIcon />}
        onChange={handleChange}
        checked={isFreeSpeechComponent}
        disabled={readOnly}
      />
      {response && isFreeSpeechComponent && (
        <div className={classes.optionsContainer}>
          <FreeSpeechPreview response={response} clickable />
        </div>
      )}
    </>
  );
};

export default FreeSpeechOption;
