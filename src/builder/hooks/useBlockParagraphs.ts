/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useMemo } from 'react';
import { Block, ParagraphBinding } from 'shared/types';

export const useBlockParagraphs = (block?: Block) => {
  // todo: fix this
  const paragraphs: ParagraphBinding[] = useMemo(() => {
    const responses = block?.components ?? [];
    const responseParagraphs: ParagraphBinding[] = responses
      .flatMap(res => res.props?.options)
      .flatMap(opt => opt?.paragraphs ?? []);

    const blockParagraphs = block?.paragraphs ?? [];
    return [...blockParagraphs, ...responseParagraphs];
  }, [block?.paragraphs, block?.components]);

  return [paragraphs];
};
