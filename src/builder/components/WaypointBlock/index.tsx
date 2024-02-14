/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, ReactNode } from 'react';
import {
  Connection,
  Handle,
  HandleType,
  OnConnectFunc,
  Position,
} from 'react-flow-renderer';
import { BlockTypes } from 'shared/types';
import { useStyles } from './styles';

export interface WaypointBlockProps {
  id?: string;
  type?: string;
  selected?: boolean;
  icon: ReactNode;
  title: string;
  onConnect?: OnConnectFunc;
  isValidConnection?: (connection: Connection) => boolean;
}

const WaypointBlock: FC<WaypointBlockProps> = props => {
  const { icon, title, type } = props;
  const classes = useStyles();
  return (
    <>
      <div className={classes.waypointBlock}>
        <div className={classes.diamond} />
        <div className={classes.blockIcon}>{icon}</div>
        <div className={classes.blockTitle}>{title}</div>
      </div>
      {type === BlockTypes.Start && (
        <>
          <WaypointHandle position={Position.Right} type={'source'} />
          <WaypointHandle position={Position.Bottom} type={'source'} />
        </>
      )}
      {(type === BlockTypes.Finish || type === BlockTypes.Quit) && (
        <>
          <WaypointHandle position={Position.Top} type={'target'} />
          <WaypointHandle position={Position.Left} type={'target'} />
          <WaypointHandle position={Position.Right} type={'target'} />
        </>
      )}
    </>
  );
};

export default WaypointBlock;

type WayPointHandleProps = {
  type: HandleType;
  position: Position;
  onConnect?: OnConnectFunc;
  isValidConnection?: (connection: Connection) => boolean;
};

const WaypointHandle: FC<WayPointHandleProps> = props => {
  const { type, position, onConnect, isValidConnection } = props;
  const classes = useStyles();
  return (
    <Handle
      id={`${type}.${position}`}
      position={position}
      type={type}
      className={classes.handle}
      isConnectable={true}
      isValidConnection={isValidConnection}
      onConnect={onConnect}
    />
  );
};
