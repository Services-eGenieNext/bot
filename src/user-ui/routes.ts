/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { generatePath } from 'react-router-dom';
import { BlockReference } from './lib';

export const QUESTION_PAGE_ROUTE = '/:botId/:blockId';
export const OVERVIEW_PAGE_ROUTE = '/overview';

type OverviewParams = {};

export const getQuestionPagePath = (params: BlockReference) => {
  return generatePath(QUESTION_PAGE_ROUTE, params);
};

export const getOverviewPagePath = (params?: OverviewParams) => {
  return generatePath(OVERVIEW_PAGE_ROUTE, params);
};
