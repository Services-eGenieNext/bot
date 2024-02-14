/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, memo, useCallback, useState } from 'react';
import { VariablesSelect } from 'builder/components/Variables';
import { LengthChangedEvent } from 'builder/components/RichEditor/utils';
import RichEditor, { RichEditorProps } from 'builder/components/RichEditor';
import { useStyles } from './styles';

export type RichEditorOutlinedProps = RichEditorProps & {
  withVariablesMenu?: boolean;
};

const RichEditorOutlined: React.FC<RichEditorOutlinedProps> = memo(
  props => {
    const { onLengthChange, withVariablesMenu, ...others } = props;
    const [append, setAppend] = useState<string>();
    const classes = useStyles();

    const [contentLength, setContentLength] = useState<number>(0);

    const handleLengthChange = useCallback(
      (event: LengthChangedEvent) => {
        setContentLength(event.target.length);
        if (onLengthChange) {
          onLengthChange(event);
        }
      },
      [onLengthChange],
    );

    return (
      <div className={classes.richEditorOutlined}>
        <RichEditor
          append={append}
          onLengthChange={handleLengthChange}
          {...others}
        />
        <EditorFooter
          withVariablesMenu={withVariablesMenu}
          contentLength={contentLength}
          onVariableSelected={v => setAppend(` {{${v}}} `)}
        />
      </div>
    );
  },
  (prev, next) => prev.readonly === next.readonly,
);

interface EditorFooterProps {
  contentLength: number;
  onVariableSelected: (variable: string) => any;
  withVariablesMenu?: boolean;
}

const EditorFooter: FC<EditorFooterProps> = props => {
  const classes = useStyles();

  const { contentLength, onVariableSelected, withVariablesMenu } = props;

  return (
    <div className={classes.editorFooter}>
      {withVariablesMenu && <VariablesSelect onSelect={onVariableSelected} />}
      <div className={classes.lengthCounter}>
        {contentLength > 0 ? contentLength : null}
      </div>
    </div>
  );
};

RichEditorOutlined.displayName = 'RichEditorOutlined';

export default RichEditorOutlined;
