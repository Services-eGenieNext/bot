/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import PresentationSettings from 'builder/containers/SidePanel/PropertiesPanel/GenericBlockProperties/components/PresentationSettings';
import { useModuleContext } from 'shared/context';
import InputField from 'builder/components/InputField';
import TextPreview from 'builder/components/TextPreview';
import Toggle from 'builder/components/Toggle';
import {
  getSelectedBlock,
  getSelectedResponse,
} from 'builder/features/selectors';
import { actions } from 'builder/features/slice';
import { BookIcon } from 'shared/icons';
import {
  ApiTemplate,
  Block,
  isApiBlock,
  isListBlock,
  isPresentationBlock,
} from 'shared/types';
import { getReadMoreExcerpt } from 'shared/utils/blocks';
import { useStyles } from '../styles';
import APISettings from './components/APISettings';
import ApiTemplateSelect from './components/ApiTemplateSelect';
import SingleResponseProperties from './components/SingleResponseProperties';
import MultiResponseProperties from './components/MultiResponseProperties';
import useHandleChange from './hooks/useHandlePropertiesChange';

const GenericBlockProperties: FC = () => {
  const classes = useStyles();
  const { options } = useModuleContext();
  const dispatch = useDispatch();
  const selectedBlock = useSelector(getSelectedBlock);

  const handleChange = useHandleChange(selectedBlock);

  if (!selectedBlock) {
    return null;
  }

  const templatedId = isApiBlock(selectedBlock)
    ? selectedBlock.templateId
    : undefined;

  const blockApiTemplate = templatedId
    ? options.apiTemplates.find(t => t.id === templatedId)
    : undefined;

  const readMore = selectedBlock.readMore;

  return (
    <>
      <div className={clsx(classes.panelSection)}>
        <InputField
          name={'blockTitle'}
          label={'Block Name'}
          placeholder={'Block Title'}
          value={selectedBlock.title ?? ''}
          onChange={handleChange}
        />
        {isApiBlock(selectedBlock) && (
          <ApiTemplateSelect
            name={'templateChanged'}
            apiTemplates={options.apiTemplates}
            onChange={handleChange}
            templateId={templatedId}
          />
        )}
      </div>
      <div className={classes.panelSection}>
        <Toggle
          name={'enableReadMore'}
          labelText={'Read more content'}
          icon={<BookIcon />}
          onChange={handleChange}
          checked={readMore?.enabled}
        />
        {readMore?.enabled && (
          <TextPreview
            text={getReadMoreExcerpt(selectedBlock)}
            lines={3}
            onClick={() =>
              dispatch(actions.setSelectedToReadMore(selectedBlock.id))
            }
          />
        )}
      </div>
      {isApiBlock(selectedBlock) && (
        <APISettings block={selectedBlock} apiTemplate={blockApiTemplate} />
      )}
      {isPresentationBlock(selectedBlock) && (
        <PresentationSettings block={selectedBlock} />
      )}
      <ResponseProperties
        selectedBlock={selectedBlock}
        blockApiTemplate={blockApiTemplate}
      />
    </>
  );
};

export default GenericBlockProperties;

const ResponseProperties: FC<{
  selectedBlock: Block;
  blockApiTemplate?: ApiTemplate;
}> = props => {
  const { selectedBlock, blockApiTemplate } = props;
  const selectedResponse = useSelector(getSelectedResponse);

  if (isPresentationBlock(selectedBlock)) {
    return null;
  }

  return isListBlock(selectedBlock) ? (
    <MultiResponseProperties block={selectedBlock} />
  ) : (
    <SingleResponseProperties
      response={
        selectedResponse ??
        (selectedBlock?.components && selectedBlock?.components[0])
      }
      block={selectedBlock}
      apiTemplate={blockApiTemplate}
    />
  );
};
