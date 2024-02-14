/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { EventHandler } from 'react';
import clsx from 'clsx';
import { useStyles } from './styles';

export type TextPreviewProps = {
  text?: string;
  lines?: number;
  onClick?: EventHandler<any>;
  className?: string;
};

const TextPreview: React.FC<TextPreviewProps> = props => {
  const classes = useStyles(props);
  const { text, onClick, className } = props;

  const plainText = text?.replace(/<[^>]*>/g, '');

  return (
    <div
      className={clsx(className, classes.textPreviewContainer)}
      role={'presentation'}
      tabIndex={0}
      onClick={onClick}
    >
      <div className={classes.textOverlay} />
      <div className={classes.textContent}>
        {plainText ? (
          plainText
        ) : (
          <div className={classes.placeholder}>No content added...</div>
        )}
      </div>
    </div>
  );
};

export default TextPreview;
