/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Portal, PortalProps, SnackbarProps } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import React, { FC, ReactEventHandler } from 'react';
import { WindowCloseIcon } from 'shared/icons';

export type SnackBarConfirmProps = SnackbarProps &
  SnackActionProps & {
    container?: PortalProps['container'];
  };

export const useSnackConfirm = (): [
  FC<SnackBarConfirmProps>,
  (open: boolean) => any,
  boolean,
] => {
  const [openState, setOpen] = React.useState(false);

  const handleClose = (event, onClose?: ReactEventHandler) => {
    setOpen(false);
    onClose && onClose(event);
  };

  const SnackConfirm: React.FC<SnackBarConfirmProps> = props => {
    const { open: _, onClose, onUndo, container, ...rest } = props;
    const body = document.querySelector('body');
    return (
      <SnackBarConfirm
        open={openState}
        onClose={event => handleClose(event, onClose)}
        container={container ?? body}
        {...rest}
      />
    );
  };

  return [SnackConfirm, setOpen, openState];
};

export const SnackBarConfirm: React.FC<SnackBarConfirmProps> = props => {
  const { onUndo, onClose, container, ...rest } = props;
  return (
    <Portal container={container}>
      <Snackbar
        onClose={onClose}
        action={<SnackAction onClose={onClose} onUndo={onUndo} />}
        {...defaultOptions}
        {...rest}
      />
    </Portal>
  );
};

type SnackActionProps = {
  onUndo?: ReactEventHandler;
  onClose?: ReactEventHandler;
};

const SnackAction: FC<SnackActionProps> = props => {
  const { onUndo, onClose } = props;
  return (
    <>
      {onUndo && (
        <Button color="secondary" size="small" onClick={onUndo}>
          Undo
        </Button>
      )}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onClose}
      >
        <WindowCloseIcon secondaryOpacity={0} />
      </IconButton>
    </>
  );
};

const defaultOptions: SnackbarProps = {
  transitionDuration: 400,
  autoHideDuration: 800,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
};
