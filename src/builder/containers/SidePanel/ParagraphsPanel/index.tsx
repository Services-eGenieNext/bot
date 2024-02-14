/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import InfoChip from 'builder/components/InfoChip';
import ResponseButton from 'builder/components/ResponseButton';
import { usePanelParagraphs } from 'builder/hooks/usePanelParagraphs';
import {
  getBlocks,
  getSelectedItem,
  getSelectedParagraphs,
} from 'builder/features/selectors';
import { useModuleContext } from 'shared/context';
import { SelectedType } from 'shared/types';

import { useStyles } from './styles';

const ParagraphsPanel: FC = () => {
  const classes = useStyles();
  const [paragraphs] = usePanelParagraphs();
  const { emitter } = useModuleContext();
  const selectedItem = useSelector(getSelectedItem);
  const selectedParagraphs = useSelector(getSelectedParagraphs);
  const blocks = useSelector(getBlocks);

  const triggerParagraphEvent = (eventType: string, eventData?: any) => {
    const blockId = selectedItem.selectedBlockId!;
    const block = blocks[blockId];
    const optionInfo = selectedItem.selectedType !== SelectedType.Block && {
      componentId: selectedItem.selectedComponentId,
      optionId: selectedItem.selectedOptionId,
    };

    const event = eventData ?? {
      type: selectedItem.selectedType,
      botId: selectedItem.selectedBotId,
      blockId,
      block,
      ...optionInfo,
      paragraphs: selectedParagraphs ?? [],
    };

    emitter.emit(eventType, event);
  };

  return (
    <div className={classes.panelSection}>
      <div className={classes.panelTitle}>Agreement Paragraph Trigger</div>
      <div className={classes.paragraphsList}>
        {paragraphs?.length ? (
          paragraphs.map((p, index) => (
            <InfoChip
              key={index}
              color={p.color}
              label={p.title}
              onClick={() => {
                triggerParagraphEvent('paragraphClicked', p);
              }}
            />
          ))
        ) : (
          <div className={classes.notFound}>No paragraph trigger found</div>
        )}
      </div>
      <div className={classes.actionButtons}>
        <ResponseButton
          onClick={() => triggerParagraphEvent('paragraphAddClicked')}
          buttonVariant={'add'}
          label={'+ Add Paragraph'}
          fullWidth
        />
        <ResponseButton
          onClick={() => triggerParagraphEvent('paragraphCreateClicked')}
          buttonVariant={'add'}
          label={'+ Create New Paragraph'}
          fullWidth
        />
      </div>
    </div>
  );
};

export default ParagraphsPanel;
