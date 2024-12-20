const getComponents = () => {
  return [
    {
      label: 'pageList',
      type: 'list',
      actions: ['quickInfo', 'elementPage', 'newTab'],
      elements: [
        {
          field: 'image',
          type: 'media',
          data: 'dynamic',
          match: ['media', 'string'],
        },
        {
          field: 'column1',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'column2',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown', 'search'],
        },
        {
          field: 'column3',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown', 'search'],
        },
        {
          field: 'chip',
          type: 'string',
          data: 'dynamic',
          match: ['string', 'selection', 'dropdown', 'search'],
        },
      ],
    },
    {
      label: 'actionList',
      type: 'list',
      actions: [],
      elements: [
        {
          field: 'column1',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'column2',
          type: 'string',
          data: 'dynamic',
          match: ['date', 'date-time'],
        },
        {
          field: 'chip',
          type: 'string',
          data: 'dynamic',
          match: ['status', 'selection', 'dropdown'],
        },
        {
          field: 'ico1',
          type: 'icon',
          data: 'dynamic',
          match: ['status', 'selection', 'dropdown', 'slider'],
        },
        {
          field: 'action1',
          type: 'button',
          data: 'dynamic',
          match: [],
        },
      ],
    },

    {
      label: 'pageListGrid',
      actions: ['quickInfo', 'elementPage', 'newTab'],
      type: 'list',
      elements: [
        {
          field: 'column1',
          type: 'string',
          data: 'dynamic',
          match: [
            'number',
            'string',
            'selection',
            'dropdown',
            'search',
            'hook',
          ],
        },
        {
          field: 'column2',
          type: 'string',
          data: 'dynamic',
          match: [
            'number',
            'string',
            'selection',
            'dropdown',
            'search',
            'date',
            'hook',
          ],
        },
        {
          field: 'column3',
          type: 'string',

          data: 'dynamic',
          match: ['selection', 'dropdown', 'status'],
        },
      ],
    },

    {
      label: 'tinyList',
      type: 'list',
      actions: ['quickInfo', 'elementPage', 'newTab'],
      elements: [
        {
          field: 'column1',
          type: 'string',

          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'column2',
          type: 'string',

          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'column3',
          type: 'string',

          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'column4',
          type: 'string',

          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
    },

    {
      label: 'kanban',
      type: 'action',
      actions: ['quickInfo', 'elementPage'],
      elements: [
        {
          field: 'statusCol',
          type: 'number',
          data: 'dynamic',
          match: ['status', 'slider'],
        },
        {
          field: 'cardName',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'passName',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'assignedTo',
          type: 'string',
          data: 'dynamic',
          match: ['node'],
        },
        {
          field: 'startDate',
          type: 'date',
          data: 'dynamic',
          match: ['date-time', 'date'],
        },
        {
          field: 'endDate',
          type: 'date',
          data: 'dynamic',
          match: ['date-time', 'date'],
        },
        {
          field: 'location',
          type: 'string',
          data: 'dynamic',
          match: ['node'],
        },
        {
          field: 'value1',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value2',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value3',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
    },
    {
      label: 'calendar',
      type: 'action',
      actions: ['quickInfo', 'elementPage'],
      elements: [
        {
          field: 'statusCol',
          type: 'number',
          data: 'dynamic',
          match: ['status', 'slider'],
        },
        {
          field: 'passName',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'assignedTo',
          type: 'string',
          data: 'dynamic',
          match: ['node'],
        },
        {
          field: 'startDate',
          type: 'date',
          data: 'dynamic',
          match: ['date-time', 'date'],
        },
        {
          field: 'endDate',
          type: 'date',
          data: 'dynamic',
          match: ['date-time', 'date'],
        },
        {
          field: 'location',
          type: 'string',
          data: 'dynamic',
          match: ['node'],
        },
        {
          field: 'value1',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value2',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
    },
    {
      label: 'mainInfo',
      type: 'content',
      actions: ['elementPage', 'edit'],
      elements: [
        {
          field: 'avatar',
          type: 'string',
          data: 'dynamic',
          match: ['media', 'string'],
        },
        {
          field: 'title',
          type: 'date',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'subTitle',
          type: 'date',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value1',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value2',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value3',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
    },
    {
      label: 'secInfo',
      type: 'content',
      actions: ['edit'],
      elements: [
        {
          field: 'image',
          type: 'string',
          data: 'dynamic',
          match: ['media'],
        },
        {
          field: 'icon',
          type: 'string',
          data: 'dynamic',
          match: ['media'],
        },
        {
          field: 'title',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value1',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value2',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value3',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
    },
    {
      label: 'quickInfo',
      type: 'content',
      actions: ['edit'],
      elements: [
        {
          field: 'title',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'subTitle',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value1',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value2',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value3',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value4',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
    },
    {
      label: 'dataInfo',
      type: 'content',
      actions: ['edit'],
      elements: [
        {
          field: 'value1',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value2',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value3',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value4',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value5',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
    },
    {
      label: 'listInfo',
      type: 'content',
      actions: ['edit'],
      elements: [
        {
          field: 'selection',
          type: 'selection',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
    },
    {
      label: 'logFeed',
      type: 'action',
      actions: ['edit', 'elementPage', 'quickInfo'],
      elements: [],
    },
    {
      label: 'contentForm',
      type: 'action',
      actions: ['edit'],
      elements: [
        {
          field: 'selection',
          type: 'selection',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
    },
    {
      label: 'mapGeo',
      actions: [],
      elements: [
        {
          field: 'map',
          type: 'geo',
          data: 'dynamic',
          match: ['geo'],
        },
      ],
      type: 'content',
    },
    {
      label: 'tasksList',
      actions: [],
      elements: [
        {
          field: 'column1',
          type: 'string',

          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'column2',
          type: 'string',

          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'column3',
          type: 'string',

          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
      type: 'list',
    },
    {
      label: 'sectionText',
      type: 'content',
      actions: [],
      elements: [
        {
          field: 'title',
          type: 'string',
          data: 'static',
          match: [],
        },
        {
          field: 'label',
          type: 'string',
          data: 'static',
          match: [],
        },
      ],
    },
    {
      label: 'actionBtn',
      actions: [],
      elements: [
        {
          field: 'label',
          type: 'string',
          data: 'static',
          match: [],
        },
        {
          field: 'action',
          type: 'selections',
          data: 'dynamic',
          selections: [
            {
              label: 'fieldToBoolean',
              value: 'fieldToBoolean',
              match: ['boolean'],
            },
            {
              label: 'convertToCard',
              value: 'convertToCard',
              match: [],
            },
          ],
          match: [],
        },
      ],
      type: 'action',
    },
    {
      label: 'quickNote',
      actions: [],
      elements: [],
      type: 'action',
    },
    {
      label: 'documentNote',
      actions: [],
      elements: [],
      type: 'action',
    },
    {
      label: 'selector',
      actions: [],
      elements: [
        {
          field: 'selection',
          type: 'number',
          data: 'dynamic',
          match: ['selection'],
        },
      ],
      type: 'action',
    },
    {
      label: 'elementOverview',
      actions: ['quickInfo', 'elementPage'],
      elements: [
        {
          field: 'image',
          type: 'string',
          data: 'dynamic',
          match: ['media'],
        },
        {
          field: 'title',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'subTitle',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
        {
          field: 'value1',
          type: 'string',
          data: 'dynamic',
          match: ['number', 'string', 'selection', 'dropdown'],
        },
      ],
      type: 'content',
    },
    {
      label: 'singleStat',
      actions: [],
      elements: [
        {
          field: 'value',
          type: 'number',
          data: 'dynamic',
          match: ['number', 'status'],
        },
        {
          field: 'title',
          type: 'string',
          data: 'static',
          match: [],
        },
      ],
      type: 'content',
    },
    {
      label: 'fixedData',
      actions: ['edit'],
      elements: [],
      type: 'content',
    },
  ];
};

const getLists = () => {
  return [
    {
      label: 'listA',
      actions: ['quickInfo', 'elementPage', 'newTab'],
      elements: [
        {
          field: 'image',
          match: ['media', 'string'],
        },
        {
          field: 'title',
          match: ['string'],
        },
        {
          field: 'subTitle',
          match: ['string'],
        },
        {
          field: 'value1',
          match: ['string'],
        },
        {
          field: 'value1Sub',
          match: ['string'],
        },
        {
          field: 'value2',
          match: ['string'],
        },
        {
          field: 'value2Sub',
          match: ['string'],
        },
        {
          field: 'value3',
          match: ['string'],
        },
        {
          field: 'value3Sub',
          match: ['string'],
        },
        {
          field: 'elementEnd',
          match: ['action'],
        },
      ],
    },
  ];
};

export default getComponents;
