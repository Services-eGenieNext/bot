/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, {
  FC,
  memo,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { Position, useStoreActions } from 'react-flow-renderer';
import { Menu, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import { useNodeById } from 'builder/hooks';
import { EllipsisVIcon } from 'shared/icons';
import { actions } from 'builder/features/slice';
import DiagramHandle from 'builder/components/DiagramHandle';
import { useStyles } from 'builder/components/DiagramBlock/styles';

export interface DiagramBlockProps {
  blockId: string;
  title: string;
  icon: ReactNode;
  selected?: boolean;
  className?: string;
  headerClass?: string;
  headerColor?: string;
}

const DiagramBlock: FC<DiagramBlockProps> = memo(props => {
  const {
    blockId,
    selected,
    headerClass,
    headerColor,
    title,
    icon,
    className,
    children,
  } = props;
  const classes = useStyles();
  const [dotMenu, setDotMenuAnchor] = useDotMenu(blockId);
  const thisNode = useNodeById(blockId);
  const setSelectedElements = useStoreActions(
    actions => actions.setSelectedElements,
  );
  const handleDotsClick = event => setDotMenuAnchor(event.currentTarget);
  return (
    <div
      className={clsx(
        className,
        classes.blockRoot,
        selected && classes.selected,
      )}
    >
      <div
        className={clsx(classes.blockHeader, headerClass)}
        style={{ backgroundColor: headerColor }}
      >
        <div className={classes.headerIcon}>{icon}</div>
        <div className={classes.headerTitle}>{title || 'Unnamed Block'}</div>
        <div
          className={classes.dotsIcon}
          onClick={handleDotsClick}
          role={'presentation'}
        >
          <EllipsisVIcon secondaryOpacity={1} />
        </div>
      </div>
      {dotMenu}
      <div
        className={clsx(classes.blockContent, 'nodrag')}
        onClick={() => thisNode && setSelectedElements(thisNode)}
        role={'presentation'}
        tabIndex={0}
      >
        {children}
      </div>
      <DiagramHandle
        blockId={blockId}
        id={'target.top'}
        position={Position.Top}
        type={'target'}
      />
      <DiagramHandle
        blockId={blockId}
        id={'target.left'}
        position={Position.Left}
        type={'target'}
      />
      <DiagramHandle
        blockId={blockId}
        id={'source.bottom'}
        position={Position.Bottom}
        type={'source'}
        className={clsx(classes.blockHandle, selected && classes.selected)}
      />
    </div>
  );
});

DiagramBlock.displayName = 'DiagramBlock';
export default DiagramBlock;

const useDotMenu = (
  blockId: string,
): [JSX.Element, (el: Element | null) => void] => {
  const classes = useStyles({});
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const dispatch = useDispatch();
  const handleClose = () => setAnchorEl(null);

  const options = useMemo(() => ['Duplicate', 'Delete'] as const, []);
  const handleMenuItemClick = useCallback(
    (option: typeof options[number]) => {
      switch (option) {
        case 'Duplicate':
          dispatch(actions.duplicateBlockById(blockId));
          break;
        case 'Delete':
          if (!window.confirm('Are you sure to delete block?')) {
            return;
          }
          dispatch(actions.removeBlockById(blockId));
          break;
      }
      handleClose();
    },
    [blockId, dispatch],
  );

  const dotMenu = useMemo(
    () => (
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {options.map(option => (
          <MenuItem
            key={option}
            onClick={() => handleMenuItemClick(option)}
            className={classes.menuItem}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    ),
    [anchorEl, classes.menuItem, handleMenuItemClick, options],
  );

  return [dotMenu, setAnchorEl];
};
