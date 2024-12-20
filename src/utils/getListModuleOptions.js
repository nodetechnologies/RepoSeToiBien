const getListModuleOptions = () => {
  return [
    {
      structure: 'contacts',
      preferences: [
        {
          name: 'segment',
          type: 'select',
          selections: ['all', 'targetPrefix', 'structureIdentifiant'],
        },
        {
          name: 'listType',
          type: 'select',
          selections: ['listA'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView'],
        },
      ],
      element: [
        {
          name: 'email',
          type: 'select',
          selections: ['yes', 'no'],
        },
      ],
    },
    {
      structure: 'cardsinvoiced',
      preferences: [
        {
          name: 'listType',
          type: 'select',
          selections: ['listCards'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView'],
        },
      ],
      element: [
        {
          name: 'email',
          type: 'select',
          selections: ['yes', 'no'],
        },
        {
          name: 'print',
          type: 'select',
          selections: ['yes', 'no'],
        },
        {
          name: 'payment',
          type: 'select',
          selections: ['yes', 'no'],
        },
      ],
    },
    {
      structure: 'cardsuninvoiced',
      preferences: [
        {
          name: 'listType',
          type: 'select',
          selections: ['listCards'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView'],
        },
      ],
      element: [
        {
          name: 'email',
          type: 'select',
          selections: ['yes', 'no'],
        },
        {
          name: 'print',
          type: 'select',
          selections: ['yes', 'no'],
        },
      ],
    },

    {
      structure: 'services',
      preferences: [
        {
          name: 'segment',
          type: 'select',
          selections: ['all'],
        },
        {
          name: 'listType',
          type: 'select',
          selections: ['listB'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView', 'edit'],
        },
      ],
    },
    {
      structure: 'articles',
      preferences: [
        {
          name: 'segment',
          type: 'select',
          selections: ['all'],
        },
        {
          name: 'listType',
          type: 'select',
          selections: ['listB'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView', 'edit'],
        },
      ],
    },
    {
      structure: 'tasks',
      preferences: [
        {
          name: 'segment',
          type: 'select',
          selections: ['all'],
        },
        {
          name: 'listType',
          type: 'select',
          selections: ['listE'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView', 'edit'],
        },
      ],
    },
    {
      structure: 'passes',
      preferences: [
        {
          name: 'segment',
          type: 'select',
          selections: ['all', 'agenda'],
        },
        {
          name: 'dateRange',
          type: 'select',
          selections: ['today', 'week'],
        },
        {
          name: 'listType',
          type: 'select',
          selections: ['calendar', 'kanban', 'listC'],
        },
        {
          name: 'cardModel',
          type: 'select',
          selections: ['short', 'extend'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView', 'edit'],
        },
      ],
    },
    {
      structure: 'nodies',
      preferences: [
        {
          name: 'segment',
          type: 'select',
          selections: ['all', 'structureIdentifiant'],
        },
        {
          name: 'listType',
          type: 'select',
          selections: ['listF'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView'],
        },
      ],
    },
    {
      structure: 'grids',
      preferences: [
        {
          name: 'segment',
          type: 'select',
          selections: ['all', 'structureIdentifiant'],
        },
        {
          name: 'dateRange',
          type: 'select',
          selections: ['today', 'week', 'agenda', 'month', 'none'],
        },
        {
          name: 'cardModel',
          type: 'select',
          selections: ['short', 'extend'],
        },
        {
          name: 'listType',
          type: 'select',
          selections: ['kanban', 'listF'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView', 'edit'],
        },
      ],
    },
    {
      structure: 'storages',
      preferences: [
        {
          name: 'segment',
          type: 'select',
          selections: ['all', 'structureIdentifiant'],
        },
        {
          name: 'listType',
          type: 'select',
          selections: ['listD'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView', 'edit'],
        },
      ],
    },
    {
      structure: 'profiles',
      preferences: [
        {
          name: 'segment',
          type: 'select',
          selections: ['all', 'structureIdentifiant'],
        },
        {
          name: 'listType',
          type: 'select',
          selections: ['listD'],
        },
        {
          name: 'onClick',
          type: 'select',
          selections: ['open', 'quickView', 'edit'],
        },
      ],
    },
  ];
};

export default getListModuleOptions;
