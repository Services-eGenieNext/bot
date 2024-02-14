/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import clsx from 'clsx';
import React, {
  FC,
  ReactEventHandler,
  SyntheticEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { useLocales } from 'shared/hooks';
import {
  Block,
  BlockTypes,
  ComponentType,
  isApiBlock,
  isGDPRBlock,
  isPresentationBlock,
} from 'shared/types';
import { logger } from 'shared/utils';
import ActionButton from 'user-ui/components/ActionButton';
import ReadMoreSection from 'user-ui/components/ReadMoreSection';
import BlockRenderer from 'user-ui/containers/BlockRenderer';
import { getApiStatus } from 'user-ui/features/api/selectors';
import { actions } from 'user-ui/features/slice';
import { useCurrentBlock, useCurrentBlockRef } from 'user-ui/hooks';
import { BlockReference, getComponents } from 'user-ui/lib';
import { QuestionCardHeader } from './components/QuestionCardHeader';
import classes from './styles.module.scss';

type QuestionCardProps = {
  onNext: ReactEventHandler;
  nextDisabled?: boolean;
};

export const QuestionCad: FC<QuestionCardProps> = props => {
  const { translate } = useLocales();

  const { onNext, nextDisabled } = props;
  const dispatch = useDispatch();
  const _blockRef = useCurrentBlockRef();
  const _block = useCurrentBlock();

  const [[block, blockRef], setBlock] = useState<
    [Block | undefined, BlockReference | undefined]
  >([_block, _blockRef]);

  const apiStatus = useSelector(state =>
    getApiStatus(state, blockRef?.blockId),
  );

  const [inProp, setInProp] = useState(false);
  const [triggerNextButtonEvent, setTriggerNextButtonEvent] =
    useState<SyntheticEvent<Element> | null>(null);

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const transitionTimeout = 300;

  useLayoutEffect(() => {
    setInProp(false);

    const timerId = setTimeout(() => {
      setInProp(true);
      setBlock([_block, _blockRef]);
    }, transitionTimeout);

    return () => clearTimeout(timerId);
  }, [_block, _blockRef]);

  useLayoutEffect(() => {
    return () => {
      inputRefs.current = [];
    };
  }, [block]);

  const handleValidate: () => boolean = useCallback(() => {
    return inputRefs?.current?.every(x => x.reportValidity());
  }, []);

  useEffect(() => {
    if (apiStatus?.error) {
      window.alert(apiStatus.error);
    }
  }, [apiStatus?.error]);

  const isApiCallable: boolean = useMemo(() => {
    return Boolean(
      block &&
        isApiBlock(block) &&
        block.api.endpoint &&
        (apiStatus?.loading || !apiStatus?.response || apiStatus.error),
    );
  }, [apiStatus, block]);

  const callApi = useCallback((): boolean => {
    const valid = handleValidate();
    if (isApiCallable && valid) {
      dispatch(actions.callApi({ blockRef }));
      return true;
    }
    return false;
  }, [blockRef, dispatch, handleValidate, isApiCallable]);

  const handleNext = useCallback(
    event => {
      const valid = handleValidate();

      if (!valid || !block) {
        logger.debug('answer is not valid or block was undefined', {
          valid,
          block,
        });
        return;
      }

      if (!nextDisabled && blockRef) {
        if (isApiCallable) {
          dispatch(actions.callApi({ blockRef }));
          return;
        }

        dispatch(actions.setAnswersAsValid(blockRef));
        onNext(event);
      }
    },
    [
      block,
      blockRef,
      dispatch,
      handleValidate,
      isApiCallable,
      nextDisabled,
      onNext,
    ],
  );

  const handleKeyPress = useCallback(
    event => {
      if (event.code === 'Enter') {
        if (callApi()) {
          return;
        }
        handleNext(event);
      }
    },
    [callApi, handleNext],
  );

  const showNextButton = useMemo(() => {
    if (!block) return false;
    const component = getComponents(block)[0];
    return component?.type !== ComponentType.Predefined;
  }, [block]);

  useEffect(() => {
    if (!nextDisabled && !!triggerNextButtonEvent) {
      handleNext(triggerNextButtonEvent);
      setTriggerNextButtonEvent(null);
    }
  }, [handleNext, nextDisabled, triggerNextButtonEvent]);

  const handleClick = useCallback(
    event => {
      if (showNextButton) return;
      setTimeout(() => {
        setTriggerNextButtonEvent(event);
      }, 50);
    },
    [showNextButton],
  );

  const nextButtonTitle = useMemo(() => {
    if (block && isPresentationBlock(block)) {
      return block.configs.buttonTitle || translate('buttons.start');
    }

    switch (block?.type) {
      case BlockTypes.List:
        return translate('buttons.finish');
      default:
        return translate('buttons.next');
    }
  }, [block, translate]);

  if (!block) {
    return null;
  }

  return (
    <div className={classes.questionCard}>
      <CSSTransition
        in={inProp}
        nodeRef={nodeRef}
        timeout={transitionTimeout}
        mountOnEnter={true}
        classNames="card-effect"
      >
        <>
          <Card ref={nodeRef}>
            <QuestionCardHeader block={block} />
            <Card.Body>
              <BlockRenderer
                blockRef={blockRef}
                inputRefs={inputRefs}
                onValidate={handleValidate}
                onKeyPress={handleKeyPress}
                onClick={handleClick}
              />
              <>
                {!isGDPRBlock(block) && (
                  <ReadMoreSection block={block} minified={true} />
                )}
              </>

              {showNextButton && (
                <ActionButton
                  className={clsx(classes.questionNextBtn)}
                  title={nextButtonTitle}
                  disabled={nextDisabled}
                  onClick={handleNext}
                  loading={apiStatus?.loading}
                />
              )}
            </Card.Body>
          </Card>

          {isGDPRBlock(block) && (
            <ReadMoreSection block={block} minified={true} />
          )}
        </>
      </CSSTransition>

      <div className={clsx(classes.shadowContainer)}>
        <div className={classes.shadowLayer2} />
        <div className={classes.shadowLayer1} />
      </div>
    </div>
  );
};
