/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { ExclamationCircleIcon, WindowCloseIcon } from 'shared/icons';
import { useStyles } from './styles';

interface ErrorDialogProps {
  open?: boolean;
  onClose?: () => any;
  closable?: boolean;
  title: string;
  content: string | React.ReactNode;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  open = false,
  onClose,
  closable = true,
  title,
  content,
}) => {
  const classes = useStyles();
  return open ? (
    <Dialog open={open} maxWidth={'sm'} fullWidth={true} onClose={onClose}>
      <DialogTitle>
        <ExclamationCircleIcon className={classes.errorIcon} />
        {title}
        {closable && (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <WindowCloseIcon secondaryOpacity={0} size={'1em'} />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
    </Dialog>
  ) : null;
};

export type ErrorState = Pick<ErrorDialogProps, 'open' | 'title' | 'content'>;

export type UseErrorDialog = (
  props?: Pick<ErrorDialogProps, 'onClose' | 'closable'>,
) => [React.FC, React.Dispatch<React.SetStateAction<ErrorState>>];

const initialState = {
  open: false,
  title: '',
  content: '',
};

export const useErrorDialog: UseErrorDialog = ({
  onClose,
  closable = true,
} = {}) => {
  const [errorState, setErrorState] = useState<ErrorState>(initialState);

  const onCloseDialog = () => {
    if (!closable) {
      return;
    }
    setErrorState({ ...errorState, open: false });
    onClose && onClose();
  };

  const ErrorDialogControlled: React.FC = () => {
    const { open, title, content } = errorState;
    useEffect(() => {
      if (navigator.userAgent === 'ReactSnap') {
        setErrorState(initialState);
      }
    });

    return (
      <ErrorDialog
        open={open}
        onClose={onCloseDialog}
        closable={closable}
        title={title}
        content={content}
      />
    );
  };

  return [ErrorDialogControlled, setErrorState];
};
