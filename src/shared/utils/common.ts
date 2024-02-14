/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { Ref } from 'react';
import { PartialRecord } from 'shared/types';

export const getObjectValues = <T>(
  obj?: PartialRecord<keyof any, T | undefined>,
): T[] => {
  if (!obj) {
    return [];
  }
  return Object.values(obj).filter((x): x is T => !!x);
};

export const getObjectEntries = <T>(
  obj?: PartialRecord<string, T | undefined>,
): [string, T][] => {
  if (!obj) {
    return [];
  }
  return Object.entries(obj).filter(
    (entry): entry is [string, T] => !!entry[0],
  );
};

export const isArray = <T>(value: T[] | unknown): value is T[] => {
  return typeof value === 'object' && value?.constructor.name === 'Array';
};

export const getRefValue = <T>(ref: Ref<T>): T | null | undefined => {
  return (ref as any)?.current;
};

export const isNil = (v: any): v is null | undefined => {
  return typeof v === 'undefined' || v === null;
};

export const isNumber = (v: any): v is number => {
  return typeof v === 'number';
};
