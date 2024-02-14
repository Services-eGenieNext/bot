/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, RefObject, useRef } from 'react';
import { Grid, IconButton, InputBase, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { ClipboardIcon } from 'shared/icons';
import { useSnackConfirm } from '../SnackBarActionConfirm';
import styles from './styles';

const useStyle = makeStyles(styles);

export interface BlockIdIndicatorProps {
  blockId: string;
  className?: string;
}

const BlockIdIndicator: FC<BlockIdIndicatorProps> = props => {
  const classes = useStyle(props);
  const inputRef = useRef(null);
  const [SnackConfirm, openSnackBar] = useSnackConfirm();

  const { blockId, className } = props;
  return (
    <div className={className}>
      <SnackConfirm
        message={'ID copied to clipboard.'}
        className={classes.snackBar}
      />
      <Grid
        container
        className={clsx(classes.container)}
        alignItems={'baseline'}
      >
        <Grid className={classes.label} item>
          ID
        </Grid>
        <Grid item xs>
          <InputBase
            value={blockId}
            className={classes.input}
            inputRef={inputRef}
            fullWidth
            readOnly
          />
        </Grid>
        <Grid item>
          <Tooltip title="Copy">
            <IconButton
              className={classes.copyButton}
              aria-label="copy"
              centerRipple={true}
              focusRipple
              onClick={() => {
                if (copyToClipboard(inputRef)) {
                  openSnackBar(true);
                }
              }}
            >
              <ClipboardIcon className={classes.copyIcon} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  );
};

export default BlockIdIndicator;

const copyToClipboard = (inputRef: RefObject<HTMLInputElement>) => {
  if (!inputRef || !window?.document) {
    return false;
  }

  const input = inputRef.current;
  input?.select?.call(input);
  const copied = document.execCommand('copy');
  input?.setSelectionRange?.call(input, 0, 0);
  return copied;
};
