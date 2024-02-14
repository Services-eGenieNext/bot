/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, MouseEventHandler, useCallback, useState } from 'react';
import { useLocales } from 'shared/hooks';
import ActionButton from 'user-ui/components/ActionButton';
import classes from './styles.module.scss';

type OverviewFooterProps = {
  onSubmit: MouseEventHandler;
  disabled?: boolean;
};

const OverviewFooter: FC<OverviewFooterProps> = props => {
  const { translate } = useLocales();

  const { onSubmit, disabled } = props;
  const [loading, setLoading] = useState(false);

  const handleSubmitClicked: MouseEventHandler = useCallback(
    event => {
      setLoading(true);
      onSubmit(event);
      setTimeout(() => setLoading(false), 3000);
    },
    [onSubmit],
  );

  return (
    <div className={classes.overviewFooter}>
      <ActionButton
        className={classes.submitButton}
        colorVariant={'green'}
        title={
          loading
            ? `${translate('buttons.sendReply')} ...`
            : translate('buttons.finish')
        }
        onClick={handleSubmitClicked}
        loading={loading}
        disabled={disabled}
        fullWidth
      />
    </div>
  );
};

export default OverviewFooter;
