/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { getLocalStorageItem } from 'shared/utils/localStorage';
import { LNB_LOCAL_STORAGE_LOOKUP_KEY, translationsJson } from './helper';

export const i18n = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init(
    {
      resources: translationsJson,
      lng: getLocalStorageItem(LNB_LOCAL_STORAGE_LOOKUP_KEY) || 'en',
      fallbackLng: 'en',
      debug:
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',

      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      detection: {
        order: ['localStorage', 'querystring', 'cookie'],
        lookupLocalStorage: LNB_LOCAL_STORAGE_LOOKUP_KEY,
        caches: ['localStorage'],
      },
    },
    () => {},
  );

export const translate = i18next.t.bind(i18next);
