/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { Position } from 'react-flow-renderer';
import clsx from 'clsx';
import BlockParagraphColors from 'builder/components/BlockParagraphColors';
import { SortSizeUpIcon } from 'shared/icons';
import { getBlockById } from 'builder/features/selectors';
import { BlockTypes, ConditionBlockType } from 'shared/types';
import DiagramHandle from '../DiagramHandle';
import { useStyles } from './styles';

export interface ConditionBlockProps {
  id: string;
  isConnectable: boolean;
  selected: boolean;
  type: BlockTypes;
}

const propsAreEqual = (prevProps, nextProps) => {
  return prevProps.selected === nextProps.selected;
};

const ConditionBlock: FC<ConditionBlockProps> = memo(props => {
  const { id, selected } = props;
  const classes = useStyles({ selected });

  const block = useSelector(state => getBlockById(state, id)) as
    | ConditionBlockType
    | undefined;

  if (!block) {
    return null;
  }

  const { title } = block;

  return (
    <>
      <div className={classes.conditionBlock}>
        <Avatar className={classes.blockIcon}>
          <SortSizeUpIcon />
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
        className={clsx(classes.handleSource, classes.handleFalse)}
        id={'source.condition.false'}
        type={'source'}
        position={Position.Bottom}
      />
      <DiagramHandle
        blockId={id}
        className={clsx(classes.handleSource, classes.handleTrue)}
        id={'source.condition.true'}
        type={'source'}
        position={Position.Bottom}
      />
    </>
  );
}, propsAreEqual);

ConditionBlock.displayName = 'ConditionBlock';

export default ConditionBlock;
