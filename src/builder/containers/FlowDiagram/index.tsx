/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, memo, useEffect } from 'react';
import ReactFlow, { Controls, MiniMap } from 'react-flow-renderer';
import clsx from 'clsx';
import {
  useCenterBlock,
  useElementsUpdater,
  useEventHandlers,
} from 'builder/hooks';
import { useModuleContext } from 'shared/context';
import { flowConfigs, miniMapConfig } from './configs';
import { useStyles } from './styles';

export interface FlowDiagramProps {
  className?: string;
}

const FlowDiagram: FC<FlowDiagramProps> = memo(props => {
  const classes = useStyles();
  const { className } = props;

  const [elements, setElements] = useElementsUpdater();
  const [handlers] = useEventHandlers(elements, setElements);
  const centerBlock = useCenterBlock();
  const { registerAction } = useModuleContext();

  useEffect(() => {
    registerAction('centerBlock', centerBlock);
  }, [centerBlock, registerAction]);

  return (
    <ReactFlow
      {...handlers}
      {...flowConfigs}
      className={clsx(className, classes.flowDiagram)}
      elements={elements}
    >
      <Controls className={classes.flowControls} />
      <MiniMap {...miniMapConfig} />
    </ReactFlow>
  );
});

FlowDiagram.displayName = 'FlowDiagram';
export default FlowDiagram;
