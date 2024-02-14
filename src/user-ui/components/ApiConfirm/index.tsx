/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, ReactEventHandler } from 'react';
import { Button } from 'react-bootstrap';
import { TimesIcon, CheckIcon } from 'shared/icons';
import { useLocales } from 'shared/hooks';
import classes from './styles.module.scss';

export type ApiConfirmProps = {
  lines: string[];
  onReject: ReactEventHandler;
};

const ApiConfirm: FC<ApiConfirmProps> = props => {
  const { translate } = useLocales();

  const { lines, onReject } = props;
  return (
    <div className={classes.apiConfirm}>
      <CheckIcon className={classes.checkIcon} />
      <div className={classes.lines}>
        <div className={classes.line1}>{lines[0]}</div>
        <div className={classes.line2}>{lines[1]}</div>
      </div>
      <Button
        variant={'success'}
        className={classes.rejectBtn}
        onClickCapture={e => {
          onReject(e);
          e.stopPropagation();
        }}
      >
        <TimesIcon /> {translate('buttons.remove')}
      </Button>
    </div>
  );
};

export default ApiConfirm;
