/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Location } from 'history';
import {
  AnswerValue,
  ApiResponse,
  ApiStatus,
  Block,
  BlockTypes,
  Bot,
  PartialRecord,
} from 'shared/types';
import { AnswersState, ApiState } from 'user-ui/features/state';

export type BlockReference = { botId: string; blockId: string };

export type BlockAnswer = { [componentId: string]: AnswerValue | undefined };

export type SequenceInfo = {
  bot?: Bot;
  block?: Block;
  apiStatus?: ApiStatus;
  answers?: BlockAnswer[];
  skipped: boolean;
};

export type SerializedAnswer = {
  botId: string;
  blockId: string;
  blockType: BlockTypes;
  numberOfAnswers: number;
  numberOfComponents: number;
  answers: AnswerValue[][];
  apiResponse?: ApiResponse;
};

export type SerializedVariable = {
  name: string;
  value: string | any[] | unknown | null;
};

export type SerializedSubmitData = {
  responses: SerializedAnswer[];
  variables: SerializedVariable[];
  paragraphIds: string[];
};

export type DeserializedAnswers = {
  answers: AnswersState;
  apiState: ApiState;
};

export type QuestionAnswer = SequenceInfo & {
  blockRef: BlockReference | undefined;
  question?: string;
  required: boolean;
  firstAnswer?: AnswerValue;
  hasMultiAnswer: boolean;
  hasMultiComponent: boolean;
  missingAnswer: boolean;
};

export type ChapterData = {
  bot: Bot;
  sequence: SequenceInfo[];
};

export type LinkState = {
  editing?: boolean;
  resumed?: boolean;
  referrer?: Location<LinkState>;
};

export type VariableType = 'global' | 'user';

export type AddVariablePayload = {
  variableType: VariableType;
  variables: PartialRecord<string, unknown>;
};

export type SetVariablePayload = {
  global: PartialRecord<string, string>;
  user: PartialRecord<string, string>;
};
