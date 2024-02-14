/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Position } from 'react-flow-renderer';
import clsx from 'clsx';
import { useEdgesByBlockId } from 'builder/hooks';
import BlockContentDivider from 'builder/components/BlockContentDivider';
import BlockParagraphColors from 'builder/components/BlockParagraphColors';
import DiagramBlock from 'builder/components/DiagramBlock';
import DiagramHandle from 'builder/components/DiagramHandle';
import FreeSpeechPreview from 'builder/components/FreeSpeechPreview';
import ResponseButton from 'builder/components/ResponseButton';
import TextPreview from 'builder/components/TextPreview';
import { getBlockById, getSelectedItem } from 'builder/features/selectors';
import { actions } from 'builder/features/slice';
import {
  ClipboardListCheckIcon,
  ScrubberIcon,
  ServerIcon,
  TypewriterIcon,
  PresentationIcon,
  GDPRIcon,
} from 'shared/icons';
import {
  Block,
  BlockTypes,
  ComponentType,
  ResponseComponent,
  SelectedType,
} from 'shared/types';
import { getReadMoreExcerpt } from 'shared/utils/blocks';
import AddResponseMenu from '../AddResponseMenu';
import MultipleComponentPreview from '../MultipleComponentPreview';
import { useStyles } from './styles';

export interface GenericBlockProps {
  id: string;
  isConnectable: boolean;
  selected: boolean;
  type: BlockTypes;
}

const propsAreEqual = (prevProps, nextProps) => {
  return prevProps.selected === nextProps.selected;
};

const GenericBlock: FC<GenericBlockProps> = memo(props => {
  const { selected, id, type } = props;
  const classes = useStyles({ type });

  const dispatch = useDispatch();
  const selectById = useCallback(state => getBlockById(state, id), [id]);
  const block = useSelector(selectById);

  if (!block) {
    return null;
  }

  const { title } = block;
  const excerptText = getReadMoreExcerpt(block);

  return (
    <DiagramBlock
      title={title}
      blockId={id}
      selected={selected}
      headerColor={getHeaderColorByType(type)}
      icon={<BlockIcon block={block} />}
    >
      <div className={classes.blockContent}>
        <BlockParagraphColors block={block} />

        <TextPreview
          className={classes.focusable}
          text={block.text ?? ''}
          lines={1}
          onClick={() => dispatch(actions.setSelectedToTextMessage(block.id))}
        />

        {block.readMore?.enabled && (
          <>
            <BlockContentDivider title={'Required more content'} />
            <TextPreview
              className={classes.focusable}
              text={excerptText}
              lines={2}
              onClick={() => dispatch(actions.setSelectedToReadMore(block.id))}
            />
          </>
        )}

        {(block.type === BlockTypes.Text || block.type === BlockTypes.API) && (
          <ComponentProperties block={block} />
        )}
        {block.type === BlockTypes.List && (
          <MultipleComponentProperties block={block} />
        )}
      </div>
    </DiagramBlock>
  );
}, propsAreEqual);

GenericBlock.displayName = 'GenericBlock';

export default GenericBlock;

type BlockInfoProps = {
  block: Block;
};

const BlockIcon: FC<BlockInfoProps> = props => {
  const { block } = props;
  if (!block) {
    return null;
  }

  const blockType = block?.type;
  const firstResponseType =
    block.components &&
    block.components.length > 0 &&
    block.components[0]?.type;
  if (blockType === BlockTypes.API) {
    return <ServerIcon />;
  } else if (blockType === BlockTypes.List) {
    return <ClipboardListCheckIcon size={'1.25em'} />;
  } else if (blockType === BlockTypes.Presentation) {
    return <PresentationIcon />;
  } else if (blockType === BlockTypes.GDPR) {
    return <GDPRIcon />;
  } else if (firstResponseType === 'freespeech') {
    return <TypewriterIcon />;
  } else if (firstResponseType === 'predefined') {
    return <ScrubberIcon revertColors secondaryOpacity={0} />;
  }
  return null;
};

const ComponentProperties: FC<BlockInfoProps> = props => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { block } = props;
  const blockId = block.id;

  const hasResponseComponent =
    block.components &&
    block.components.filter(c => c.type !== ComponentType.None).length > 0;

  if (!block.components || !hasResponseComponent) {
    return null;
  }

  return (
    <>
      <BlockContentDivider title={'Required response'} />
      {block.components.map((response, index) => (
        <div key={index}>
          {response.type === ComponentType.FreeSpeech && (
            <FreeSpeechPreview
              className={clsx('qqqq', classes.focusable, 'pppp')}
              response={response}
              clickable
            />
          )}

          {response.type === ComponentType.Predefined && (
            <>
              <OptionButtons response={response} blockId={blockId} />
              <ResponseButton
                label={'Add'}
                buttonVariant={'add'}
                onClick={() => {
                  dispatch(actions.setSelectedToBlock(blockId));
                  dispatch(actions.addNewResponseOption(response.id));
                }}
              />
            </>
          )}
        </div>
      ))}
    </>
  );
};

const MultipleComponentProperties: FC<BlockInfoProps> = props => {
  const { block } = props;
  const classes = useStyles({});
  return (
    <>
      {block.components?.length ? (
        <BlockContentDivider title={'Response Fields'} />
      ) : null}
      <MultipleComponentPreview
        className={classes.multipleComponent}
        block={block}
      />
      <AddResponseMenu />
    </>
  );
};

type OptionButtonsProps = {
  response: ResponseComponent;
  blockId: string;
};
const OptionButtons: FC<OptionButtonsProps> = props => {
  const { response, blockId } = props;
  const classes = useStyles({});
  const selectedItem = useSelector(getSelectedItem);
  const dispatch = useDispatch();
  const edges = useEdgesByBlockId(blockId);

  const getHandleId = optionId => `source.response.${optionId}`;

  const getColorByOptionId = (optionId: string) => {
    const handleId = getHandleId(optionId);
    const edge = edges[handleId];
    return edge?.style?.stroke;
  };

  return (
    <>
      {response.props?.options?.map((option, index) => (
        <div key={`${option.id}`}>
          <ResponseButton
            className={classes.focusable}
            style={{ borderColor: getColorByOptionId(option.id) }}
            label={option.title || `Option ${index + 1}`}
            selected={selectedItem.selectedOptionId === option.id}
            onClick={() => {
              dispatch(
                actions.setSelectedToOption({
                  blockId,
                  componentId: response.id,
                  optionId: option.id,
                }),
              );
            }}
          />
          <DiagramHandle
            blockId={blockId}
            disabled={
              selectedItem.selectedType !== SelectedType.Option ||
              selectedItem.selectedOptionId !== option.id
            }
            id={getHandleId(option.id)}
            position={Position.Right}
            type={'source'}
          />
        </div>
      ))}
    </>
  );
};

const getHeaderColorByType = (type?: BlockTypes) => {
  switch (type) {
    case BlockTypes.API:
      return '#006ae6';
    case BlockTypes.List:
      return '#e60068';
    default:
      return '#6e00e6';
  }
};
