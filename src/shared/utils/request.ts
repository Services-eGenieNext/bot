/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { ApiResponse } from 'shared/types';

export class ResponseError extends Error {
  public response: Response | ApiResponse;

  constructor(response: Response | ApiResponse) {
    const errorMessage = isResponse(response)
      ? response.statusText
      : response.error;
    super(errorMessage);
    this.response = response;
  }
}

export function isResponse(response: any): response is Response {
  return response.url && response.statusText && response.status;
}

async function parseJSON(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  const data = await response.json();

  if (data.error) {
    const error = new ResponseError(data);
    error.response = response;
    throw error;
  }

  return data;
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new ResponseError(response);
  error.response = response;
  throw error;
}

export async function request(
  url: string,
  options?: RequestInit,
): Promise<[ApiResponse | null, ResponseError | null]> {
  try {
    const fetchResponse = await fetch(url, options);
    const response = checkStatus(fetchResponse);
    const result = await parseJSON(response);
    return [result, null];
  } catch (err) {
    return [null, err];
  }
}
