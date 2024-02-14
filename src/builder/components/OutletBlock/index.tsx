/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import {
  PortalExitIcon,
  ProjectDiagramIcon,
  UserRobotIcon,
} from 'shared/icons';
import DiagramBlock from 'builder/components/DiagramBlock';
import { getBlockById, getBotById } from 'builder/features/selectors';
import { BlockTypes, OutletBlockType } from 'shared/types';
import ChapterButton from '../ChapterButton';
import { useStyles } from './styles';

export interface OutletBlockProps {
  id: string;
  isConnectable: boolean;
  selected: boolean;
  type: BlockTypes;
}

const propsAreEqual = (prevProps, nextProps) => {
  return prevProps.selected === nextProps.selected;
};

const OutletBlock: FC<OutletBlockProps> = memo(props => {
  const classes = useStyles(props);

  const { selected, id } = props;
  const block = useSelector(state => getBlockById(state, id)) as
    | OutletBlockType
    | undefined;

  const nextBot = useSelector(state => getBotById(state, block?.nextBotId));

  if (!block) {
    return null;
  }

  const { title } = block;

  const chapterIcon =
    nextBot?.type === 'side' ? <ProjectDiagramIcon /> : <UserRobotIcon />;

  return (
    <DiagramBlock
      title={title}
      blockId={id}
      selected={selected}
      headerClass={classes.header}
      icon={<PortalExitIcon />}
    >
      <div className={classes.blockContent}>
        <span>To: </span>
        <ChapterButton
          className={classes.chapterBtn}
          title={nextBot?.name || 'No bot selected'}
          icon={nextBot?.type && chapterIcon}
        />
      </div>
    </DiagramBlock>
  );
}, propsAreEqual);

OutletBlock.displayName = 'OutletBlock';

export default OutletBlock;
