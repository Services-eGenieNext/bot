/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Henok Dejen <henokdejen94@gmail.com> 2022-present
 *
 */

import {
  removeLocalStorageItem,
  setLocalStorageItem,
} from 'shared/utils/localStorage';

// Dynamically load all the translations
const context = require.context('./translations', true, /.json$/);
const translationsJson = {};
context.keys().forEach((key: any) => {
  const fileName = key.replace('./', '');
  const resource = require(`./translations/${fileName}`);
  const namespace = fileName.replace('.json', '');
  translationsJson[namespace] = {
    translation: JSON.parse(JSON.stringify(resource)),
  };
});

export { translationsJson };

export const LNB_LOCAL_STORAGE_LOOKUP_KEY = 'botLng';

export const setInitiallyPreferedLanguageToLS = (lng: string) => {
  if (lng) {
    setLocalStorageItem(LNB_LOCAL_STORAGE_LOOKUP_KEY, lng);
  }
};

export const clearPreferredLanguageFromLS = () => {
  removeLocalStorageItem(LNB_LOCAL_STORAGE_LOOKUP_KEY);
};
