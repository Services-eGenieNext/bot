/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { memo } from 'react';
import { AppBar, Grid, Toolbar } from '@material-ui/core';
import { useModuleContext } from 'shared/context';
import { useAddBlockMenu } from 'builder/components/AddBlockMenu';
import { PlayCircleIcon, FileContactIcon, CubesIcon } from 'shared/icons';
import AppButton from '../AppButton';

interface EditorBarProps {
  className?: string;
}

const EditorBar: React.FC<EditorBarProps> = memo(props => {
  const { className } = props;
  const { emitter } = useModuleContext();
  const [AddBlockMenu, handleAddMenuClick, isMenuOpen] = useAddBlockMenu();

  const previewClicked = () => {
    emitter.emit('previewClicked', {});
  };

  const openAgreementClicked = () => {
    emitter.emit('openAgreementClicked', {});
  };

  return (
    <AppBar
      component={'div'}
      position={'relative'}
      color={'inherit'}
      elevation={0}
      square
      className={className}
    >
      <Toolbar>
        <Grid container direction={'row'} justify={'space-between'}>
          <Grid item>
            <AppButton
              active={isMenuOpen}
              text={'Add Block'}
              icon={<CubesIcon colorVariant={'primary'} />}
              onClick={handleAddMenuClick}
            />
            <AddBlockMenu />
          </Grid>
          <Grid item>
            <AppButton
              text={'Preview'}
              icon={<PlayCircleIcon colorVariant={'primary'} />}
              onClick={previewClicked}
            />
            <AppButton
              text={'Open Agreement'}
              icon={<FileContactIcon colorVariant={'primary'} />}
              onClick={openAgreementClicked}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
});

EditorBar.displayName = 'EditorBar';
export default EditorBar;
