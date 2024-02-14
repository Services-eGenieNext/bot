/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { castDraft, Immutable } from 'immer';
import last from 'lodash/last';
import nth from 'lodash/nth';
import mapValues from 'lodash/mapValues';
import {
  AnswerData,
  AnswerValue,
  Block,
  BlockTypes,
  Bot,
  BotsMap,
  isListBlock,
} from 'shared/types';
import { emitEvent, getObjectValues, logger } from 'shared/utils';
import { AnswersState, BotUiState } from 'user-ui/features/state';
import { getSerializedResponse } from 'user-ui/lib/serialize';
import { replaceVariablesWithValues } from 'user-ui/lib/variables';
import {
  findFirstBlock,
  getBlock,
  getComponents,
  isBlockRefEqual,
  isViewableBlock,
} from './blocks';
import { getNext } from './next';
import {
  BlockAnswer,
  BlockReference,
  ChapterData,
  QuestionAnswer,
  SequenceInfo,
  SerializedAnswer,
  SerializedVariable,
} from './types';

export const getPreviousBlockRef = (
  state: Immutable<BotUiState>,
  bRef: BlockReference,
): BlockReference | undefined => {
  const { answers, graph } = state;
  const blockNode = graph[bRef.blockId];

  if (!blockNode) {
    return;
  }
  const parentBlockIds = blockNode.parents.filter(
    pbRef => !!answers[pbRef.blockId],
  );

  const parentsSortedByDepth = parentBlockIds.sort((parentIdA, parentIdB) => {
    const a = graph[parentIdA.blockId]?.depth || 0;
    const b = graph[parentIdB.blockId]?.depth || 0;
    return b - a;
  });

  const parentBlockId = parentsSortedByDepth[0];
  if (parentBlockId && graph[parentBlockId.blockId]) {
    const { botId, blockId } = graph[parentBlockId.blockId]!;
    return { botId, blockId };
  }
};

export const getPreviousBlockAnswer = (
  state: Immutable<BotUiState>,
  bRef: BlockReference,
): Record<string, unknown> | AnswerValue[][] | string | undefined => {
  const { bots, answers, apiState } = state;
  const previousBlockRef = getPreviousBlockRef(state, bRef);
  const prevBlock = previousBlockRef && getBlock(bots, previousBlockRef);

  if (!previousBlockRef || !prevBlock) {
    return;
  }

  const prevApiStatus = apiState[prevBlock.id];
  if (prevApiStatus?.response) {
    return prevApiStatus.response.data;
  }

  const prevAnswers = answers[prevBlock.id];

  if (!prevAnswers || prevAnswers.length === 0) {
    return;
  }

  if (isListBlock(prevBlock)) {
    const sequenceInfo = createSequenceObject(state, previousBlockRef);
    const response = getSerializedResponse(sequenceInfo);
    return response?.answers;
  }

  const firstAnswer = getFirstAnswer(prevAnswers);
  return firstAnswer?.value;
};

export const createSequenceObject = (
  state: Immutable<BotUiState>,
  blockRef: BlockReference,
): SequenceInfo => {
  const { bots, validAnswers, answers, apiState } = state;
  const { botId, blockId } = blockRef;
  const block = getBlock(bots, { botId, blockId });
  const blockValidAnswers = validAnswers[blockId];
  const blockAnswers = answers[blockId];
  const skipped = Boolean(blockAnswers && blockAnswers.length === 0);
  const apiStatus = apiState[blockId];
  const bot = bots[botId];

  return castDraft({
    bot,
    block,
    apiStatus,
    answers: blockValidAnswers,
    skipped,
  });
};

export const getQuestionSequence = (
  state: Immutable<BotUiState>,
  includeLogical: boolean = false,
  _seq?: BlockReference[],
): SequenceInfo[] => {
  if (!_seq) {
    const firstInfo = findFirstBlock(state);
    if (firstInfo) {
      return getQuestionSequence(state, includeLogical, [firstInfo]);
    } else {
      return [];
    }
  } else {
    const bRef = last(_seq);
    const next = bRef && getNext(state, bRef);
    if (next) {
      return getQuestionSequence(state, includeLogical, [..._seq, next]);
    } else {
      const sequence: SequenceInfo[] = _seq.map(blockRef =>
        createSequenceObject(state, blockRef),
      );

      return includeLogical
        ? sequence
        : sequence.filter(({ block }) => isViewableBlock(block));
    }
  }
};

export const refreshPredefinedValues = (
  bots: BotsMap,
  answers: AnswersState,
  variables: SerializedVariable[],
): AnswersState => {
  return mapValues(answers, blockAnswers => {
    if (!blockAnswers) {
      return blockAnswers;
    }

    return blockAnswers.map(answer =>
      mapValues(answer, answerValue => {
        if (!answerValue || !answerValue.selectedOptionId) {
          return answerValue;
        }

        const { blockId, botId } = answerValue;
        const block = castDraft(getBlock(bots, { botId, blockId }));
        answerValue.displayText = getDisplayText(block, answerValue);
        return resolveVariableInAnswerValue(answerValue, variables);
      }),
    );
  });
};

export const resolveVariableInAnswerValue = (
  answerValue?: AnswerValue,
  variables?: SerializedVariable[],
): AnswerValue | undefined => {
  if (!answerValue || !answerValue.selectedOptionId || !variables) {
    return answerValue;
  }

  const displayText = replaceVariablesWithValues(
    answerValue.displayText,
    variables,
  );
  return {
    ...answerValue,
    displayText,
  };
};

export const getQuestionAnswer = (
  seq: SequenceInfo,
  variables?: SerializedVariable[],
): QuestionAnswer => {
  const { bot, block } = seq;

  const answers: BlockAnswer[] | undefined = seq.answers?.map(blockAnswer =>
    mapValues(blockAnswer, answerValue =>
      resolveVariableInAnswerValue(answerValue, variables),
    ),
  );

  const components = getComponents(block);
  const blockRef =
    bot?.id && block?.id ? { botId: bot?.id, blockId: block?.id } : undefined;
  const question = block?.text;
  const required = Boolean(block?.required);
  const firstAnswer: AnswerValue | undefined = castDraft(
    getFirstAnswer(answers),
  );
  const hasMultiAnswer = Boolean(answers && answers.length > 1);
  const hasMultiComponent = Boolean(components && components?.length > 1);
  const missingAnswer = !firstAnswer && getComponents(block).length > 0;

  return {
    ...seq,
    blockRef,
    question,
    required,
    firstAnswer,
    hasMultiAnswer,
    hasMultiComponent,
    missingAnswer,
  };
};

export const getDisplayText: (
  block?: Block,
  answer?: Partial<AnswerData>,
) => string = (
  block,
  { componentId, selectedOptionId, value, displayText } = {},
) => {
  if (displayText) {
    return displayText;
  } else if (block && componentId && selectedOptionId) {
    const component = getComponents(block).find(c => c.id === componentId);
    const option = component?.props?.options?.find(
      o => o.id === selectedOptionId,
    );
    const label = option?.title ?? value;
    return label ?? value ?? '';
  } else {
    return '';
  }
};

export const getListDisplayText = (
  block?: Block,
  answers: BlockAnswer[] = [],
): { question: string; answer: string }[][] => {
  const components = getComponents(block);
  return (
    answers.map(ans => {
      return components.map(comp => ({
        question: comp.props?.title ?? '',
        answer: ans[comp.id]?.displayText ?? '--',
      }));
    }) ?? []
  );
};

export const getChapterSequence = (
  sequence: SequenceInfo[],
  chapters: Bot[],
  chapterBased: boolean,
): Record<string, ChapterData> => {
  const parentBot = chapters.find(bot => bot.type === 'parent')!;
  const filteredSeq = sequence.filter(s => {
    return (
      s.skipped ||
      (isViewableBlock(s.block) && typeof s.answers !== 'undefined')
    );
  });

  if (!chapterBased) {
    return {
      null: {
        sequence: filteredSeq,
        bot: parentBot,
      },
    };
  }

  const entries: [string, ChapterData][] = chapters.map(bot => {
    const botId = bot.id;
    const botSeqs = filteredSeq.filter(s => s.bot?.id === botId);
    return [
      botId,
      {
        bot,
        sequence: botSeqs,
      },
    ];
  });

  return Object.fromEntries(entries);
};

export const isChapterCompleted = (
  sequence: SequenceInfo[],
  chapterBased: boolean,
  botId?: string,
) => {
  const lastInSeq = nth(sequence, -1);

  const exited =
    lastInSeq?.block?.type === BlockTypes.Finish &&
    lastInSeq?.bot?.type === 'parent';

  const allRequiredHasAnswers = sequence
    .filter(s => {
      const partOfTheBot = botId ? s.bot?.id === botId : true;
      return partOfTheBot && isViewableBlock(s.block);
    })
    .every(s => {
      const compLength = getComponents(s.block).length;
      const hasAnswer = s.answers
        ? Boolean(compLength > 0 ? s.answers.length : true)
        : false;
      return s.block?.required ? hasAnswer : true;
    });

  if (!allRequiredHasAnswers) {
    return false;
  } else if (!chapterBased || !botId) {
    return exited;
  }

  return !!sequence.find(
    s => s.bot?.id === botId && s.block?.type === BlockTypes.Finish,
  );
};

export const getRefFromSequence = (
  sequence?: SequenceInfo,
): BlockReference | undefined => {
  const botId = sequence?.bot?.id;
  const blockId = sequence?.block?.id;
  if (!botId || !blockId) {
    return;
  }
  return { botId, blockId };
};

export const findSequenceByBlockRef = (
  sequences: SequenceInfo[],
  blockRef: BlockReference,
): SequenceInfo | undefined => {
  return sequences.find(
    s => s.bot?.id === blockRef.botId && s.block?.id === blockRef.blockId,
  );
};

export const getFirstAnswer = <
  T extends Immutable<BlockAnswer[]> | BlockAnswer[],
>(
  answers: T | undefined,
): AnswerValue | undefined => {
  const firstAnswer = answers && answers[0];
  if (!firstAnswer) {
    return;
  }
  return castDraft(getObjectValues(firstAnswer))[0];
};

export const sanitizedAnswers = (
  serialized: SerializedAnswer[],
): SerializedAnswer[] => {
  const validAns = serialized.filter(
    sans =>
      sans.blockId &&
      sans.answers?.every(
        ans => Array.isArray(ans) && ans.every(ca => ca.componentId),
      ),
  );

  if (serialized.length !== validAns.length) {
    logger.warn(
      'part of the provided response data were invalid, threfore filtered out',
    );
  }

  return validAns;
};

export const findNextNeedAnswer = (
  sequence: SequenceInfo[],
  currentBlockRef?: BlockReference,
) => {
  const currentBlockIndex = sequence.findIndex(s => {
    const seqRef = getRefFromSequence(s);
    return isBlockRefEqual(currentBlockRef, seqRef);
  });
  const sliceIndex = currentBlockIndex === -1 ? 0 : currentBlockIndex;
  return sequence.slice(sliceIndex).find(s => {
    if (!isViewableBlock(s.block)) {
      return false;
    }

    return isBlockNotAnswered(s.block, s.answers);
  });
};

export const isBlockNotAnswered = (
  block?: Immutable<Block>,
  blockAnswers?: Immutable<BlockAnswer[]>,
) => {
  const blockComponents = getComponents(block);
  return (
    !blockAnswers || (blockAnswers.length === 0 && blockComponents.length > 0)
  );
};

export const emitAnswersUpdated = (
  state: Immutable<BotUiState>,
  blockRef: BlockReference,
) => {
  const sequenceInfo = createSequenceObject(state, blockRef);
  const serializedAnswer = getSerializedResponse(sequenceInfo);
  emitEvent('answersUpdated', {
    blockId: blockRef.blockId,
    response: serializedAnswer,
  });
};
