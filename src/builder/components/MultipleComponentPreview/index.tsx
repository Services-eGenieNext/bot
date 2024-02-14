/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import clsx from 'clsx';
import { Block, ResponseComponent, ComponentType } from 'shared/types';
import FreeSpeechPreview from 'builder/components/FreeSpeechPreview';
import PredefinedPreview from 'builder/components/PredefinedPreview';
import { useStyles } from './styles';

type MultipleComponentPreviewProps = {
  className?: string;
  block: Block;
};

const MultipleComponentPreview: FC<MultipleComponentPreviewProps> = props => {
  const { className, block } = props;
  const classes = useStyles();
  return (
    <div className={clsx(className, classes.previewContainer)}>
      {block.components?.map((r, index) => (
        <PreviewComponent key={index} blockId={block.id} component={r} />
      ))}
    </div>
  );
};

type PreviewComponentProps = {
  className?: string;
  blockId: string;
  component: ResponseComponent;
};

const PreviewComponent: FC<PreviewComponentProps> = props => {
  const { className, component, blockId } = props;
  if (component.type === ComponentType.FreeSpeech) {
    return (
      <FreeSpeechPreview
        className={className}
        response={component}
        fullwidth
        clickable
      />
    );
  } else if (component.type === ComponentType.Predefined) {
    return (
      <PredefinedPreview
        className={className}
        blockId={blockId}
        response={component}
      />
    );
  }
  return null;
};

export default MultipleComponentPreview;
