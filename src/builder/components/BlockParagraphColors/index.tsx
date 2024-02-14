/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import clsx from 'clsx';
import React, { FC } from 'react';
import { Block } from 'shared/types';
import { ParagraphRtlIcon } from 'shared/icons';
import { useBlockParagraphs } from 'builder/hooks';
import ParagraphColors from 'builder/components/ParagraphColors';
import { useStyles } from './styles';

export interface BlockParagraphsColorsProps {
  className?: string;
  block?: Block;
}

const BlockParagraphColors: FC<BlockParagraphsColorsProps> = props => {
  const { className, block } = props;
  const classes = useStyles();
  const [paragraphs] = useBlockParagraphs(block);

  return (
    <div className={clsx(className, classes.paragraphColor)}>
      {paragraphs && paragraphs.length > 0 ? (
        <>
          <ParagraphRtlIcon flipX />
          <ParagraphColors variant={'bar'} paragraphs={paragraphs} />
        </>
      ) : null}
    </div>
  );
};

export default BlockParagraphColors;
