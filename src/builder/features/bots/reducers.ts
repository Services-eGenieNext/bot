/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';
import { Connection, Edge } from 'react-flow-renderer';
import {
  getConnectingBlocks,
  addConnectionToBlock,
  createNewPresentationBlock,
} from 'builder/lib';
import {
  createFreeSpeechResponse,
  createNewApiBlock,
  createNewBasicBlock,
  createNewConditionBlock,
  createNewFinishBlock,
  createNewQuitBlock,
  createNewListBlock,
  createNewOutletBlock,
  createNewTriggerBlock,
  createPredefinedOption,
  createPredefinedResponse,
  removeConnectionFromSource,
  createNewGDPRBlock,
} from 'builder/lib/bots';
import {
  APIBlockType,
  APIConfig,
  ApiTemplate,
  Block,
  BlockTypes,
  BotWithBlockList,
  ComponentType,
  isApiBlock,
  isOutletBlock,
  isPresentationBlock,
  PredefinedOptions,
  PresentationConfig,
  ResponseComponent,
  ResponseComponentProps,
  SelectedType,
} from 'shared/types';
import {
  getObjectValues,
  logger,
  sanitizeBotsList,
  uuidv4,
} from 'shared/utils';
import {
  getSelectedBlock,
  getSelectedBot,
  getSelectedResponse,
  getVarsData,
} from 'builder/lib/state';

import {
  emitBlockAdded,
  emitBlockRemoved,
  emitBlocksUpdate,
  emitVariableUpdated,
} from '../emit';
import { BotEditorReducer } from '../state';

export interface BotEditorReducers {
  createBlock: BotEditorReducer<
    Partial<Pick<Block, 'id' | 'type' | 'position'>>
  >;
  addConnection: BotEditorReducer<Connection | Edge>;
  addNewResponseOption: BotEditorReducer<string | undefined>;
  addNewResponse: BotEditorReducer<ComponentType>;
  removeBlockById: BotEditorReducer<string>;
  duplicateBlockById: BotEditorReducer<string>;
  removeConnectionByEdge: BotEditorReducer<Edge>;
  updateBlock: BotEditorReducer<Partial<Block>>;
  updateApi: BotEditorReducer<Partial<APIConfig>>;
  updatePresentation: BotEditorReducer<Partial<PresentationConfig>>;
  updateBlockAction: BotEditorReducer<Partial<Block>>;
  updateSelectedResponse: BotEditorReducer<Partial<ResponseComponent>>;
  updateSelectedResponseProps: BotEditorReducer<
    Partial<ResponseComponentProps>
  >;
  updateSelectedOption: BotEditorReducer<Partial<PredefinedOptions>>;
  deleteSelectedResponse: BotEditorReducer;
  deleteAllResponses: BotEditorReducer;
  deleteSelectedOption: BotEditorReducer;
  setBotsAction: BotEditorReducer<BotWithBlockList[]>;
  setApiTemplate: BotEditorReducer<ApiTemplate | undefined>;
}

export const botsReducer: BotEditorReducers = {
  createBlock(state, action) {
    const { type } = action.payload;
    const currentVars = getVarsData(state);

    if (!type) {
      logger.error('payload for create new block action requires block type.');
      return;
    }

    const selectedBot = getSelectedBot(state);

    if (!selectedBot) {
      return;
    }

    const blocks = selectedBot.blocks;

    let newBlock;
    switch (type) {
      case BlockTypes.Text:
        newBlock = createNewBasicBlock();
        break;
      case BlockTypes.API:
        newBlock = createNewApiBlock();
        break;
      case BlockTypes.List:
        newBlock = createNewListBlock();
        break;
      case BlockTypes.Presentation:
        newBlock = createNewPresentationBlock();
        break;
      case BlockTypes.GDPR:
        newBlock = createNewGDPRBlock();
        break;
      case BlockTypes.Outlet:
        newBlock = createNewOutletBlock();
        break;
      case BlockTypes.Condition:
        newBlock = createNewConditionBlock();
        break;
      case BlockTypes.Trigger:
        newBlock = createNewTriggerBlock();
        break;
      case BlockTypes.Finish:
        newBlock = createNewFinishBlock();
        break;
      case BlockTypes.Quit:
        newBlock = createNewQuitBlock();
        break;
    }

    if (!newBlock) {
      const msg = `Block type (${type}) not implemented yet.`;
      window.alert(msg);
      logger.error(msg);
      return;
    }

    if (
      !state.bots ||
      Object.keys(state.bots).length === 0 ||
      !state.selected.selectedBotId
    ) {
      window.alert('To add block, you should first add/select a bot.');
      return;
    }

    const currentBotType = state.bots[state.selected.selectedBotId]?.type;
    if (isOutletBlock(newBlock) && currentBotType !== 'parent') {
      window.alert(
        `Only parent bots can have outlet blocks, current bot is a '${currentBotType}' bot`,
      );
      return;
    }

    blocks[newBlock.id] = {
      ...newBlock,
      ...action.payload,
    };

    emitBlockAdded({ botId: selectedBot.id, block: newBlock });

    const newVars = getVarsData(state);

    if (!isEqual(currentVars, newVars)) {
      emitVariableUpdated(newVars);
    }
  },
  addConnection(state, action) {
    const selectedBot = getSelectedBot(state);
    if (!selectedBot) {
      return;
    }
    const blocks = selectedBot.blocks;
    const updatedBlock = addConnectionToBlock(blocks, action.payload);

    if (updatedBlock) {
      blocks[updatedBlock.id] = updatedBlock;
      emitBlocksUpdate({ botId: selectedBot.id, blocks: [updatedBlock] });
    }
  },
  addNewResponseOption(state, action) {
    const selectedBlock = getSelectedBlock(state);
    if (!selectedBlock) {
      return;
    }

    const componentId = action.payload;
    const selectedComponent =
      (componentId &&
        selectedBlock.components?.find(r => r.id === componentId)) ??
      getSelectedResponse(state);

    let component: ResponseComponent;

    if (!selectedComponent) {
      if (selectedBlock.components && selectedBlock.components.length > 0) {
        component = selectedBlock.components[0]!;
      } else {
        component = createPredefinedResponse();
        selectedBlock.components = [component];
      }
    } else {
      component = selectedComponent;
    }

    state.selected.selectedComponentId = component.id;

    if (component.type !== ComponentType.Predefined) {
      return;
    }

    component.props = component.props ?? {};
    component.props.options = component.props.options ?? [];

    const option = createPredefinedOption();
    component.props.options.push(option);
    state.selected.selectedType = SelectedType.Option;
    state.selected.selectedOptionId = option.id;

    emitBlocksUpdate({
      botId: state.selected.selectedBotId,
      blocks: [selectedBlock],
    });
  },
  addNewResponse(state, action) {
    const selectedBlock = getSelectedBlock(state);
    if (!selectedBlock) {
      return;
    }

    selectedBlock.components = selectedBlock?.components ?? [];
    const component = action.payload;
    let newResponse: ResponseComponent | undefined = undefined;
    switch (component) {
      case ComponentType.FreeSpeech:
        newResponse = createFreeSpeechResponse();
        break;
      case ComponentType.Predefined:
        newResponse = createPredefinedResponse();
        break;
      default:
        logger.error('response component is not supported.');
    }

    if (!newResponse) {
      return;
    }

    selectedBlock.components.push(newResponse);

    emitBlocksUpdate({
      botId: state.selected.selectedBotId,
      blocks: [selectedBlock],
    });
  },
  removeBlockById(state, action) {
    const currentVars = getVarsData(state);
    const removedBlockId = action.payload;
    if (
      state.selected.selectedType === SelectedType.Block &&
      state.selected.selectedBlockId === removedBlockId
    ) {
      state.selected.selectedType = SelectedType.Bot;
      state.selected.selectedBlockId = undefined;
    }
    const selectedBot = getSelectedBot(state);

    if (!selectedBot) {
      return;
    }

    const blocks = selectedBot.blocks;

    const sourceBlocks = getConnectingBlocks(
      removedBlockId,
      getObjectValues(blocks),
    );

    sourceBlocks.forEach(srcBlock => {
      const blockModified = removeConnectionFromSource(
        srcBlock,
        removedBlockId,
      );

      if (blockModified) {
        emitBlocksUpdate({ botId: selectedBot.id, blocks: [srcBlock] });
      }
    });

    delete blocks[removedBlockId];

    emitBlockRemoved({ botId: selectedBot.id, blockId: removedBlockId });

    const newVars = getVarsData(state);

    if (!isEqual(currentVars, newVars)) {
      emitVariableUpdated(newVars);
    }
  },
  duplicateBlockById(state, action) {
    const selectedBot = getSelectedBot(state);
    if (!selectedBot) {
      return;
    }
    const blocks = selectedBot.blocks;
    const block = blocks[action.payload];
    const newBlock = cloneDeep(block)!;
    newBlock.id = uuidv4();
    newBlock.position.x += 300;
    newBlock.next = undefined;

    newBlock.components = newBlock.components?.map(res => {
      res.id = uuidv4();

      res.props = res.props ?? {};
      res.props.options = res.props?.options?.map(opt => {
        opt.id = uuidv4();

        if (opt.next) {
          opt.next = undefined;
        }

        return opt;
      });
      return res;
    });

    blocks[newBlock.id] = newBlock;
    emitBlockAdded({ botId: selectedBot.id, block: newBlock });
  },
  removeConnectionByEdge(state, action) {
    const selectedBot = getSelectedBot(state);
    if (!selectedBot) {
      return;
    }
    const blocks = selectedBot.blocks;
    const { source: sourceId, target: targetId } = action.payload;
    if (!sourceId || !targetId) {
      return;
    }

    const sourceBlock = blocks[sourceId];
    const blockModified = removeConnectionFromSource(sourceBlock, targetId);

    if (blockModified && sourceBlock) {
      emitBlocksUpdate({ botId: selectedBot.id, blocks: [sourceBlock] });
    }
  },
  updateBlock(state, action) {
    const selectedBot = getSelectedBot(state);

    if (!selectedBot) {
      return;
    }

    const blocks = selectedBot.blocks;
    const blockUpdates = action.payload;
    const updatedBlockId = blockUpdates.id || state.selected.selectedBlockId;

    if (!updatedBlockId || !blocks[updatedBlockId]) {
      logger.warn(
        'could not update block because block id was missing/no block is selected/block not found',
      );
      return;
    }

    const updatedBlock = (blocks[updatedBlockId] = merge(
      blocks[updatedBlockId],
      blockUpdates,
    ));

    emitBlocksUpdate({
      botId: selectedBot.id,
      blocks: [updatedBlock],
    });

    const blockType = updatedBlock.type;

    if (blockType === BlockTypes.Trigger) {
      emitVariableUpdated(getVarsData(state));
    }
  },
  updateBlockAction(state, action) {
    const selectedBot = getSelectedBot(state);
    if (!selectedBot) {
      return;
    }
    const blocks = selectedBot.blocks;
    const blockUpdates = action.payload;
    const updatedBlockId = blockUpdates.id || state.selected.selectedBlockId;

    if (!updatedBlockId || !blocks[updatedBlockId]) {
      logger.warn(
        'could not update block because block id was missing/block not found',
      );
      return;
    }

    const updatedBlock = blocks[updatedBlockId];
    Object.assign(updatedBlock, blockUpdates);
  },
  updateSelectedResponse(state, action) {
    const currentVars = getVarsData(state);
    const selectedBlock = getSelectedBlock(state);

    if (!selectedBlock) {
      return;
    }

    if (!selectedBlock.components || selectedBlock.components.length === 0) {
      selectedBlock.components = [
        {
          id: uuidv4(),
          type: ComponentType.FreeSpeech,
          props: {
            options: [],
          },
          ...action.payload,
        },
      ];
    }

    const response = action.payload.id
      ? selectedBlock.components.find(res => res.id === action.payload.id)
      : selectedBlock.components[0];

    Object.assign(response, action.payload);

    emitBlocksUpdate({
      botId: state.selected.selectedBotId,
      blocks: [selectedBlock],
    });

    const newVars = getVarsData(state);

    if (!isEqual(currentVars, newVars)) {
      emitVariableUpdated(newVars);
    }
  },
  updateSelectedResponseProps(state, action) {
    const selectedBlock = getSelectedBlock(state);
    const selectedResponse = getSelectedResponse(state);

    if (!selectedBlock || !selectedResponse) {
      return;
    }

    Object.assign(selectedResponse.props, action.payload);

    emitBlocksUpdate({
      botId: state.selected.selectedBotId,
      blocks: [selectedBlock],
    });
  },
  updateSelectedOption(state, action) {
    const selectedBlock = getSelectedBlock(state);
    const selectedResponse = getSelectedResponse(state);
    const selectedOption = selectedResponse?.props?.options?.find(
      opt => opt?.id === state.selected.selectedOptionId,
    );

    if (!selectedBlock || !selectedOption) {
      return;
    }

    Object.assign(selectedOption, action.payload);

    emitBlocksUpdate({
      botId: state.selected.selectedBotId,
      blocks: [selectedBlock],
    });
  },
  deleteSelectedResponse(state) {
    const selectedBlock = getSelectedBlock(state);
    const selectedResponse = getSelectedResponse(state);

    if (!selectedBlock?.components || !selectedResponse) {
      return;
    }

    if (selectedBlock.components.length === 1) {
      selectedBlock.components[0]!.type = ComponentType.None;
    } else if (selectedBlock.components.length > 1) {
      selectedBlock.components = selectedBlock.components.filter(
        res => res.id !== selectedResponse?.id,
      );
    }

    state.selected.selectedType = SelectedType.Block;
    emitBlocksUpdate({
      botId: state.selected.selectedBotId,
      blocks: [selectedBlock],
    });
  },
  deleteAllResponses(state) {
    const selectedBlock = getSelectedBlock(state);
    if (!selectedBlock) {
      return;
    }

    selectedBlock.components = [];
  },
  deleteSelectedOption(state) {
    const selectedBlock = getSelectedBlock(state);
    const selectedResponse = getSelectedResponse(state);
    const selectedOptionId = state.selected.selectedOptionId;

    if (!selectedBlock?.components || !selectedResponse || !selectedOptionId) {
      return;
    }

    selectedResponse.props = selectedResponse.props ?? {};
    selectedResponse.props.options = selectedResponse.props.options?.filter(
      opt => opt.id !== selectedOptionId,
    );

    state.selected.selectedType = SelectedType.Response;
    state.selected.selectedOptionId = undefined;

    emitBlocksUpdate({
      botId: state.selected.selectedBotId,
      blocks: [selectedBlock],
    });
  },
  setBotsAction(state, action) {
    state.bots = sanitizeBotsList(action.payload);

    state.metadata = Object.keys(state.bots).reduce((acc, id) => {
      const bot = state.bots[id]!;
      const startBlock = Object.values(bot.blocks).find(
        b => b && b.type === BlockTypes.Start,
      );
      acc[id] = {
        transform: {
          x: -1 * (startBlock?.position.x || 0) + 100,
          y: -1 * (startBlock?.position.y || 0) + 30,
          zoom: 1,
        },
      };
      return acc;
    }, {});

    const selectedBot = getSelectedBot(state);
    if (selectedBot) {
      state.selected.selectedBotId = selectedBot.id;
    }
  },
  updateApi(state, action) {
    const selectedBlock = getSelectedBlock(state);
    if (!selectedBlock || !isApiBlock(selectedBlock)) {
      return;
    }
    selectedBlock.api = {
      ...selectedBlock.api,
      ...action.payload,
    };

    emitBlocksUpdate({
      botId: state.selected.selectedBotId,
      blocks: [selectedBlock],
    });
  },
  updatePresentation(state, action) {
    const selectedBlock = getSelectedBlock(state);
    if (!selectedBlock || !isPresentationBlock(selectedBlock)) {
      return;
    }
    selectedBlock.configs = {
      ...selectedBlock.configs,
      ...action.payload,
    };

    emitBlocksUpdate({
      botId: state.selected.selectedBotId,
      blocks: [selectedBlock],
    });
  },
  setApiTemplate: (state, action) => {
    const currentVars = getVarsData(state);
    const apiTemplate = action.payload;
    const selectedBlock = getSelectedBlock(state) as APIBlockType | undefined;
    const firstComponent = (selectedBlock?.components ?? [])[0];

    if (!selectedBlock) {
      return;
    }

    if (!apiTemplate) {
      selectedBlock.api = {
        endpoint: '',
        payload: '',
      };
      selectedBlock.templateId = undefined;
      selectedBlock.components = [
        {
          id: firstComponent?.id ?? uuidv4(),
          type: ComponentType.None,
        },
      ];

      emitBlocksUpdate({
        botId: state.selected.selectedBotId,
        blocks: [selectedBlock],
      });

      const newVars = getVarsData(state);

      if (!isEqual(currentVars, newVars)) {
        emitVariableUpdated(newVars);
      }

      return;
    } else if (
      !apiTemplate.id ||
      !apiTemplate.endpoint.value ||
      !apiTemplate.component.type ||
      !apiTemplate.component.props
    ) {
      logger.warn('Api template is invalid');
      return;
    }

    selectedBlock.templateId = apiTemplate.id;

    selectedBlock.api = {
      payload: apiTemplate.payload.value ?? '',
      endpoint: apiTemplate.endpoint.value ?? '',
    };

    selectedBlock.components = [
      {
        id: firstComponent?.id ?? uuidv4(),
        type: apiTemplate.component.type,
        props: apiTemplate.component.props,
      },
    ];

    emitBlocksUpdate({
      botId: state.selected.selectedBotId,
      blocks: [selectedBlock],
    });

    const newVars = getVarsData(state);

    if (!isEqual(currentVars, newVars)) {
      emitVariableUpdated(newVars);
    }
  },
};
