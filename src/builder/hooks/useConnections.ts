/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getSelectedItem, getSelectedBlock } from 'builder/features/selectors';
import { OutgoingBlock, SelectedType } from 'shared/types';

export const useConnections = () => {
  const { selectedType, selectedBlockId, selectedOptionId } =
    useSelector(getSelectedItem);

  const selectedBlock = useSelector(getSelectedBlock);

  const connections: OutgoingBlock[] = useMemo(() => {
    if (
      !selectedBlockId ||
      (selectedType !== SelectedType.Block &&
        selectedType !== SelectedType.Option)
    ) {
      return [];
    }

    if (
      selectedType === SelectedType.Option &&
      selectedBlock &&
      selectedBlock.components
    ) {
      const selectedResponseConf = selectedBlock.components
        .flatMap(res => res.props?.options)
        .find(opt => opt?.id === selectedOptionId);
      return selectedResponseConf?.next ? [selectedResponseConf?.next] : [];
    }

    let responseConnections: OutgoingBlock[] = [];
    if (selectedBlock && selectedBlock.components) {
      const responses = selectedBlock.components;
      responseConnections = responses
        .flatMap(res => res.props?.options)
        .map(opt => opt?.next)
        .filter((x): x is OutgoingBlock => !!x);
    }

    const blockConnection = selectedBlock?.next ? [selectedBlock?.next] : [];
    return [...blockConnection, ...responseConnections];
  }, [selectedBlock, selectedBlockId, selectedOptionId, selectedType]);

  return [connections];
};
