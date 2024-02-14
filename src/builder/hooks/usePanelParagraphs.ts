/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getSelectedBlock, getSelectedItem } from 'builder/features/selectors';
import { ParagraphBinding, SelectedType } from 'shared/types';

export const usePanelParagraphs = () => {
  const { selectedType, selectedOptionId } = useSelector(getSelectedItem);

  const selectedBlock = useSelector(getSelectedBlock);

  const paragraphs = useMemo(() => {
    if (
      !selectedBlock ||
      (selectedType !== SelectedType.Block &&
        selectedType !== SelectedType.Option)
    ) {
      return [];
    }

    if (selectedType === SelectedType.Option && selectedBlock.components) {
      const selectedResponseConf = selectedBlock.components
        .flatMap(res => res.props?.options)
        .find(opt => opt?.id === selectedOptionId);

      return selectedResponseConf?.paragraphs
        ? [...selectedResponseConf?.paragraphs]
        : [];
    }

    let responseParagraphs: ParagraphBinding[] = [];
    if (selectedBlock.components) {
      const responses = selectedBlock.components;
      responseParagraphs = responses
        .flatMap(res => res.props?.options)
        .flatMap(opt => (opt?.paragraphs ? opt.paragraphs : []));
    }

    const blockParagraphs = selectedBlock?.paragraphs ?? [];
    return [...blockParagraphs, ...responseParagraphs];
  }, [selectedBlock, selectedOptionId, selectedType]);

  return [paragraphs];
};
