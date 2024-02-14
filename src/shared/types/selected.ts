/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

export enum SelectedType {
  Bot = 'bot',
  Block = 'block',
  Response = 'response',
  Option = 'option',
  ReadMoreContent = 'readMoreContent',
  TextMessage = 'textMessage',
}

export interface Selected {
  selectedType: SelectedType;
  selectedBotId?: string;
  selectedBlockId?: string;
  selectedComponentId?: string;
  selectedOptionId?: string;
  selectedTabIndex: number;
}
