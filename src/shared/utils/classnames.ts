/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { GenerateClassNameOptions } from '@material-ui/styles/createGenerateClassName/createGenerateClassName';
import nested from '@material-ui/styles/ThemeProvider/nested';
import { logger } from './logger';

const pseudoClasses = [
  'checked',
  'disabled',
  'error',
  'focused',
  'focusVisible',
  'required',
  'expanded',
  'selected',
];

let ruleCounter = 0;

const stringHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash.toString(36);
};

export function createGenerateClassName(options?: GenerateClassNameOptions) {
  const {
    disableGlobal = false,
    productionPrefix = 'jss',
    seed = '',
  } = options || {};

  const seedPrefix = seed === '' ? '' : `${seed}-`;

  const getNextCounterId = () => {
    ruleCounter += 1;
    if (process.env.NODE_ENV !== 'production') {
      if (ruleCounter >= 1e10) {
        logger.warn(
          [
            '[classnames]: You might have a memory leak.',
            'The ruleCounter is not supposed to grow that much.',
          ].join(''),
        );
      }
    }
    return ruleCounter;
  };

  return (rule, styleSheet) => {
    const name = styleSheet.options.name;

    // Is a global static MUI style?
    if (
      name &&
      name.indexOf('Mui') === 0 &&
      !styleSheet.options.link &&
      !disableGlobal
    ) {
      if (pseudoClasses.indexOf(rule.key) !== -1) {
        return `Mui-${rule.key}`;
      }

      const prefix = `${seedPrefix}${name}-${rule.key}`;

      if (!styleSheet.options.theme[nested] || seed !== '') {
        return prefix;
      }

      return `${prefix}-${getNextCounterId()}`;
    }

    const classNamePrefix = styleSheet.options.classNamePrefix || '';
    const suffix = `${rule.key}-${getNextCounterId()}`;

    if (process.env.NODE_ENV === 'production') {
      return `${seedPrefix}${productionPrefix}${stringHash(
        classNamePrefix + suffix,
      )}`;
    }

    return `${seedPrefix}${classNamePrefix}-${suffix}`;
  };
}
