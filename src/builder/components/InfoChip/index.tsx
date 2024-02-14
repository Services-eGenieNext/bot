/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { MouseEventHandler } from 'react';
import { Chip } from '@material-ui/core';
import clsx from 'clsx';
import { useStyles } from './styles';

export type InfoChipProps = {
  className?: string;
  label: string;
  color: string;
  onClick?: MouseEventHandler;
};

const InfoChip: React.FC<InfoChipProps> = props => {
  const { label, className, onClick, color } = props;
  const classes = useStyles({ color });

  return (
    <Chip
      className={clsx(className, classes.infoChip)}
      icon={<span className={classes.colorChip} />}
      label={label}
      clickable
      variant="outlined"
      onDelete={() => 0}
      deleteIcon={<span className={classes.viewLabel}>View</span>}
      onClick={onClick}
    />
  );
};

export default InfoChip;
