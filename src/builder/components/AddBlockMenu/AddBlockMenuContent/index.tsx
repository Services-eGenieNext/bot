/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import clsx from 'clsx';
import { Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { getSelectedBot } from 'builder/features/selection/selectors';
import {
  CommentAltEditIcon,
  ClipboardListCheckIcon,
  DoorOpenIcon,
  GraduationCapIcon,
  PortalExitIcon,
  ServerIcon,
  SortSizeUpIcon,
  PresentationIcon,
  StoreSlashIcon,
  GDPRIcon,
} from 'shared/icons';
import { BlockTypes } from 'shared/types';
import { useStyles } from './styles';

const AddBlockMenuContent: FC<{ onSelect: (type: BlockTypes) => void }> = ({
  onSelect,
}) => {
  const classes = useStyles();
  const selectedBot = useSelector(getSelectedBot);
  const isParentBot = selectedBot?.type === 'parent';

  const handleBlockClicked = (type: BlockTypes) => {
    onSelect(type);
  };

  return (
    <div className={classes.menuContainer}>
      <div className={classes.menuSection}>
        <div className={classes.sectionTitle}>Blocks</div>
        <GenericBlock
          className={classes.textBlock}
          title={'Text'}
          icon={<CommentAltEditIcon />}
          onClick={() => handleBlockClicked(BlockTypes.Text)}
        />
        <GenericBlock
          className={classes.textBlock}
          title={'API'}
          icon={<ServerIcon />}
          onClick={() => handleBlockClicked(BlockTypes.API)}
        />
        <GenericBlock
          className={classes.textBlock}
          title={'List'}
          icon={<ClipboardListCheckIcon />}
          onClick={() => handleBlockClicked(BlockTypes.List)}
        />
        <GenericBlock
          className={classes.textBlock}
          title={'Presentation'}
          icon={<PresentationIcon />}
          onClick={() => handleBlockClicked(BlockTypes.Presentation)}
        />
        <GenericBlock
          className={classes.textBlock}
          title={'GDPR'}
          icon={<GDPRIcon />}
          onClick={() => handleBlockClicked(BlockTypes.GDPR)}
        />
      </div>
      <div className={classes.menuSection}>
        <div className={classes.sectionTitle}>Actions</div>
        <ActionBlock
          className={classes.triggerBlock}
          title={'Trigger'}
          icon={<GraduationCapIcon />}
          onClick={() => handleBlockClicked(BlockTypes.Trigger)}
        />
        <ActionBlock
          className={classes.conditionBlock}
          title={'Condition'}
          icon={<SortSizeUpIcon />}
          onClick={() => handleBlockClicked(BlockTypes.Condition)}
        />
      </div>
      <div className={classes.menuSection}>
        <div className={classes.sectionTitle}>Waypoints</div>
        <WaypointBlock
          title={'Finish'}
          icon={<DoorOpenIcon />}
          onClick={() => handleBlockClicked(BlockTypes.Finish)}
        />
        {isParentBot && (
          <WaypointBlock
            title={'Outlet'}
            icon={<PortalExitIcon />}
            onClick={() => handleBlockClicked(BlockTypes.Outlet)}
          />
        )}
        <WaypointBlock
          title={'Quit'}
          icon={<StoreSlashIcon />}
          onClick={() => handleBlockClicked(BlockTypes.Quit)}
        />
      </div>
    </div>
  );
};

export default AddBlockMenuContent;

type BlockTitle =
  | 'Text'
  | 'API'
  | 'List'
  | 'Trigger'
  | 'Condition'
  | 'Finish'
  | 'Quit'
  | 'Outlet'
  | 'Presentation'
  | 'GDPR';

type MenuBlockProps = {
  title: BlockTitle;
  icon: JSX.Element;
  onClick: () => void;
  className?: string;
};

const BlockItem: FC<{ onClick: () => void }> = ({ onClick, children }) => {
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.blockType)}
      role={'presentation'}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const GenericBlock: FC<MenuBlockProps> = props => {
  const classes = useStyles();
  const { title, icon, className, onClick } = props;
  return (
    <BlockItem onClick={onClick}>
      <div className={classes.blockBorder} />
      <div className={classes.blockTitle}>{title}</div>
      <Avatar className={clsx(classes.blockAvatar, className)}>{icon}</Avatar>
    </BlockItem>
  );
};

const ActionBlock: FC<MenuBlockProps> = props => {
  const classes = useStyles();
  const { title, icon, className, onClick } = props;
  return (
    <BlockItem onClick={onClick}>
      <div className={classes.actionBorder} />
      <div className={classes.blockTitle}>{title}</div>
      <Avatar className={clsx(classes.blockAvatar, className)}>{icon}</Avatar>
    </BlockItem>
  );
};

const WaypointBlock: FC<MenuBlockProps> = props => {
  const classes = useStyles();
  const { title, icon, onClick } = props;
  return (
    <BlockItem onClick={onClick}>
      <div className={classes.waypointBorder} />
      <div className={classes.waypointTitle}>{title}</div>
      <div className={classes.waypointIcon}>{icon}</div>
    </BlockItem>
  );
};
