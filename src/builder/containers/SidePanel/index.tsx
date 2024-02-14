/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { Avatar, Grid } from '@material-ui/core';
import { BullseyePointerIcon } from 'shared/icons';
import { SidePanelTabs } from './SidePanelTabs';
import { useStyles } from './styles';

const SidePanel: FC = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      component={'aside'}
      direction="row"
      alignContent={'space-between'}
      className={classes.sidePanel}
    >
      <Grid item xs={12} className={classes.sidePanelMain}>
        <SidePanelTabs />
      </Grid>
    </Grid>
  );
};

export default SidePanel;

export const EmptyPanel: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      alignContent={'center'}
      justify={'center'}
      style={{ height: '100%' }}
    >
      <Grid item>
        <Avatar className={classes.emptyIconAvatar}>
          <BullseyePointerIcon colorVariant={'primary'} size={'1em'} />
        </Avatar>
      </Grid>
      <Grid item className={classes.emptyPanelMessage}>
        Click on any block or element to view it’s property.
      </Grid>
    </Grid>
  );
};
