/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import {
  Action,
  APIBlockType,
  Block,
  BlockCategories,
  BlockTypes,
  ConditionBlockType,
  ConditionOperator,
  FinishBlockType,
  QuitBlockType,
  isConditionBlock,
  ListBlockType,
  OutletBlockType,
  PredefinedOptions,
  ResponseComponent,
  ComponentType,
  TextBlockType,
  TriggerBlockType,
  PresentationBlockType,
  GDPRBlockType,
} from 'shared/types';
import { uuidv4 } from 'shared/utils';

export const createNewBlock = (block?: Partial<Block>): Block => ({
  id: uuidv4(),
  type: BlockTypes.Text,
  category: BlockCategories.Block,
  title: '',
  next: null,
  position: {
    x: 500,
    y: 500,
  },
  ...block,
});

export const createNewBasicBlock = (): TextBlockType => ({
  ...createNewBlock(),
  type: BlockTypes.Text,
  category: BlockCategories.Block,
  title: 'New Text Block',
  required: true,
  components: [
    {
      id: uuidv4(),
      type: ComponentType.None,
      props: {},
    },
  ],
  readMore: {
    enabled: false,
    label: '',
    excerpt: '',
    text: '',
  },
  paragraphs: [],
});

export const createNewApiBlock = (): APIBlockType => ({
  ...createNewBasicBlock(),
  type: BlockTypes.API,
  title: 'New API Block',
  api: {
    endpoint: '',
    payload: '',
  },
});

export const createNewListBlock = (): ListBlockType => ({
  ...createNewBasicBlock(),
  type: BlockTypes.List,
  title: 'New List Block',
  components: [],
});

export const createNewPresentationBlock = (): PresentationBlockType => ({
  ...createNewBlock(),
  category: BlockCategories.Block,
  type: BlockTypes.Presentation,
  title: 'New Presentation Block',
  configs: {},
});

export const createNewGDPRBlock = (): GDPRBlockType => ({
  ...createNewBlock(),
  category: BlockCategories.Block,
  type: BlockTypes.GDPR,
  title: 'New GDPR Block',
  configs: {},
});

export const createNewOutletBlock = (): OutletBlockType => ({
  ...createNewBlock(),
  type: BlockTypes.Outlet,
  category: BlockCategories.Waypoint,
  title: 'Outlet',
});

export const createNewConditionBlock = (): ConditionBlockType => ({
  ...createNewBlock(),
  type: BlockTypes.Condition,
  category: BlockCategories.Action,
  title: 'New Condition Block',
  operator: ConditionOperator.EQUAL,
  valueLeft: '',
  valueRight: '',
});

export const createNewTriggerBlock = (): TriggerBlockType => ({
  ...createNewBlock(),
  type: BlockTypes.Trigger,
  category: BlockCategories.Action,
  title: 'New Trigger Block',
  action: Action.SET_VARIABLE,
  value: '',
  variable: '',
});

export const createNewFinishBlock = (): FinishBlockType => ({
  ...createNewBlock(),
  type: BlockTypes.Finish,
  category: BlockCategories.Waypoint,
  title: 'finish',
});

export const createNewQuitBlock = (): QuitBlockType => ({
  ...createNewBlock(),
  type: BlockTypes.Quit,
  category: BlockCategories.Waypoint,
  title: 'quit',
});

export const createPredefinedOption = (): PredefinedOptions => ({
  id: uuidv4(),
  title: '',
  hint: '',
  paragraphs: [],
  value: '',
});

export const createPredefinedResponse = (): ResponseComponent => ({
  id: uuidv4(),
  type: ComponentType.Predefined,
  props: {
    title: '',
    hint: '',
    options: [],
  },
});

export const createFreeSpeechResponse = (): ResponseComponent => ({
  id: uuidv4(),
  type: ComponentType.FreeSpeech,
  props: {
    title: '',
    hint: '',
    validation: {
      type: 'anything',
    },
  },
});

export const createStartBlock: () => Block = () => ({
  id: uuidv4(),
  type: BlockTypes.Start,
  category: BlockCategories.Waypoint,
  title: 'start',
  position: { x: 50, y: 50 },
});

export const removeConnectionFromSource = (
  sourceBlock?: Block,
  targetId?: string,
): boolean => {
  let blockModified = false;

  if (!sourceBlock || !targetId) {
    return blockModified;
  }

  if (sourceBlock.next?.id === targetId) {
    sourceBlock.next = null;
    blockModified = true;
  } else if (sourceBlock.components) {
    const targetResOption = sourceBlock.components
      ?.filter(res => res.type === ComponentType.Predefined)
      .flatMap(res => res.props?.options)
      .find(opt => opt?.next?.id === targetId);

    if (targetResOption) {
      targetResOption.next = undefined;
      blockModified = true;
    }
  } else if (isConditionBlock(sourceBlock)) {
    if (sourceBlock.nextTrue?.id === targetId) {
      sourceBlock.nextTrue = null;
      blockModified = true;
    } else if (sourceBlock.nextFalse?.id === targetId) {
      sourceBlock.nextFalse = null;
      blockModified = true;
    }
  }

  return blockModified;
};
