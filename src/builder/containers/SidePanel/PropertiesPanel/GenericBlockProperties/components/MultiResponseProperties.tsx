/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { ClipboardListCheckIcon } from 'shared/icons';
import { Block } from 'shared/types';
import Toggle from 'builder/components/Toggle';
import MultipleComponentPreview from 'builder/components/MultipleComponentPreview';
import { useStyles } from 'builder/containers/SidePanel/PropertiesPanel/styles';
import AddResponseMenu from 'builder/components/AddResponseMenu';

type MultipleResponseOptionsProps = {
  block: Block;
};

const MultiResponseProperties: FC<MultipleResponseOptionsProps> = props => {
  const { block } = props;
  const classes = useStyles();

  return (
    <div className={classes.panelSection}>
      <Toggle
        labelText={'Multiple inputs'}
        icon={<ClipboardListCheckIcon size={'1.2em'} revertColors />}
        withoutSwitch
      />

      <MultipleComponentPreview block={block} />
      <AddResponseMenu />
    </div>
  );
};

export default MultiResponseProperties;
