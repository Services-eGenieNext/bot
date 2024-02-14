/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from '@material-ui/core/utils/debounce';
import {
  Connection,
  Edge,
  Elements,
  FlowTransform,
  isEdge,
  isNode,
  Node,
  ReactFlowProps,
  removeElements,
  useStoreActions,
} from 'react-flow-renderer';
import { logger } from 'shared/utils';
import { actions } from 'builder/features/slice';
import { getSelectedBlock, getSelectedBotId } from 'builder/features/selectors';
import { BlockTypes } from 'shared/types';
import { useNodeById, useSelectedElements } from 'builder/hooks/useFlowState';
import {
  addColorToConnectedEdges,
  isNodeSelectable,
  removeColorFromEdge,
} from 'builder/lib';

export const useEventHandlers: UseHandlers = (elements, setElements) => {
  const _dispatch = useDispatch();
  const dispatch: Dispatch<any> = useCallback(
    (...args) => setImmediate(() => _dispatch(...args)),
    [_dispatch],
  );

  const [dragging, setDragging] = useState(false);
  const prevDraggingRef = useRef(dragging);
  const selectedBotId = useSelector(getSelectedBotId);
  const selectedBlock = useSelector(getSelectedBlock);
  const selectedBlockNode = useNodeById(selectedBlock?.id);
  const selectedElements = useSelectedElements();
  const setSelectedElements = useStoreActions(
    actions => actions.setSelectedElements,
  );

  useEffect(() => {
    if (!dragging && dragging !== prevDraggingRef.current) {
      const selectedNode = selectedElements.find(isNode);
      if (selectedNode && selectedBlock?.id !== selectedNode.id) {
        dispatch(actions.setSelectedToBlock(selectedNode?.id));
      }
    }
  }, [dispatch, dragging, selectedBlock?.id, selectedElements]);

  useEffect(() => {
    prevDraggingRef.current = dragging;
  }, [dragging]);

  const isElementSelected = useCallback(
    el => !!selectedElements?.find(({ id }) => id === el.id),
    [selectedElements],
  );

  const onElementsRemove = useCallback(
    (removedElements: Elements) => {
      if (!window.confirm('Are you sure to delete?')) {
        return;
      }

      removedElements.forEach(removedEl => {
        if (removedEl.type === BlockTypes.Start) {
          return;
        }

        if (isNode(removedEl)) {
          dispatch(actions.removeBlockById(removedEl.id));
        } else if (isEdge(removedEl)) {
          dispatch(actions.removeConnectionByEdge(removedEl));
        }
      });
      setElements(els => removeElements(removedElements, els));
    },
    [dispatch, setElements],
  );

  const onSelectionChange = useCallback(
    (selected: Elements | null): void => {
      const selectedNodes = selected
        ? selected.filter(
            (el): el is Node => isNode(el) && isNodeSelectable(el),
          )
        : [];
      logger.debug('Selection changed', {
        selectedNodes,
      });

      if (selectedNodes.length !== 1 && !dragging) {
        dispatch(actions.setSelectedToBot());
      } else if (
        selectedBlock?.id !== selectedNodes[0]?.id &&
        selectedNodes[0]
      ) {
        dispatch(actions.setSelectedToBlock(selectedNodes[0]?.id));
      }

      setTimeout(() => {
        setElements(addColorToConnectedEdges(selectedNodes));
      }, 10);
    },
    [dispatch, dragging, selectedBlock?.id, setElements],
  );

  const onNodeDrag = useCallback(() => {
    setDragging(true);

    if (selectedBlockNode) {
      selectedBlockNode.className = 'selected';
    }
  }, [selectedBlockNode]);

  const onNodeDragStop = useCallback(
    (event: MouseEvent, node: Node) => {
      if (selectedBlockNode) {
        setElements(els =>
          els.map(el => {
            if (isNode(el) && el.id === selectedBlockNode.id) {
              el.className = '';
            }
            return el;
          }),
        );
        setSelectedElements(selectedBlockNode);
      }

      dispatch(
        actions.updateBlock({
          id: node.id,
          position: { ...node.position },
        }),
      );
    },
    [dispatch, selectedBlockNode, setElements, setSelectedElements],
  );

  const onConnect = useCallback(
    (connection: Connection | Edge) => {
      setTimeout(() => onSelectionChange(selectedElements), 50);
      dispatch(actions.addConnection({ ...connection }));
    },
    [dispatch, onSelectionChange, selectedElements],
  );

  const updateBotTransform = useMemo(
    () =>
      debounce<(id?: string, t?: FlowTransform) => void>((botId, transform) => {
        dispatch(actions.updateBotTransform({ botId, transform }));
      }, 100),
    [dispatch],
  );

  const onMoveEnd = useCallback(
    (transform?: FlowTransform) => {
      updateBotTransform(selectedBotId, transform);
    },
    [selectedBotId, updateBotTransform],
  );

  const onElementClick = useCallback(
    (event, element: Node | Edge) => {
      if (
        isNode(element) &&
        isElementSelected(element) &&
        isNodeSelectable(element)
      ) {
        dispatch(actions.setSelectedToBlock(element.id));
      }
    },
    [dispatch, isElementSelected],
  );

  const onPaneClick = useCallback(() => {
    setElements(elements => elements.map(el => removeColorFromEdge(el)));
    dispatch(actions.setSelectedToBot());
  }, [dispatch, setElements]);

  const handlers: UseEventHandlers = useMemo(
    () => ({
      onElementsRemove,
      onConnect,
      onNodeDragStop,
      onSelectionChange,
      onMoveEnd,
      onElementClick,
      onNodeDrag,
      onPaneClick,
    }),
    [
      onNodeDrag,
      onConnect,
      onElementClick,
      onElementsRemove,
      onMoveEnd,
      onNodeDragStop,
      onSelectionChange,
      onPaneClick,
    ],
  );

  return [handlers];
};

export type UseEventHandlers = Pick<
  ReactFlowProps,
  | 'onElementClick'
  | 'onElementsRemove'
  | 'onNodeMouseEnter'
  | 'onNodeMouseMove'
  | 'onNodeMouseLeave'
  | 'onNodeContextMenu'
  | 'onNodeDrag'
  | 'onNodeDragStart'
  | 'onNodeDragStop'
  | 'onConnect'
  | 'onConnectStart'
  | 'onConnectStop'
  | 'onConnectEnd'
  | 'onLoad'
  | 'onMove'
  | 'onMoveStart'
  | 'onMoveEnd'
  | 'onSelectionChange'
  | 'onSelectionDragStart'
  | 'onSelectionDrag'
  | 'onSelectionDragStop'
  | 'onSelectionContextMenu'
  | 'onPaneScroll'
  | 'onPaneClick'
  | 'onPaneContextMenu'
  | 'onEdgeUpdate'
>;

export type UseHandlers = (
  elements: Elements,
  setElements: Dispatch<SetStateAction<Elements>>,
) => [UseEventHandlers];
