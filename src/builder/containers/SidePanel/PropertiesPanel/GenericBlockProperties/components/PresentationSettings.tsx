/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocales } from 'shared/hooks';
import { PresentationBlockType } from 'shared/types';
import InputField from 'builder/components/InputField';
import { actions } from 'builder/features/slice';
import { useStyles } from '../../styles';

type PresentationSettingsProps = {
  block: PresentationBlockType;
};

const PresentationSettings: FC<PresentationSettingsProps> = props => {
  const { translate } = useLocales();

  const { block } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleChange = useCallback(
    event => {
      const { name, value } = event.target;
      dispatch(actions.updatePresentation({ [name]: value }));
    },
    [dispatch],
  );

  return (
    <div className={classes.panelSection}>
      <div className={classes.inputLabel}>Video Url</div>
      <InputField
        name={'videoUrl'}
        placeholder={'https://www.youtube.com/watch?v=a--paygY_CU'}
        value={block.configs.videoUrl ?? ''}
        onChange={handleChange}
      />
      <div className={classes.inputLabel}>Button Label</div>
      <InputField
        name={'buttonTitle'}
        placeholder={translate('buttons.next')}
        value={block.configs.buttonTitle ?? ''}
        onChange={handleChange}
      />
    </div>
  );
};

PresentationSettings.displayName = 'PresentationSettings';
export default PresentationSettings;
