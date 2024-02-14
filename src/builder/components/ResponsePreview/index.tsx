/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { memo } from 'react';
import clsx from 'clsx';
import { Button, ButtonProps } from '@material-ui/core';
import { useStyles } from './styles';

export type ResponsePreviewProps = {
  title?: string;
  hint?: string;
  className?: string;
  onClick?: ButtonProps['onClick'];
  startIcon?: ButtonProps['startIcon'];
  fullwidth?: boolean;
};

const ResponsePreview: React.FC<ResponsePreviewProps> = memo(props => {
  const classes = useStyles(props);
  const { title, hint, className, onClick, startIcon } = props;

  return (
    <Button
      startIcon={startIcon}
      variant="outlined"
      size="small"
      className={clsx(classes.button, className)}
      onClick={onClick}
    >
      <div className={classes.responseContent}>
        <div className={classes.responseTitle}>{title || 'No Title'}</div>
        <div className={classes.responsePlaceholder}>
          {hint || 'No Placeholder'}
        </div>
      </div>
    </Button>
  );
});

ResponsePreview.displayName = 'ResponsePreview';
export default ResponsePreview;
