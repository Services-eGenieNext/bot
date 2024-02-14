/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

export const getTypedValue = (_value: string | object = '') => {
  if (typeof _value === 'object') {
    return JSON.stringify(_value);
  }

  const value = String(_value).trim().toLocaleLowerCase();

  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else if (String(Number(value)) === value) {
    return Number(value);
  } else if (value === 'null') {
    return null;
  } else if (value === 'undefined') {
    return undefined;
  } else {
    return value;
  }
};

export const isInsideWebView = (ua: string = window.navigator.userAgent) => {
  const rules = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari)',
    'Android.*(wv|.0.0.0)',
    'Linux; U; Android',
  ];
  const webviewRegExp = new RegExp('(' + rules.join('|') + ')', 'ig');
  return !!ua.match(webviewRegExp);
};
