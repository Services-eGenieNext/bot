/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import clsx from 'clsx';
import { ParagraphBinding } from 'shared/types';
import { useModuleContext } from 'shared/context';
import { useStyles } from './styles';

interface ParagraphColorProps {
  variant: 'dot' | 'bar';
  paragraphs?: ParagraphBinding[];
}

const ParagraphColors: FC<ParagraphColorProps> = props => {
  const { variant = 'bar', paragraphs } = props;
  const classes = useStyles();
  const { emitter } = useModuleContext();

  const indicatorVariants: {
    [key in ParagraphColorProps['variant']]: string;
  } = {
    bar: classes.indicatorBar,
    dot: classes.indicatorDot,
  };

  return (
    <>
      {paragraphs?.map(({ id, title, color }, index) => (
        <span
          key={index}
          title={title}
          className={clsx(classes.indicator, indicatorVariants[variant])}
          style={{ backgroundColor: color }}
          role={'presentation'}
          onClick={() => emitter.emit('paragraphClicked', { id, title, color })}
        />
      ))}
    </>
  );
};

export default ParagraphColors;
