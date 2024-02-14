/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Block } from 'shared/types';
import { useCenterBlock } from 'builder/hooks';
import InfoChip from 'builder/components/InfoChip';
import { getBlocks } from 'builder/features/selectors';
import { getColorByBlockType } from 'builder/lib';
import { useConnections } from 'builder/hooks/useConnections';
import { useStyles } from './styles';

const ConnectionsPanel: FC = () => {
  const classes = useStyles();
  const [connections] = useConnections();
  const blocks = useSelector(getBlocks);
  const centerBlock = useCenterBlock();

  return (
    <div className={classes.panelSection}>
      <div className={classes.panelTitle}>Outgoing Connections</div>
      <div className={classes.paragraphsList}>
        {connections?.length ? (
          connections
            .map(conn => getConnectedBlockInfo(blocks[conn.id]))
            .filter(x => !!x)
            .map((connInfo, index) => (
              <InfoChip
                key={index}
                color={connInfo?.color || '#fff'}
                label={connInfo?.title || 'Unnamed block'}
                onClick={() => connInfo?.id && centerBlock(connInfo?.id)}
              />
            ))
        ) : (
          <div className={classes.notFound}>No outgoing connection found</div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPanel;

type ConnectionInfo = {
  id: string;
  title: string;
  color: string;
};

const getConnectedBlockInfo = (block?: Block): ConnectionInfo | undefined => {
  if (!block) {
    return;
  }

  return {
    id: block.id,
    title: block.title,
    color: getColorByBlockType(block.type),
  };
};
