export const structures = {
  contacts: {
    defaultFields: [
      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },
      {
        targetPrefix: {
          fr: 'Préfixe',
          en: 'Prefix',
          type: 'string',
          transform: 'upper',
          regex: '^[A-Z]{2,4}$',
        },
      },
      {
        targetEmail: {
          fr: 'Courriel',
          en: 'Email',
          type: 'string',
          transform: 'none',
          regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
        },
      },
      {
        targetPhone: {
          fr: 'Téléphone',
          en: 'Phone',
          type: 'string',
          regex: '^[0-9-]+$',
        },
      },
      {
        targetReference: {
          fr: 'Référence',
          en: 'Reference',
          type: 'string',
          regex: 'none',
        },
      },
      {
        targetLang: {
          fr: 'Language',
          en: 'Langue',
          type: 'selection',
          regex: 'none',
        },
      },
      {
        targetAddress: {
          fr: 'Adresse',
          en: 'Address',
          type: 'geo',
          regex: 'none',
        },
      },
    ],
    hookedWith: ['card', 'profile', 'grid', 'log'],
    module: 'CONTACTS',
    possibilities: ['search', 'sort'],
    type: 'once',
  },
  articles: {
    defaultFields: [
      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },
      {
        description: {
          fr: 'Description',
          en: 'Description',
          type: 'string',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        price: {
          fr: 'Prix',
          en: 'Price',
          type: 'number',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        fees: {
          fr: 'Frais',
          en: 'Fees',
          type: 'number',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        sku: {
          fr: 'UGS',
          en: 'SKU',
          type: 'string',
          transform: 'noSpecial',
          regex: '^[a-zA-Z0-9-]+$',
        },
      },
    ],
    hookedWith: [],
    module: 'ARTICLES',
    possibilities: ['search', 'sort'],
    type: 'once',
  },
  services: {
    defaultFields: [
      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },
      {
        description: {
          fr: 'Description',
          en: 'Description',
          type: 'string',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        price: {
          fr: 'Prix',
          en: 'Price',
          type: 'number',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        duration: {
          fr: 'Durée',
          en: 'Duration',
          type: 'number',
          transform: 'none',
          regex: 'none',
        },
      },
    ],
    hookedWith: ['article', 'grid'],
    module: 'SERVICES',
    possibilities: ['search'],
    type: 'once',
  },
  card: {
    defaultFields: [
      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },
      {
        targetId: {
          fr: 'Contact',
          en: 'Contact',
          type: 'search',
          transform: 'none',
          regex: 'none',
          selections: ['business:contacts'],
        },
      },
      {
        targetProfileId: {
          fr: 'Profil principal',
          en: 'Principal profile',
          type: 'hook',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        targetDate: {
          fr: 'Échéance',
          en: 'Due',
          type: 'date',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        assignedToId: {
          fr: 'Assignée à',
          en: 'Assigned to',
          type: 'node',
          transform: 'none',
          regex: 'none',
          selections: ['business:employees'],
        },
      },
      {
        status: {
          fr: 'Statut',
          en: 'Status',
          type: 'status',
          transform: 'none',
          regex: 'none',
        },
      },
    ],
    hookedWith: [
      'profile',
      'service',
      'article',
      'pass',
      'task',
      'log',
      'grid',
    ],
    module: 'CARDS',
    possibilities: [
      'search',
      'sort',
      'multi',
      'targetDate',
      'status',
      'shareable',
    ],
    type: 'once',
  },
  passes: {
    defaultFields: [
      {
        targetId: {
          fr: 'Contact',
          en: 'Contact',
          type: 'search',
          transform: 'none',
          regex: 'none',
          selections: ['business:contacts'],
        },
      },
      {
        targetProfileId: {
          fr: 'Profil principal',
          en: 'Principal profile',
          type: 'hook',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },
      {
        startDate: {
          fr: 'Début',
          en: 'Start',
          type: 'date-time',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        endDate: {
          fr: 'Find',
          en: 'End',
          type: 'date-time',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        locationId: {
          fr: 'Lieu',
          en: 'Location',
          type: 'node',
          transform: 'none',
          regex: 'none',
          selections: ['business:locations'],
        },
      },
      {
        assignedToId: {
          fr: 'Assignée à',
          en: 'Assigned to',
          type: 'node',
          transform: 'none',
          regex: 'none',
          selections: ['business:employees'],
        },
      },
      {
        status: {
          fr: 'Statut',
          en: 'Status',
          type: 'status',
          transform: 'none',
          regex: 'none',
        },
      },
    ],
    hookedWith: ['profile', 'card'],
    possibilities: ['sort', 'date', 'status', 'dependency', 'shareable'],
    type: 'once',
    module: 'PASSES',
  },
  tasks: {
    defaultFields: [
      {
        targetId: {
          fr: 'Contact',
          en: 'Contact',
          type: 'search',
          transform: 'none',
          regex: 'none',
          selections: ['business:contacts'],
        },
      },

      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },
      {
        targetDate: {
          fr: 'Date prévisionnelle',
          en: 'Target date',
          type: 'date',
          transform: 'none',
          regex: 'none',
        },
      },
    ],

    hookedWith: ['profile', 'card'],
    possibilities: ['sort', 'search', 'targetDate', 'date'],
    type: 'multi',
  },
  items: {
    defaultFields: [
      {
        targetId: {
          fr: 'Contact',
          en: 'Contact',
          type: 'search',
          transform: 'none',
          regex: 'none',
          selections: ['business:contacts'],
        },
      },
      {
        targetProfileId: {
          fr: 'Profil principal',
          en: 'Principal profile',
          type: 'hook',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },
      {
        description: {
          fr: 'Description',
          en: 'Description',
          type: 'string',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        unitPrice: {
          fr: 'Prix unitaire',
          en: 'Unit price',
          type: 'number',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        quantity: {
          fr: 'Quantité',
          en: 'Quantity',
          type: 'number',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        status: {
          fr: 'Statut',
          en: 'Status',
          type: 'status',
          transform: 'none',
          regex: 'none',
        },
      },
    ],
    hookedWith: ['card', 'user'],
    possibilities: ['sort', 'search', 'date'],
    type: 'multi',
  },
  grids: {
    defaultFields: [
      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },
    ],
    hookedWith: ['profile', 'card'],
    possibilities: ['sort', 'multi', 'status', 'shareable'],
    type: 'multi',
  },
  nodies: {
    defaultFields: [
      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },

      {
        targetId: {
          fr: 'Contact',
          en: 'Contact',
          type: 'search',
          transform: 'none',
          regex: 'none',
          selections: ['business:contacts'],
        },
      },

      {
        targetDate: {
          fr: 'Échéance',
          en: 'Due',
          type: 'date',
          transform: 'none',
          regex: 'none',
        },
      },
      {
        assignedToId: {
          fr: 'Assignée à',
          en: 'Assigned to',
          type: 'node',
          transform: 'none',
          regex: 'none',
          selections: ['business:employees'],
        },
      },
      {
        status: {
          fr: 'Statut',
          en: 'Status',
          type: 'status',
          transform: 'none',
          regex: 'none',
        },
      },
    ],
    hookedWith: ['profile', 'card'],
    possibilities: ['sort', 'dependency', 'multi', 'targetDate'],
    type: 'multi',
  },
  profiles: {
    defaultFields: [
      {
        targetId: {
          fr: 'Contact',
          en: 'Contact',
          type: 'search',
          transform: 'none',
          regex: 'none',
          selections: ['business:contacts'],
        },
      },
      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },
    ],
    hookedWith: ['profile', 'card'],
    possibilities: ['sort', 'search', 'multi'],
    type: 'multi',
  },
  storages: {
    defaultFields: [
      {
        targetId: {
          fr: 'Contact',
          en: 'Contact',
          type: 'search',
          transform: 'none',
          regex: 'none',
          selections: ['business:contacts'],
        },
      },
      {
        name: {
          fr: 'Nom',
          en: 'Name',
          type: 'string',
          transform: 'cap',
          regex: 'none',
        },
      },
    ],
    hookedWith: ['profile', 'card'],
    possibilities: ['search', 'multi', 'dependency'],
    type: 'multi',
  },
};

export const possibilities = {
  multi: {
    value: 'multi',
    description: 'none',
  },
  search: {
    value: 'search',
    description: 'none',
  },
  sort: {
    value: 'sort',
    description: 'none',
  },
  date: {
    value: 'date',
    description: 'none',
  },
  targetDate: {
    value: 'targetDate',
    description: 'none',
  },
  status: {
    value: 'status',
    description: 'none',
  },
  shareable: {
    value: 'shareable',
    description: 'none',
  },
  dependency: {
    value: 'dependency',
    description: 'none',
  },
};
