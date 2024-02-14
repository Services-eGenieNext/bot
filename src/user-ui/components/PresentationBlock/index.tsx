/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import HtmlContent from 'shared/components/HtmlContent';
import { Block, isPresentationBlock } from 'shared/types';
import classes from 'user-ui/containers/QuestionCard/styles.module.scss';
import { useTextWithVariableValues } from 'user-ui/hooks/useTextWithVariableValues';

const PresentationBlock: FC<{ block: Block }> = props => {
  const { block } = props;
  const presentationText = useTextWithVariableValues(block.text);
  if (!isPresentationBlock(block)) {
    return null;
  }

  const ytVideoMatch = block.configs.videoUrl?.match(
    /youtube.com\/watch\?v=([^&]+)/,
  );

  const ytVideoId = ytVideoMatch && ytVideoMatch[1];

  return (
    <>
      <HtmlContent
        className={classes.presentation}
        content={presentationText}
      />
      {ytVideoId && (
        <iframe
          className={classes.youtubeEmbed}
          title="Youtube Video"
          width="100%"
          src={`https://www.youtube.com/embed/${ytVideoId}?modestbranding=1&rel=0`}
          frameBorder="0"
        />
      )}
    </>
  );
};

export default PresentationBlock;
