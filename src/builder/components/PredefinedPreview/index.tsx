/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { PollPeopleIcon } from 'shared/icons';
import { ResponseComponent } from 'shared/types';
import { actions } from 'builder/features/slice';
import ResponseButton from '../ResponseButton';
import ResponsePreview from '../ResponsePreview';
import styles from './styles';

export type PredefinedPreviewProps = {
  blockId: string;
  response: ResponseComponent;
  className?: string;
};

const useStyles = makeStyles(styles);

const PredefinedPreview: React.FC<PredefinedPreviewProps> = memo(props => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const { blockId, response, className } = props;

  const handleClick = useCallback(() => {
    if (response.id) {
      dispatch(actions.setSelectedToResponse(response.id));
    }
  }, [dispatch, response.id]);

  const pollIcon = useMemo(() => <PollPeopleIcon />, []);

  const hint = response.props?.options?.map(opt => opt.title).join(' / ');
  return (
    <div className={clsx(className, classes.predefinedPreview)}>
      <ResponsePreview
        hint={hint}
        title={'Choose an option?'}
        startIcon={pollIcon}
        onClick={handleClick}
        fullwidth
      />
      <div className={classes.resOptionsContainer}>
        {response.props?.options?.map((option, index) => (
          <ResponseButton
            label={option.title || `Option ${index + 1}`}
            key={index}
            fullWidth
            onClick={() => {
              dispatch(
                actions.setSelectedToOption({
                  blockId,
                  componentId: response.id,
                  optionId: option.id,
                }),
              );
            }}
          />
        ))}
      </div>

      <button
        className={classes.addOptButton}
        onClick={() => dispatch(actions.addNewResponseOption(response.id))}
      >
        + Add
      </button>
    </div>
  );
});

PredefinedPreview.displayName = 'PredefinedPreview';
export default PredefinedPreview;
