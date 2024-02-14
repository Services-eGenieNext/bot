/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import Personnummer from 'personnummer';
import { translate } from 'shared/locales/i18n';
import { validateOrganisationNumber } from 'user-ui/lib/orgnummer';

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const NAME_REGEX = /^[a-zA-Z .,\-áéèêëęœôòóõōüûùúūöäåøæ]+$/;
const PHONE_REGEX = /^\+?[(]?[0-9]{2,3}[)]?[-\s.]?[0-9]{2,3}[-\s.]?[0-9]{4,6}$/;

export const validatePhone = (value?: string): string => {
  const isValid = value?.match(PHONE_REGEX);
  return isValid ? '' : translate('validations.phone');
};

export const validateEmail = (value?: string): string => {
  const isValid = value?.match(EMAIL_REGEX);
  return isValid ? '' : translate('validations.email');
};

export const validateNumber = (value?: string): string => {
  const isValid = !isNaN(Number(value));
  return isValid ? '' : translate('validations.number');
};

export const validatePersonnummer = (value?: string): string => {
  const isValid = Personnummer.valid(value ?? '');
  return isValid ? '' : translate('validations.personnummer');
};

export const validatePersonOrOrg = (value: string = ''): string => {
  const isValid =
    Personnummer.valid(value) || validateOrganisationNumber(value);
  return isValid ? '' : translate('validations.personnummer');
};

export const validateName = (value?: string): string => {
  const isValid = value && value.match(NAME_REGEX);
  return isValid ? '' : translate('validations.name');
};

export const validateDate = (value?: string): string => {
  const year = value && new Date(value).getFullYear();
  const isValid = year && year < 2100 && year > 1900;
  return isValid ? '' : translate('validations.date');
};

export const validatePattern = (value?: string, pattern?: string): string => {
  if (!value || !pattern) {
    return '';
  }
  const regex = new RegExp(pattern);
  const isValid = value.match(regex);
  return isValid ? '' : translate('validations.pattern');
};
