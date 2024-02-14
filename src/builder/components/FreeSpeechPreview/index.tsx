/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { KeyboardIcon } from 'shared/icons';
import { ResponseComponent } from 'shared/types';
import { actions } from 'builder/features/slice';
import ResponsePreview from '../ResponsePreview';

export type FreeSpeechPreviewProps = {
  response: ResponseComponent;
  className?: string;
  clickable?: boolean;
  fullwidth?: boolean;
};

const FreeSpeechPreview: React.FC<FreeSpeechPreviewProps> = memo(props => {
  const { response, clickable, className, fullwidth } = props;
  const { hint, title } = response.props ?? {};
  const id = response.id;
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    if (clickable && id) {
      dispatch(actions.setSelectedToResponse(id));
    }
  }, [clickable, dispatch, id]);

  const keyboardIcon = useMemo(() => <KeyboardIcon />, []);

  return (
    <ResponsePreview
      title={title}
      hint={hint}
      onClick={handleClick}
      className={className}
      startIcon={keyboardIcon}
      fullwidth={fullwidth}
    />
  );
});

FreeSpeechPreview.displayName = 'FreeSpeechPreview';
export default FreeSpeechPreview;
