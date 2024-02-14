/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { ApiTemplate, Block, ResponseComponent } from 'shared/types';
import { logger } from 'shared/utils';
import { useStyles } from '../../styles';
import FreeSpeechOption from './FreeSpeechOption';
import PredefinedOption from './PredefinedOption';

type ResponseOptionsProps = {
  block: Block;
  response?: ResponseComponent;
  apiTemplate?: ApiTemplate;
};

const SingleResponseProperties: FC<ResponseOptionsProps> = props => {
  const { block, response, apiTemplate } = props;

  if (!response) {
    logger.error(
      'SingleResponseProperties get undefined response component in props',
    );
    return null;
  }

  const isResponseReadOnly = apiTemplate
    ? !apiTemplate.component.editable
    : false;
  return (
    <ResponsePanel
      block={block}
      response={response}
      readOnly={isResponseReadOnly}
    />
  );
};

export default SingleResponseProperties;

export type OptionsProps = {
  block: Block;
  readOnly?: boolean;
  response: ResponseComponent;
};

const ResponsePanel: FC<OptionsProps> = props => {
  const { block, response, readOnly } = props;
  const classes = useStyles();

  return (
    <>
      <div className={classes.panelSection}>
        <PredefinedOption
          block={block}
          response={response}
          readOnly={!!readOnly}
        />
      </div>
      <div className={classes.panelSectionAttached}>
        <FreeSpeechOption
          block={block}
          response={response}
          readOnly={!!readOnly}
        />
      </div>
    </>
  );
};
