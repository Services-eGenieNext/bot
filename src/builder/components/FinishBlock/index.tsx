/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, memo } from 'react';
import { DoorOpenIcon } from 'shared/icons';
import { BlockTypes } from 'shared/types';
import WaypointBlock from '../WaypointBlock';

export interface FinishBlockProps {
  id: string;
  type: BlockTypes;
  selected: boolean;
}

const FinishBlock: FC<FinishBlockProps> = memo(props => {
  return (
    <WaypointBlock
      icon={<DoorOpenIcon size={'1.5em'} style={{ marginTop: 10 }} />}
      title={'Finish'}
      {...props}
    />
  );
});

FinishBlock.displayName = 'FinishBlock';

export default FinishBlock;
