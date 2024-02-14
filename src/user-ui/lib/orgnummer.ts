/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

export function validateOrganisationNumber(orgNr: string): boolean {
  if (!isValidInput(orgNr)) {
    return false;
  }

  const orgNumber = cleanDigitString(orgNr);
  return isValidLuhn(orgNumber);
}

function cleanDigitString(digitString: string): string {
  return digitString.replace(/\D/g, '');
}

function isValidLuhn(pnr: string): boolean {
  if (!pnr || isNaN(Number(pnr))) {
    return false;
  }

  let number;
  let checksum = 0;
  for (let i = pnr.length - 1; i >= 0; i--) {
    number = parseInt(pnr.charAt(i));
    if (i % 2 === 1) {
      checksum += number;
    } else {
      checksum += number * 2 > 9 ? number * 2 - 9 : number * 2;
    }
  }

  return checksum % 10 === 0;
}

function isValidInput(input: string): boolean {
  const digits = input.replace(/-/g, '');
  return !isNaN(Number(digits));
}
