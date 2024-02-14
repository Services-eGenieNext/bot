/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { getSelectedResponse } from 'builder/features/selectors';
import { ComponentType } from 'shared/types';
import FreeSpeechResponsePanel from './FreeSpeechResponsePanel';
import PredefinedResponsePanel from './PredefinedResponsePanel';

const ResponseProperties: FC = () => {
  const selectedResponse = useSelector(getSelectedResponse);

  const responseType = selectedResponse?.type;

  return (
    <>
      {responseType === ComponentType.FreeSpeech && <FreeSpeechResponsePanel />}
      {responseType === ComponentType.Predefined && <PredefinedResponsePanel />}
    </>
  );
};

export default ResponseProperties;
