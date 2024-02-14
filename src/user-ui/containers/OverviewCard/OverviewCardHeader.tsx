/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import clsx from 'clsx';
import React, { FC } from 'react';
import { CaretLeftIcon, CheckIcon, TimesIcon } from 'shared/icons';
import { useLocales } from 'shared/hooks';
import { OverviewCardProps } from 'user-ui/containers/OverviewCard/index';
import classes from 'user-ui/containers/OverviewCard/styles.module.scss';

export type OverviewCardHeaderProps = OverviewCardProps & {
  chapterHasError: boolean;
  started: boolean;
};

const OverviewCardHeader: FC<OverviewCardHeaderProps> = props => {
  const { translate } = useLocales();

  const {
    chapterBot,
    completed,
    current,
    chapterBased,
    index = 0,
    chapterHasError,
    started,
  } = props;

  const chapterName = chapterBot?.name;
  const chapterTitle = [translate('titles.chapter'), index + 1]
    .filter(t => !!t)
    .join(' ');
  const title = [chapterTitle, chapterName].filter(t => !!t).join(': ');
  const active = completed || current;

  if (!chapterBased) {
    return null;
  }

  return (
    <div className={clsx(classes.overviewCardHeader)}>
      <div
        className={clsx(
          classes.status,
          completed && !chapterHasError
            ? classes.completed
            : started && classes.hasError,
        )}
      >
        {!completed || chapterHasError ? (
          <TimesIcon size={'1.2em'} />
        ) : (
          <CheckIcon />
        )}
      </div>
      <div className={clsx(classes.title, active && classes.active)}>
        {title}
      </div>
      <CaretLeftIcon className={classes.collapsedIcon} />
    </div>
  );
};

export default OverviewCardHeader;
