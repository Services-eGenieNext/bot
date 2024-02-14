/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { default as ParchmentInstance } from 'parchment';
import Quill, { QuillOptionsStatic } from 'quill';
import once from 'lodash/once';
import { pxToRem } from 'shared/styles/theme';

const Parchment: typeof ParchmentInstance = Quill.import('parchment');
const Block = Quill.import('blots/block');

class IndentAttributor extends Parchment.Attributor.Style {
  add(node, value) {
    if (value === 0) {
      this.remove(node);
      return true;
    } else {
      return super.add(node, `${value}em`);
    }
  }
}

class SizeAttributor extends Parchment.Attributor.Style {
  sizes = {
    small: pxToRem(10),
    large: pxToRem(18),
    huge: pxToRem(32),
  };
  values = Object.fromEntries(
    Object.entries(this.sizes).map(([key, value]) => [value, key]),
  );

  add(node, value) {
    const sizeValue = this.sizes[value];
    return super.add(node, sizeValue);
  }

  value(node) {
    const sizeValue = super.value(node);
    return this.values[sizeValue] ?? '';
  }
}

const IndentStyle = new IndentAttributor('indent', 'text-indent', {
  scope: Parchment.Scope.BLOCK,
  whitelist: undefined,
});

const SizeStyle = new SizeAttributor('size', 'font-size', {
  scope: Parchment.Scope.INLINE,
  whitelist: undefined,
});

export const setupQuill = once(() => {
  const styleAttributors = [
    'attributors/style/align',
    'attributors/style/background',
    'attributors/style/color',
    'attributors/style/direction',
    'attributors/style/font',
  ];

  styleAttributors.forEach(modulePath => {
    Quill.register(Quill.import(modulePath), true);
  });

  Block.tagName = 'DIV';

  Quill.register(Block, true);
  Quill.register(SizeStyle, true);
  Quill.register(IndentStyle, true);
});

export interface EditorOptions {
  plainEditor?: boolean;
  hideToolbar?: boolean;
  placeholder?: string;
  readonly?: boolean;
  content?: string;
}

const defaultEditorOptions: Required<EditorOptions> = {
  content: '',
  plainEditor: false,
  hideToolbar: false,
  placeholder: '',
  readonly: false,
};

export const createQuillInstance = (
  container: Element,
  options: EditorOptions,
  quilOpts?: Partial<QuillOptionsStatic>,
) => {
  setupQuill();
  return new Quill(container, createOptions(options, quilOpts));
};

export const createOptions = (
  options: EditorOptions,
  quilOpts?: Partial<QuillOptionsStatic>,
): QuillOptionsStatic => {
  const { plainEditor, hideToolbar, placeholder, readonly } = {
    ...defaultEditorOptions,
    ...options,
  };

  const toolbarOptions = [
    // [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, false] }],
    [{ color: [] }, { background: [] }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '+1' }, { indent: '-1' }, { align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ];

  return {
    debug: 'warn',
    formats: plainEditor ? [] : undefined,
    modules: { toolbar: plainEditor || hideToolbar ? false : toolbarOptions },
    placeholder: placeholder,
    readOnly: readonly,
    theme: 'snow',
    ...quilOpts,
  };
};

export type ContentChangedEvent = {
  target: {
    name: string | undefined;
    type: 'html' | 'text';
    value: string;
  };
};

export type LengthChangedEvent = {
  target: {
    name: string | undefined;
    type: 'html' | 'text';
    length: number;
  };
};

export const getEditorValue = (quill?: Quill, plainEditor?: boolean) => {
  const type: 'text' | 'html' = plainEditor ? 'text' : 'html';

  if (!quill) {
    return { type, value: '', length: 0 };
  }
  const html = quill.root.innerHTML;
  const text = quill.getText();

  const value = plainEditor ? text : html;
  return { value, type, length: text.length };
};

export const setEditorText = (
  quill?: Quill,
  content?: string,
  plainEditor: boolean = false,
) => {
  const { value } = getEditorValue(quill, plainEditor);
  if (!quill || typeof content !== 'string' || value === content) {
    return;
  }

  if (plainEditor) {
    quill.setText(content, 'api');
  } else {
    quill.clipboard.dangerouslyPasteHTML(content);
  }

  placeCaretAtEnd(quill.root);
};

export const appendEditorText = (
  quill?: Quill,
  appendText?: string,
  plainEditor?: boolean,
) => {
  const { value } = getEditorValue(quill, plainEditor);

  if (!quill || typeof appendText !== 'string') {
    return;
  }

  const newContent = value + appendText;
  if (plainEditor) {
    quill.setText(newContent, 'api');
  } else {
    quill.clipboard.dangerouslyPasteHTML(newContent);
  }

  placeCaretAtEnd(quill.root);
};

export const placeCaretAtEnd = (el: HTMLElement) => {
  el.focus();
  if (
    typeof window.getSelection === 'function' &&
    typeof document.createRange === 'function'
  ) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
};
