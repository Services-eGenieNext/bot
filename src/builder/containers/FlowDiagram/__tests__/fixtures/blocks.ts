/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import {
  APIBlockType,
  Block,
  BlockCategories,
  BlockTypes,
  ConditionBlockType,
  ConditionOperator,
  ComponentType,
} from 'shared/types';

const initialBlocks: Block[] = [
  {
    id: 'start',
    title: 'start',
    type: BlockTypes.Start,
    category: BlockCategories.Waypoint,
    position: {
      x: 50,
      y: 0,
    },
    next: {
      id: '7d14755e-04b7-464a-9eb9-70ea8f1c477c',
      handles: {
        source: 'source.bottom',
        target: 'target.top',
      },
    },
  },
  {
    id: '7d14755e-04b7-464a-9eb9-70ea8f1c477c',
    type: BlockTypes.Text,
    category: BlockCategories.Block,
    title: 'framtidsfullmakt',
    next: null,
    position: {
      x: 160,
      y: 208.5,
    },
    required: true,
    components: [
      {
        id: 'ccf4151f-e298-4528-a616-ce6c72259d01',
        type: ComponentType.Predefined,
        props: {
          options: [
            {
              id: 'b2ded126-b981-4075-9ee4-65f30d89e22b',
              title: 'Ja',
              hint: '',
              paragraphs: [],
              value: '1',
              next: {
                id: 'e4de6773-f856-4fd7-84d2-e18bedf1e3d3',
                handles: {
                  source:
                    'source.response.ccf4151f-e298-4528-a616-ce6c72259d01.b2ded126-b981-4075-9ee4-65f30d89e22b',
                  target: 'target.left',
                },
              },
            },
            {
              id: '7bd205cf-1351-4aeb-a8cf-57f0db067ca4',
              title: 'Nej',
              hint: '',
              paragraphs: [],
              value: '0',
            },
          ],
        },
      },
    ],
    readMore: {
      enabled: false,
    },
    paragraphs: [],
    text: 'Har du upprättat en framtidsfullmakt tidigare?',
  },
  {
    id: 'e4de6773-f856-4fd7-84d2-e18bedf1e3d3',
    type: BlockTypes.Condition,
    category: BlockCategories.Action,
    title: 'Is Yes?',
    position: {
      x: 646,
      y: 281.5,
    },
    operator: ConditionOperator.EQUAL,
    valueLeft: '',
    valueRight: '1',
    nextFalse: {
      id: 'dd996ff7-4dff-40ea-a60b-61adec6a4400',
      handles: {
        source: 'source.condition.false',
        target: 'target.top',
      },
    },
    nextTrue: {
      id: 'f4e38d4d-082e-41d0-aa18-8f1c0cad6d9c',
      handles: {
        source: 'source.condition.true',
        target: 'target.top',
      },
    },
  } as ConditionBlockType,
  {
    id: 'f4e38d4d-082e-41d0-aa18-8f1c0cad6d9c',
    type: BlockTypes.Text,
    category: BlockCategories.Block,
    title: 'ok?',
    next: null,
    position: {
      x: 463,
      y: 499.5,
    },
    required: true,
    components: [
      {
        id: '91a93dd3-ec6f-448e-9520-ed4a47e324d2',
        type: ComponentType.Predefined,
        props: {
          options: [
            {
              id: '6a033d67-6a38-42b7-bf2c-4159145cd194',
              title: 'Ok!',
              hint: '',
              paragraphs: [],
              value: '',
              next: {
                id: 'dd996ff7-4dff-40ea-a60b-61adec6a4400',
                handles: {
                  source:
                    'source.response.91a93dd3-ec6f-448e-9520-ed4a47e324d2.6a033d67-6a38-42b7-bf2c-4159145cd194',
                  target: 'target.top',
                },
              },
            },
          ],
        },
      },
    ],
    readMore: {
      enabled: false,
    },
    paragraphs: [],
    text: 'Då bör du återkalla den gamla fullmakten, återta alla original och klargöra att den inte längre gäller. Vi skriver också in i din nya framtidsfullmakt att den gamla återkallas.',
  },
  {
    id: 'dd996ff7-4dff-40ea-a60b-61adec6a4400',
    type: BlockTypes.API,
    category: BlockCategories.Block,
    title: 'Vem till',
    next: {
      id: '94bde0c9-b77d-4926-897d-c8d4672ac813',
      handles: {
        source: 'source.bottom',
        target: 'target.top',
      },
    },
    position: {
      x: 828,
      y: 668.5,
    },
    required: true,
    components: [
      {
        id: '25099186-2f14-4d06-b87d-5c92e37a5862',
        type: ComponentType.None,
        props: {},
      },
    ],
    readMore: {
      enabled: false,
      text: '',
    },
    paragraphs: [],
    api: {
      payload: '{\n     “unique_id”: “{{this.input}}”\n}',
      endpoint: 'https://api.lawly.io/0.3/bot/UniqueID',
    },
    text: 'Vem vill du ge fullmakten till?',
    templateId: 'uuid-template-2',
  } as APIBlockType,
  {
    id: '94bde0c9-b77d-4926-897d-c8d4672ac813',
    type: BlockTypes.Text,
    category: BlockCategories.Block,
    title: ' betalt för arbetet?',
    next: {
      id: 'cd9e5ba8-deb9-44cc-810e-87128863dd73',
      handles: {
        source: 'source.bottom',
        target: 'target.top',
      },
    },
    position: {
      x: 861,
      y: 866.5,
    },
    required: true,
    components: [
      {
        id: '2364c620-260d-4334-9efa-bdebcebafcc0',
        type: ComponentType.Predefined,
        props: {
          options: [
            {
              id: 'b2ded126-b981-4075-9ee4-65f30d89e22b',
              title: 'Ja',
              hint: '',
              paragraphs: [],
              value: '1',
            },
            {
              id: '7bd205cf-1351-4aeb-a8cf-57f0db067ca4',
              title: 'Nej',
              hint: '',
              paragraphs: [],
              value: '0',
            },
          ],
        },
      },
    ],
    readMore: {
      enabled: false,
    },
    paragraphs: [],
    text: 'Ska din fullmaktshavare få betalt för för arbetet?',
  },
  {
    id: 'cd9e5ba8-deb9-44cc-810e-87128863dd73',
    type: BlockTypes.Finish,
    category: BlockCategories.Waypoint,
    title: 'exit',
    next: null,
    position: {
      x: 952,
      y: 1195,
    },
  },
];

export default initialBlocks;
