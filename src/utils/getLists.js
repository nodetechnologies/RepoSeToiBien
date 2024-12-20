const getLists = () => {
  return [
    {
      label: 'listA',
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
          match: ['string', 'number', 'node'],
        },
        {
          field: 'value1',
          match: ['string', 'number', 'node'],
        },
        {
          field: 'value1sub',
          match: ['string', 'number', 'node'],
        },
        {
          field: 'value2',
          match: ['string', 'number', 'node'],
        },
        {
          field: 'value2sub',
          match: ['string', 'number', 'node'],
        },
        {
          field: 'value3',
          match: ['string', 'number', 'node'],
        },
        {
          field: 'value3sub',
          match: ['string', 'number', 'node'],
        },
      ],
    },
    {
      label: 'listB',
      elements: [
        {
          field: 'title',
          match: ['string'],
        },

        {
          field: 'value1',
          match: ['string', 'number', 'node'],
        },

        {
          field: 'value2',
          match: ['string', 'number', 'node'],
        },

        {
          field: 'value3',
          match: ['string', 'number', 'node'],
        },
      ],
    },
    {
      label: 'listD',
      elements: [
        {
          field: 'title',
          match: ['string'],
        },

        {
          field: 'value1',
          match: ['string', 'number', 'node'],
        },

        {
          field: 'chip',
          match: ['string', 'status'],
        },
        {
          field: 'value2',
          match: ['string', 'number', 'node'],
        },
        {
          field: 'value3',
          match: ['string', 'number', 'node'],
        },
      ],
    },
    {
      label: 'listE',
      elements: [
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
          match: ['string', 'number', 'node'],
        },
        {
          field: 'value1sub',
          match: ['string', 'number', 'node'],
        },

        {
          field: 'value2',
          match: ['string', 'number', 'node'],
        },
        {
          field: 'priority',
          match: ['slider'],
        },
      ],
    },
    {
      label: 'listG',
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
          match: ['string', 'number', 'node'],
        },
        {
          field: 'value1',
          match: ['string', 'number', 'node', 'tags', 'date', 'date-time'],
        },
        {
          field: 'value1sub',
          match: ['string', 'number', 'node', 'tags', 'date', 'date-time'],
        },
        {
          field: 'value2',
          match: ['string', 'number', 'node', 'tags', 'date', 'date-time'],
        },
        {
          field: 'value2sub',
          match: ['string', 'number', 'node', 'tags', 'date', 'date-time'],
        },
        {
          field: 'value3',
          match: ['string', 'number', 'node', 'tags', 'date', 'date-time'],
        },
        {
          field: 'value3sub',
          match: ['string', 'number', 'node'],
        },
        {
          field: 'value4',
          match: ['status'],
        },
      ],
    },
  ];
};

export default getLists;
