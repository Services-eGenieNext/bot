/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { css } from 'styled-components/macro';
import { media, sizes } from '../media';

describe('media', () => {
  it('should return media query in css', () => {
    const mediaQuery = media.small`color:red;`.join('');
    const cssVersion = css`
      @media (min-width: ${sizes.small}px) {
        color: red;
      }
    `.join('');
    expect(mediaQuery).toEqual(cssVersion);
  });
});
