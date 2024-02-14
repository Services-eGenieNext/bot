/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useLayoutEffect } from 'react';
import { Container } from 'react-bootstrap';
import QuestionFooter from 'user-ui/components/QuestionFooter';
import QuestionHeader from 'user-ui/components/QuestionHeader';
import { QuestionCad } from 'user-ui/containers/QuestionCard';
import { useCurrentBlock } from 'user-ui/hooks';
import { useNavigation } from 'user-ui/hooks/useNavigation';
import { useNavigationUpdate } from 'user-ui/hooks/useNavigationUpdate';
import { isLogicalBlock } from 'user-ui/lib';

const QuestionPage: FC = () => {
  useNavigationUpdate();

  const currentBlock = useCurrentBlock();

  const {
    handlePrevious,
    handleNext,
    handleSkip,
    nextDisabled,
    skipDisabled,
    backDisabled,
  } = useNavigation();

  useLayoutEffect(() => {
    if (isLogicalBlock(currentBlock)) {
      handleNext();
    }
  }, [currentBlock, handleNext]);

  return (
    <Container>
      <QuestionHeader />
      <QuestionCad onNext={handleNext} nextDisabled={nextDisabled} />
      <QuestionFooter
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        skipDisabled={skipDisabled}
        backDisabled={backDisabled}
      />
    </Container>
  );
};

export default QuestionPage;
