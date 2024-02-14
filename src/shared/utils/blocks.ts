/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Block } from 'shared/types';

export const getReadMoreExcerpt = (block: Block) => {
  const readMore = block.readMore;

  return (
    [readMore?.excerpt, readMore?.text]
      .map(text => text?.replace(/<[^>]*>/g, '').trim())
      .find(x => !!x)
      ?.substr(0, 300) ?? ''
  );
};
