/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { ComponentType, HTMLAttributes } from 'react';
import {
  ArrowHeadType,
  ConnectionLineType,
  ConnectionMode,
  MiniMapProps,
  PanOnScrollMode,
} from 'react-flow-renderer';
import { ReactFlowProps } from 'react-flow-renderer/dist/container/ReactFlow';
import QuitBlock from 'builder/components/QuitBlock';
import { BlockTypes } from 'shared/types';
import { UseEventHandlers } from 'builder/hooks';
import ConditionBlock from 'builder/components/ConditionBlock';
import FinishBlock from 'builder/components/FinishBlock';
import GenericBlock from 'builder/components/GenericBlock';
import OutletBlock from 'builder/components/OutletBlock';
import StartBlock from 'builder/components/StartBlock';
import TriggerBlock from 'builder/components/TriggerBlock';
import { getColorByBlockType } from 'builder/lib';

type Configs = Omit<
  ReactFlowProps,
  keyof UseEventHandlers | keyof HTMLAttributes<HTMLDivElement> | 'elements'
>;

type BlockProps<T = object> = T & {
  id: string;
  type: BlockTypes;
  selected: boolean;
  isConnectable: boolean;
};

export type NodeTypes = {
  [key in BlockTypes]?: ComponentType<BlockProps>;
};

const nodeTypes: NodeTypes = {
  [BlockTypes.Text]: GenericBlock,
  [BlockTypes.API]: GenericBlock,
  [BlockTypes.List]: GenericBlock,
  [BlockTypes.Presentation]: GenericBlock,
  [BlockTypes.GDPR]: GenericBlock,
  [BlockTypes.Outlet]: OutletBlock,
  [BlockTypes.Condition]: ConditionBlock,
  [BlockTypes.Trigger]: TriggerBlock,
  [BlockTypes.Start]: StartBlock,
  [BlockTypes.Finish]: FinishBlock,
  [BlockTypes.Quit]: QuitBlock,
};

export const flowConfigs: Configs = {
  onlyRenderVisibleElements: false,
  selectNodesOnDrag: false,
  connectionLineStyle: { stroke: '#111' },
  connectionLineType: ConnectionLineType.Bezier,
  connectionMode: ConnectionMode.Strict,
  defaultZoom: 1,
  minZoom: 0.2,
  maxZoom: 1.6,
  arrowHeadColor: '#111',
  zoomOnScroll: false,
  zoomOnPinch: true,
  zoomOnDoubleClick: true,
  paneMoveable: true,
  panOnScroll: true,
  panOnScrollSpeed: 0.5,
  panOnScrollMode: PanOnScrollMode.Free,
  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,
  deleteKeyCode: 'Backspace',
  selectionKeyCode: 'Shift',
  multiSelectionKeyCode: 'Meta',
  zoomActivationKeyCode: 'Meta',
  defaultPosition: [0, 0],
  snapGrid: [1, 1],
  snapToGrid: true,
  edgeTypes: {},
  nodeTypes,
};

export const defaultEdgeProps = {
  type: flowConfigs.connectionLineType,
  arrowHeadType: ArrowHeadType.ArrowClosed,
};

export const miniMapConfig: MiniMapProps = {
  nodeColor: n => getColorByBlockType(n.type, 0.8),
  nodeStrokeColor: n => getColorByBlockType(n.type),
  nodeBorderRadius: 8,
};
