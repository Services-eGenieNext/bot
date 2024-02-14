/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, memo } from 'react';
import { StoreSlashIcon } from 'shared/icons';
import { BlockTypes } from 'shared/types';
import WaypointBlock from '../WaypointBlock';

export interface QuitBlockProps {
  id: string;
  type: BlockTypes;
  selected: boolean;
}

const QuitBlock: FC<QuitBlockProps> = memo(props => {
  return (
    <WaypointBlock
      icon={<StoreSlashIcon size={'1.5em'} style={{ marginTop: 10 }} />}
      title={'Quit'}
      {...props}
    />
  );
});

QuitBlock.displayName = 'QuitBlock';

export default QuitBlock;
