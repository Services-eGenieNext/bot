/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { ResponseComponent } from './blocks';

export interface ApiTemplate {
  id: string;
  label: string;
  endpoint: {
    value: string;
    editable: boolean;
  };
  payload: {
    value: string;
    editable: boolean;
  };
  component: ResponseComponent & {
    editable: boolean;
  };
}

export type ApiResponse = {
  error?: any;
  components?: ResponseComponent[];
  data?: Record<string, unknown>;
};

export type ApiStatus = {
  loading?: boolean;
  error?: string;
  response?: ApiResponse;
};
