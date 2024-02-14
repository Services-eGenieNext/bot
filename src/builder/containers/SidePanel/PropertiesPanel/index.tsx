/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { ComponentType, FC } from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { BlockTypes, SelectedType } from 'shared/types';
import { getSelectedBlock, getSelectedType } from 'builder/features/selectors';
import useHandleChange from 'builder/containers/SidePanel/PropertiesPanel/GenericBlockProperties/hooks/useHandlePropertiesChange';
import GenericBlockProperties from 'builder/containers/SidePanel/PropertiesPanel/GenericBlockProperties';
import BlockIdIndicator from 'builder/components/BlockIdIndicator';
import ReadMoreProperties from 'builder/containers/SidePanel/PropertiesPanel/ReadMoreProperties';
import TextMessageProperties from 'builder/containers/SidePanel/PropertiesPanel/TextMessageProperties';
import { EmptyPanel } from 'builder/containers/SidePanel';
import Toggle from 'builder/components/Toggle';
import { isViewableBlock } from 'user-ui/lib';
import ConditionBlockProperties from './ConditionBlockProperties';
import OutletBlockProperties from './OutletBlockProperties';
import ResponseProperties from './ResponseProperties';
import OptionProperties from './ResponseProperties/OptionProperties';
import TriggerBlockProperties from './TriggerBlockProperties';
import { useStyles } from './styles';

const PropertiesPanel: FC = () => {
  const selectedType = useSelector(getSelectedType);
  const selectedBlock = useSelector(getSelectedBlock);

  if (!selectedBlock) {
    return <EmptyPanel />;
  }

  let TabComponent: ComponentType;

  switch (selectedType) {
    case SelectedType.Block:
      TabComponent = BlockPropertiesPanel;
      break;
    case SelectedType.Response:
      TabComponent = ResponseProperties;
      break;
    case SelectedType.Option:
      TabComponent = OptionProperties;
      break;
    case SelectedType.ReadMoreContent:
      TabComponent = ReadMoreProperties;
      break;
    case SelectedType.TextMessage:
      TabComponent = TextMessageProperties;
      break;
    default:
      TabComponent = EmptyPanel;
  }

  return <TabComponent />;
};

export default PropertiesPanel;

const BlockPropertiesPanel: FC = () => {
  const classes = useStyles();
  const selectedBlock = useSelector(getSelectedBlock);
  const handleChange = useHandleChange(selectedBlock);

  let TabProperties;
  switch (selectedBlock?.type) {
    case BlockTypes.API:
    case BlockTypes.Text:
    case BlockTypes.List:
    case BlockTypes.Presentation:
    case BlockTypes.GDPR:
      TabProperties = GenericBlockProperties;
      break;
    case BlockTypes.Outlet:
      TabProperties = OutletBlockProperties;
      break;
    case BlockTypes.Condition:
      TabProperties = ConditionBlockProperties;
      break;
    case BlockTypes.Trigger:
      TabProperties = TriggerBlockProperties;
      break;
    default:
      return <EmptyPanel />;
  }

  return (
    <Grid
      container
      alignContent={'space-between'}
      direction={'row'}
      className={classes.panelGridContainer}
    >
      <Grid item xs={12}>
        <TabProperties />
      </Grid>
      <Grid item xs={12}>
        {isViewableBlock(selectedBlock) && (
          <Toggle
            className={classes.requiredToggle}
            name={'setRequired'}
            labelText={'Required'}
            onChange={handleChange}
            checked={selectedBlock?.required}
          />
        )}
        <BlockIdIndicator
          blockId={selectedBlock?.id ?? ''}
          className={classes.blockIdIndicator}
        />
      </Grid>
    </Grid>
  );
};
