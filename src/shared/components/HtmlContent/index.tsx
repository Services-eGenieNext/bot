/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import DOMPurify from 'dompurify';

type HtmlContentProps = JSX.IntrinsicElements['div'] & {
  content: string;
};

const HtmlContent: FC<HtmlContentProps> = ({ content, ...props }) => {
  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content, { ADD_ATTR: ['target'] }),
      }}
    />
  );
};

export default HtmlContent;
