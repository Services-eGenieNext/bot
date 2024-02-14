import clsx from 'clsx';
import React, { FC } from 'react';
import { InfoCircleIcon } from 'shared/icons';
import { Block } from 'shared/types';
import { getReadMoreExcerpt } from 'shared/utils/blocks';
import ReadMoreModal from 'user-ui/components/ReadMoreModal';
import classes from 'user-ui/containers/QuestionCard/styles.module.scss';

const ReadMoreSection: FC<{ block: Block; minified?: Boolean }> = ({
  block,
  minified,
}) => {
  const readMore = block.readMore!;

  if (!readMore || !readMore.enabled || !readMore.excerpt?.trim()) {
    return null;
  }

  const excerpt = getReadMoreExcerpt(block);

  const containerClassNames = [classes.readMoreSection];
  if (minified) containerClassNames.push(classes.minified);

  return (
    <ReadMoreModal htmlContent={readMore.text ?? ''}>
      <div className={clsx(containerClassNames)}>
        {!minified && (
          <div className={classes.icon}>
            <InfoCircleIcon />
          </div>
        )}
        <div className={classes.excerptContainer}>
          <div className={classes.excerpt}>{excerpt}</div>
          <div className={classes.actionLink}>
            {readMore.label || 'Läs mer här'} →
          </div>
        </div>
      </div>
    </ReadMoreModal>
  );
};

export default ReadMoreSection;
