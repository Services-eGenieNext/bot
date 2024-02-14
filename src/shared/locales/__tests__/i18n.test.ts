/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { i18n } from '../i18n';

describe('i18n', () => {
  it('should initate i18n', async () => {
    const t = await i18n;
    expect(t).toBeDefined();
  });
});
