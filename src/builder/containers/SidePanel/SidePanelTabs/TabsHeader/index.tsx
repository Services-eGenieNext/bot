/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Tab, Tabs, Tooltip } from '@material-ui/core';
import { actions } from 'builder/features/slice';
import ParagraphColors from 'builder/components/ParagraphColors';
import { usePanelParagraphs } from 'builder/hooks/usePanelParagraphs';
import {
  getSelectedBlock,
  getSelectedTabIndex,
  getSelectedType,
  getSelectedResponse,
} from 'builder/features/selectors';
import {
  FolderTreeIcon,
  LongArrowLeftIcon,
  ParagraphRtlIcon,
  ToolboxIcon,
} from 'shared/icons';
import { ComponentType, SelectedType } from 'shared/types';
import { useStyles } from '../styles';

export const useTabsHeader: () => [FC, number, (number) => void] = () => {
  const selectedType = useSelector(getSelectedType);
  const selectedBlock = useSelector(getSelectedBlock);
  const selectedResponse = useSelector(getSelectedResponse);
  const selectedTabIndex = useSelector(getSelectedTabIndex);

  const [tabIndex, _setTabIndex] = React.useState(0);
  const [paragraphs] = usePanelParagraphs();
  const dispatch = useDispatch();

  const setTabIndex = useCallback(
    (index: number) => {
      const newIndex = index >= 0 ? index : 0;
      _setTabIndex(newIndex);
      dispatch(actions.setSelectedTabIndex(newIndex));
    },
    [dispatch],
  );

  const showCloseButton = selectedType !== SelectedType.Block;

  const enableConnParagraphTabs = useMemo(() => {
    const blockResponseType = selectedResponse?.type;

    return (
      selectedType === SelectedType.Block ||
      (selectedType === SelectedType.Option &&
        blockResponseType === ComponentType.Predefined)
    );
  }, [selectedResponse?.type, selectedType]);

  useEffect(() => {
    _setTabIndex(selectedTabIndex);
  }, [selectedTabIndex]);

  const classes = useStyles();
  const TabHeader: FC = () => (
    <Tabs
      classes={{
        indicator: classes.tabIndicator,
      }}
      value={tabIndex}
      onChange={(event, newValue) => setTabIndex(newValue)}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
    >
      {showCloseButton && (
        <Tab
          className={classes.tabButton}
          value={-1}
          onClick={() =>
            dispatch(actions.setSelectedToBlock(selectedBlock?.id!))
          }
          icon={
            <Tooltip title="Back to Block">
              <div>
                <LongArrowLeftIcon className={classes.tabIcon} />
              </div>
            </Tooltip>
          }
        />
      )}
      <Tab
        className={classes.tabButton}
        value={0}
        icon={
          <Tooltip title="Properties">
            <div>
              <ToolboxIcon className={classes.tabIcon} />
            </div>
          </Tooltip>
        }
      />
      <Tab
        className={classes.tabButton}
        value={1}
        disabled={!enableConnParagraphTabs}
        icon={
          <Tooltip title="Connections">
            <div>
              <FolderTreeIcon className={classes.tabIcon} />
            </div>
          </Tooltip>
        }
        textColor={'secondary'}
      />
      <Tab
        className={classes.tabButton}
        value={2}
        disabled={!enableConnParagraphTabs}
        icon={
          <Tooltip title="Paragraphs">
            <Badge
              badgeContent={
                <ParagraphColors variant={'dot'} paragraphs={paragraphs} />
              }
            >
              <div>
                <ParagraphRtlIcon flipX className={classes.tabIcon} />
              </div>
            </Badge>
          </Tooltip>
        }
      />
    </Tabs>
  );
  return [TabHeader, tabIndex, setTabIndex];
};
