/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { useStyles } from './styles';

export interface BlockContentDividerProps {
  title: string;
}

const BlockContentDivider: FC<BlockContentDividerProps> = props => {
  const { title } = props;
  const classes = useStyles();
  return (
    <>
      <div className={classes.separator} />
      <div className={classes.title}>{title}</div>
    </>
  );
};

export default BlockContentDivider;
