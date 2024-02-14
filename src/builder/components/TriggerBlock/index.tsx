/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { Position } from 'react-flow-renderer';
import BlockParagraphColors from 'builder/components/BlockParagraphColors';
import { GraduationCapIcon } from 'shared/icons';
import { getBlockById } from 'builder/features/selectors';
import { BlockTypes, TriggerBlockType } from 'shared/types';
import DiagramHandle from '../DiagramHandle';
import { useStyles } from './styles';

export interface TriggerBlockProps {
  id: string;
  isConnectable: boolean;
  selected: boolean;
  type: BlockTypes;
}

const propsAreEqual = (prevProps, nextProps) => {
  return prevProps.selected === nextProps.selected;
};

const TriggerBlock: FC<TriggerBlockProps> = memo(props => {
  const classes = useStyles(props);

  const { id } = props;
  const block = useSelector(state => getBlockById(state, id)) as
    | TriggerBlockType
    | undefined;

  if (!block) {
    return null;
  }

  const { title } = block;

  return (
    <>
      <div className={classes.triggerBlock}>
        <Avatar className={classes.blockIcon}>
          <GraduationCapIcon />
        </Avatar>
        <BlockParagraphColors className={classes.paragraphs} block={block} />
        <div className={classes.blockTitle}>{title}</div>
      </div>
      <DiagramHandle
        blockId={id}
        className={classes.handleTarget}
        id={'target.top'}
        type={'target'}
        position={Position.Top}
      />
      <DiagramHandle
        blockId={id}
        className={classes.handleTarget}
        id={'target.left'}
        type={'target'}
        position={Position.Left}
      />
      <DiagramHandle
        blockId={id}
        id={'source.bottom'}
        type={'source'}
        position={Position.Bottom}
      />
    </>
  );
}, propsAreEqual);

TriggerBlock.displayName = 'TriggerBlock';
export default TriggerBlock;
