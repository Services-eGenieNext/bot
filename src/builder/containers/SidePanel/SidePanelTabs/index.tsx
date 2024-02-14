/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import { getSelectedType } from 'builder/features/selectors';
import ConnectionsPanel from 'builder/containers/SidePanel/ConnectionsPanel';
import ParagraphsPanel from 'builder/containers/SidePanel/ParagraphsPanel';
import PropertiesPanel from 'builder/containers/SidePanel/PropertiesPanel';
import theme from 'shared/styles/theme';
import { SelectedType } from 'shared/types';
import { useStyles } from './styles';
import { useTabsHeader } from './TabsHeader';

export const SidePanelTabs: FC = () => {
  const selectedType = useSelector(getSelectedType);
  const classes = useStyles();

  const [TabsHeader, tabIndex, setTabIndex] = useTabsHeader();

  const handleChangeIndex = index => {
    setTabIndex(index);
  };
  return (
    <>
      {selectedType !== SelectedType.Bot && (
        <div className={classes.sidePanelBar}>
          <TabsHeader />
        </div>
      )}
      <SwipeableViews
        axis={'x'}
        index={tabIndex}
        onChangeIndex={handleChangeIndex}
        style={{ height: '100%', width: '100%' }}
        containerStyle={{
          height: `calc(100% - ${theme.customs.toolbarHeight}px)`,
        }}
      >
        <TabPanel value={tabIndex} index={1}>
          <PropertiesPanel />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <ConnectionsPanel />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <ParagraphsPanel />
        </TabPanel>
      </SwipeableViews>
    </>
  );
};

export type TabPanelProps = JSX.IntrinsicElements['div'] & {
  index?: number;
  value: any;
};

export const TabPanel: React.FC<TabPanelProps> = props => {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div
      className={classes.tabPanel}
      role="tabpanel"
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
};
