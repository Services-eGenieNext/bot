/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { createSelector } from '@reduxjs/toolkit';
import { Block, RootState } from 'shared/types';
import { getQuestionSequence, getSerializedVariables } from 'user-ui/lib';
import { initialState } from '../state';

const selectDomain = (state: RootState) => state.botUi || initialState;

export const getVariables = createSelector([selectDomain], state => {
  return getSerializedVariables(state);
});

export const getSettlementVariablesSum = createSelector(
  [selectDomain],
  (state): { [settlementVariable: string]: number } => {
    return getQuestionSequence(state, true)
      .map(s => s.block)
      .filter((b): b is Block => !!b)
      .flatMap(block => {
        const answers = state.answers[block.id];

        return (
          block.components
            ?.filter(comp => {
              const validation = comp.props?.validation;
              return (
                validation?.type === 'settlement' &&
                validation?.settlementVariable
              );
            })
            .flatMap(comp => {
              const validation = comp.props!.validation!;
              const settlementVariable = validation.settlementVariable!;
              const sum =
                answers
                  ?.map(ans => ans[comp.id]?.value)
                  .filter((v): v is string => !!v)
                  .reduce((acc, v) => acc + Number(v || 0), 0) || 0;
              return { settlementVariable, sum };
            }) ?? []
        );
      })
      .reduce((acc, v) => {
        acc[v.settlementVariable] = (acc[v.settlementVariable] || 0) + v.sum;
        return acc;
      }, {} as { [settlementVariable: string]: number });
  },
);
