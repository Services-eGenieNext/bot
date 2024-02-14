/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Immutable } from 'immer';
import { getObjectValues, isNumber } from 'shared/utils';

export interface Block {
  id: string;
  title: string;
  type: BlockTypes;
  category?: BlockCategories;
  text?: string;
  readMore?: ReadMore | null;
  next?: OutgoingBlock | null;
  paragraphs?: ParagraphBinding[];
  position: XYPosition;
  required?: boolean;
  components?: ResponseComponent[];
}

export interface ConditionBlockType extends Omit<Block, 'next'> {
  category?: BlockCategories.Action;
  type: BlockTypes.Condition;
  valueLeft: string;
  valueRight: string;
  operator: ConditionOperator;
  nextTrue?: OutgoingBlock | null;
  nextFalse?: OutgoingBlock | null;
}

export interface TriggerBlockType extends Block {
  category?: BlockCategories.Action;
  type: BlockTypes.Trigger;
  action: Action;
  variable: string;
  value: string;
}

export interface TextBlockType extends Block {
  category?: BlockCategories.Block;
  type: BlockTypes.Text;
}

export interface APIBlockType extends Block {
  category?: BlockCategories.Block;
  type: BlockTypes.API;
  templateId?: string;
  api: APIConfig;
}

export interface ListBlockType extends Block {
  category?: BlockCategories.Block;
  type: BlockTypes.List;
}

export interface PresentationBlockType extends Block {
  category?: BlockCategories.Block;
  type: BlockTypes.Presentation;
  configs: PresentationConfig;
}

export interface GDPRBlockType extends Block {
  category?: BlockCategories.Block;
  type: BlockTypes.GDPR;
  configs: PresentationConfig;
}

export interface FinishBlockType extends Block {
  category?: BlockCategories.Waypoint;
  type: BlockTypes.Finish;
}

export interface QuitBlockType extends Block {
  category?: BlockCategories.Waypoint;
  type: BlockTypes.Quit;
}

export interface OutletBlockType extends Block {
  category?: BlockCategories.Waypoint;
  type: BlockTypes.Outlet;
  nextBotId?: string;
}

export interface ResponseComponent {
  id: string;
  type: ComponentType;
  props?: ResponseComponentProps;
}

export interface ResponseComponentProps {
  title?: string;
  hint?: string;
  validation?: ResponseValidationType;
  options?: PredefinedOptions[];
  lines?: string[];
  variable?: string;
  [key: string]: unknown;
}

export interface PredefinedOptions {
  id: string;
  title: string;
  hint?: string;
  next?: OutgoingBlock;
  paragraphs?: ParagraphBinding[];
  value?: string;
}

export interface OutgoingBlock {
  id: string;
  handles: {
    source: string;
    target: string;
  };
}

export interface ParagraphBinding {
  id: string;
  title: string;
  color: string;
}

export interface ReadMore {
  enabled: boolean;
  label?: string;
  excerpt?: string;
  text?: string;
}

export interface APIConfig {
  endpoint: string;
  payload: string;
}

export interface PresentationConfig {
  videoUrl?: string;
  buttonTitle?: string;
}

export interface ResponseValidationType {
  type: ValidationType;
  pattern?: string;
  settlementVariable?: string;
}

type XYPosition = {
  x: number;
  y: number;
};

export type ValidationType =
  | 'anything'
  | 'textarea'
  | 'email'
  | 'date'
  | 'phone'
  | 'unique_id'
  | 'number'
  | 'name'
  | 'settlement'
  | 'pattern';

export enum ComponentType {
  Predefined = 'predefined',
  FreeSpeech = 'freespeech',
  Confirm = 'confirm',
  None = 'none',
}

export enum BlockTypes {
  Text = 'text',
  API = 'api',
  List = 'multi',
  Presentation = 'presentation',
  GDPR = 'GDPR',
  Trigger = 'trigger',
  Condition = 'condition',
  Outlet = 'outlet',
  Start = 'start',
  Finish = 'exit',
  Quit = 'quit',
}

export enum BlockCategories {
  Block = 'block',
  Action = 'action',
  Waypoint = 'waypoint',
}

export enum ConditionOperator {
  EXIST = '!!',
  EQUAL = '==',
  NOT_EQUAL = '!=',
  GREATER = '>',
  GREATER_EQUAL = '>=',
  LESS = '<',
  LESS_EQUAL = '<=',
}

export enum Action {
  SET_VARIABLE = 'SET_VARIABLE',
  SET_USER_VARIABLE = 'SET_USER_VARIABLE',
}

export function isBlock(block?: any): block is Block {
  if (block?.position && !isPosition(block?.position)) {
    return false;
  }

  return block?.id && isBlockType(block?.type);
}

export function isBlockType(type?: string): type is BlockTypes {
  return !!type && getObjectValues<string>(BlockTypes).includes(type);
}

function isPosition(position?: any): position is XYPosition {
  return isNumber(position?.x) && isNumber(position?.y);
}

export function isResponse(res: any): res is ResponseComponent {
  return res && res.component && res.props && res.props.id;
}

export function isApiBlock(
  block: Block | Immutable<Block>,
): block is APIBlockType {
  return block.type === BlockTypes.API;
}

export function isListBlock(
  block: Block | Immutable<Block>,
): block is ListBlockType {
  return block.type === BlockTypes.List;
}

export function isPresentationBlock(
  block: Block | Immutable<Block>,
): block is PresentationBlockType {
  return block.type === BlockTypes.Presentation;
}

export function isGDPRBlock(
  block: Block | Immutable<Block>,
): block is PresentationBlockType {
  return block.type === BlockTypes.GDPR;
}

export function isOutletBlock(
  block: Block | Immutable<Block>,
): block is OutletBlockType {
  return block.type === BlockTypes.Outlet;
}

export function isConditionBlock(
  block: Block | Immutable<Block>,
): block is ConditionBlockType {
  return block.type === BlockTypes.Condition;
}

export function isFinishBlock(
  block: Block | Immutable<Block>,
): block is FinishBlockType {
  return block.type === BlockTypes.Finish;
}

export function isQuitBlock(
  block: Block | Immutable<Block>,
): block is QuitBlockType {
  return block.type === BlockTypes.Quit;
}

export function isTriggerBlock(
  block: Block | Immutable<Block>,
): block is TriggerBlockType {
  return block.type === BlockTypes.Trigger;
}
