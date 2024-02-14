/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, {
  useEffect,
  useRef,
  memo,
  useMemo,
  useCallback,
  useState,
} from 'react';
import { debounce } from '@material-ui/core';
import set from 'lodash/set';
import clsx from 'clsx';
import Quill from 'quill';
import {
  createQuillInstance,
  ContentChangedEvent,
  LengthChangedEvent,
  setEditorText,
  appendEditorText,
  getEditorValue,
} from 'builder/components/RichEditor/utils';
import { useStyles } from './styles';
import 'quill/dist/quill.snow.css';

export interface RichEditorProps {
  name?: string;
  className?: string;
  placeholder?: string;
  readonly?: boolean;
  plainEditor?: boolean;
  hideToolbar?: boolean;
  onChange?: (event: ContentChangedEvent) => any;
  onLengthChange?: (event: LengthChangedEvent) => any;
  initialContent?: string;
  rowsMax?: number;
  append?: string;
}

const RichEditor: React.FC<RichEditorProps> = props => {
  const {
    className,
    placeholder,
    readonly,
    plainEditor,
    hideToolbar,
    name,
    onChange,
    onLengthChange,
    initialContent,
    rowsMax,
    append,
  } = props;

  const classes = useStyles({ rowsMax });

  const quillRef = useRef<Quill | undefined>();
  const editorElementRef = useRef<HTMLDivElement>(null);
  const [content] = useState<string | undefined>(initialContent);

  type HandleChange = (arg: { type: 'html' | 'text'; value: string }) => void;

  const handleChange: HandleChange = useMemo(
    () =>
      debounce(({ type, value }) => {
        if (onChange && quillRef.current) {
          onChange({
            target: { name, type, value },
          });
        }
      }, 100),
    [name, onChange],
  );

  useEffect(() => {
    const containerNode: HTMLDivElement | null = editorElementRef.current;

    if (!containerNode) {
      return;
    }

    const quilInstance = createQuillInstance(containerNode, {
      readonly,
      hideToolbar,
      plainEditor,
      placeholder,
    });

    if (!plainEditor) {
      set(
        quilInstance,
        'theme.tooltip.textbox.dataset.link',
        'https://lawly.app',
      );
    }

    quillRef.current = quilInstance;

    return () => {
      containerNode.className = '';
    };
  }, [plainEditor, hideToolbar, placeholder, readonly]);

  const textChangeHandler = useCallback(
    (delta, old, source) => {
      const quill = quillRef.current;

      if (source !== 'user') {
        return;
      }

      const { type, value, length } = getEditorValue(quill, plainEditor);
      if (onLengthChange) {
        onLengthChange({ target: { name, type, length } });
      }

      handleChange({ type, value });
    },
    [handleChange, name, onLengthChange, plainEditor],
  );

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) {
      return;
    }

    quill.on('text-change', textChangeHandler);

    return () => {
      quill.off('text-change', textChangeHandler);
    };
  }, [textChangeHandler]);

  useEffect(() => {
    const quill = quillRef.current;
    setEditorText(quill, content, plainEditor);
  }, [content, plainEditor]);

  useEffect(() => {
    const quill = quillRef.current;
    appendEditorText(quill, append, plainEditor);
  }, [append, plainEditor]);

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.editor} ref={editorElementRef} />
    </div>
  );
};

const MemoRichEditor = memo(RichEditor, (prev, next) => {
  return (
    prev.readonly === next.readonly &&
    prev.append?.trim() === next.append?.trim()
  );
});

MemoRichEditor.displayName = 'RichEditor';
export default MemoRichEditor;
