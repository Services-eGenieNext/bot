/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

export type TypedIdentity<T, U = any> = (fn: (t: T) => U) => typeof fn;

export const createTypedIdentity = <T, U = any>() => {
  return (fn => fn) as TypedIdentity<T, U>;
};

export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;
