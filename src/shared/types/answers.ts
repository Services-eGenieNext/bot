/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

export type AnswerId = { botId: string; blockId: string };

export type AnswerData = {
  componentId: string;
  value?: string;
  selectedOptionId?: string;
  displayText: string;
};

export type AnswerValue = AnswerId & AnswerData;

export type AnswerChangeHandler = (answerData: AnswerData) => void;
