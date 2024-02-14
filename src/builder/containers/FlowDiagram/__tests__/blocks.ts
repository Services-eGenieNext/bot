/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import assert from 'assert';
import { BlockTypes } from 'shared/types';
import { getEdgesAndNodes } from 'builder/lib/elements';
import { convertBlocksToElements } from 'builder/lib';
import initialBlocks from './fixtures/blocks';

describe('convertsBlocksToElements', () => {
  const elements = convertBlocksToElements(initialBlocks);

  const [nodes, edges] = getEdgesAndNodes(elements);

  it('elements should contains the nodes', () => {
    expect(nodes).toHaveLength(initialBlocks.length);
  });

  it('elements should contains the edges', () => {
    expect(edges).toHaveLength(7);
  });

  it('all edges should have unique ids', () => {
    const edgesIds: string[] = [];
    edges.forEach(edge => {
      expect(edgesIds).not.toContain(edge.id);
      edgesIds.push(edge.id);
    });
  });

  it('all nodes should have unique ids', () => {
    const nodeIds: string[] = [];
    nodes.forEach(node => {
      expect(nodeIds).not.toContain(node.id);
      nodeIds.push(node.id);
    });
  });

  it('all edges should have different source and target', () => {
    edges.forEach(edge => {
      expect(edge.source).not.toBeFalsy();
      expect(edge.target).not.toBeFalsy();
      expect(edge.target).not.toEqual(edge.source);
    });
  });

  it('all node should have type position and data', () => {
    nodes.forEach(node => {
      expect(node.id).not.toBeFalsy();
      expect(node.type).not.toBeFalsy();
      expect(node.position).not.toBeFalsy();
    });
  });
});

describe('getBlockNodeType', () => {
  it('returns correct node type', () => {
    initialBlocks.forEach(block => {
      switch (block.type) {
        case BlockTypes.Text:
          expect(block.type).toEqual('text');
          break;
        case BlockTypes.Finish:
          expect(block.type).toEqual('exit');
          break;
        case BlockTypes.Quit:
          expect(block.type).toEqual('quit');
          break;
        case BlockTypes.Start:
          expect(block.type).toEqual('start');
          break;
        case BlockTypes.API:
          expect(block.type).toEqual('api');
          break;
        default:
          assert(block.type, 'block type is not valid');
      }
    });
  });
});
