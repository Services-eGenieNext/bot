/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useSelector } from 'react-redux';
import { Block } from 'shared/types';
import { getSettlementVariablesSum } from 'user-ui/features/variables/selectors';
import { translate } from 'shared/locales/i18n';

export const useCheckBlockForError = (block?: Block): string | undefined => {
  const settlementVariablesSum = useSelector(getSettlementVariablesSum);

  return getSettlementError(block, settlementVariablesSum);
};

export const useChapterHasError = (blocks: (Block | undefined)[]): boolean => {
  const settlementVariablesSum = useSelector(getSettlementVariablesSum);
  return blocks.some(b => {
    return !!getSettlementError(b, settlementVariablesSum);
  });
};

const getSettlementError = (
  block: Block | undefined,
  settlementVariablesSum: { [v: string]: number },
) => {
  if (!block?.components) {
    return;
  }

  const settlementValues =
    block.components
      .map(component => {
        const settlementVariable =
          component?.props?.validation?.settlementVariable;
        return settlementVariablesSum[settlementVariable!];
      })
      .filter((x): x is number => !!x) ?? [];

  const value = settlementValues.find(v => v > 100 || v < 100);

  if (value !== undefined) {
    if (value < 100) {
      return translate('validations.not_accounted_all');
    } else if (value > 100) {
      return translate('validations.more_than_full');
    }
  }

  return;
};
