/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import {
  ArrowHeadType,
  Connection,
  Edge,
  Elements,
  FlowElement,
  getConnectedEdges,
  isEdge,
  Node,
} from 'react-flow-renderer';
import { BlockTypes } from 'shared/types';
import { colors } from 'builder/lib/colors';

export const getColorByBlockType = (type?: string, opacity: number = 1) => {
  switch (type as BlockTypes) {
    case BlockTypes.Text:
      return `rgba(110, 0, 230, ${opacity})`;
    case BlockTypes.API:
      return `rgba(0, 106, 230, ${opacity})`;
    case BlockTypes.List:
      return `rgba(230, 0, 104, ${opacity})`;
    case BlockTypes.Trigger:
    case BlockTypes.Condition:
      return `rgba(176, 176, 255, ${opacity})`;
    case BlockTypes.Outlet:
    case BlockTypes.Start:
    case BlockTypes.Finish:
    case BlockTypes.Quit:
      return `rgba(17, 17, 17, ${opacity})`;
    default:
      return `rgba(221, 221, 221, ${opacity})`;
  }
};

const hashCode = (s: string): number => {
  return s.split('').reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
};

export const getColorByConnection = (conn: Edge | Connection) => {
  const str = [
    conn.source,
    conn.target,
    conn.targetHandle,
    conn.sourceHandle,
  ].join();

  if (conn.sourceHandle === 'source.condition.true') {
    return '#52ea2a';
  } else if (conn.sourceHandle === 'source.condition.false') {
    return '#ff5e5e';
  }

  const colorIndex = Math.abs(hashCode(str)) % colors.length;
  return colors[colorIndex];
};

export const addColorToConnectedEdges =
  (selectedNodes: Node[]) => (elements: Elements) => {
    const allEdges: Edge[] = elements.filter((el): el is Edge => isEdge(el));
    const connectedEdgeIds = getConnectedEdges(selectedNodes, allEdges).map(
      ({ id }) => id,
    );

    return elements.map(createEdgeColorMapper(connectedEdgeIds));
  };

export const createEdgeColorMapper =
  (edgeIds: string[]) =>
  (element: FlowElement): FlowElement => {
    if (edgeIds.includes(element.id)) {
      return addColorToEdge(element);
    } else {
      return removeColorFromEdge(element);
    }
  };

export const addColorToEdge = (el: FlowElement): FlowElement => {
  if (isEdge(el)) {
    const newElement = { ...el };
    const color = getColorByConnection(el);
    newElement.animated = true;
    newElement.style = {
      stroke: color,
    };
    return newElement;
  }
  return el;
};

export const removeColorFromEdge = (el: FlowElement): FlowElement => {
  if (isEdge(el)) {
    const newElement = { ...el };
    newElement.animated = false;
    newElement.arrowHeadType = ArrowHeadType.ArrowClosed;
    newElement.style = { stroke: undefined };
    return newElement;
  }
  return el;
};
