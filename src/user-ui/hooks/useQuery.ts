/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { useLocation } from 'react-router-dom';

export const useQuery = (): URLSearchParams => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};
