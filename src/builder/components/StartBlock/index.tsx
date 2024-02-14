/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, memo } from 'react';
import { BlockTypes } from 'shared/types';
import { PlayCircleIcon } from 'shared/icons';
import WaypointBlock from '../WaypointBlock';

export interface StartBlockProps {
  id: string;
  type: BlockTypes;
  selected: boolean;
}

const StartBlock: FC<StartBlockProps> = memo(props => {
  return (
    <WaypointBlock
      icon={
        <PlayCircleIcon
          secondaryOpacity={0}
          primaryColor={'white'}
          size={'3em'}
        />
      }
      title={'Conversation Start'}
      {...props}
    />
  );
});

StartBlock.displayName = 'StartBlock';
export default StartBlock;
