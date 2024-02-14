/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAnswerSequence } from 'user-ui/features/answers/selectors';
import { getFirstBlock } from 'user-ui/features/bots/selectors';
import { getNavNext } from 'user-ui/features/navigation/selectors';
import { actions } from 'user-ui/features/slice';
import { useCurrentBlockRef } from 'user-ui/hooks/useCurrentBlock';
import {
  BlockReference,
  findNextNeedAnswer,
  findSequenceByBlockRef,
  getRefFromSequence,
  isBlockRefEqual,
  redirectToQuestion,
  LinkState,
} from 'user-ui/lib';

export const useNavigationUpdate = () => {
  const dispatch = useDispatch();
  const history = useHistory<LinkState | undefined>();
  const firstBlock = useSelector(getFirstBlock);
  const currBlock = useCurrentBlockRef();
  const nextRef = useSelector(getNavNext);
  const sequence = useSelector(getAnswerSequence);

  const needAnswerRef: BlockReference | undefined = useMemo(() => {
    const seq = findNextNeedAnswer(sequence, currBlock);
    return getRefFromSequence(seq);
  }, [currBlock, sequence]);

  const currBlockAnswered = useMemo(() => {
    return !!(
      currBlock && findSequenceByBlockRef(sequence, currBlock)?.answers
    );
  }, [currBlock, sequence]);

  useLayoutEffect(() => {
    currBlock && dispatch(actions.setCurrent(currBlock));
  }, [currBlock, dispatch]);

  useLayoutEffect(() => {
    if (!currBlock) {
      firstBlock && redirectToQuestion(firstBlock, true);
    } else if (nextRef && !isBlockRefEqual(nextRef, currBlock)) {
      redirectToQuestion(nextRef);
    } else if (
      !currBlockAnswered &&
      needAnswerRef &&
      !isBlockRefEqual(needAnswerRef, currBlock)
    ) {
      redirectToQuestion(needAnswerRef, true);
    }
  }, [
    currBlock,
    currBlockAnswered,
    firstBlock,
    history,
    needAnswerRef,
    nextRef,
  ]);
};
