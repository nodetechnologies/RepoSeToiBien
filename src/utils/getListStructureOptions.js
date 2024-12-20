const getListStructureOptions = () => {
  return [
    {
      structure: 'cardsuninvoiced',
      element: [
        {
          name: 'approvalFlow',
          type: 'select',
          selections: ['yes', 'no'],
        },
        {
          name: 'statusDone',
          type: 'select',
          selections: ['1', '2', '3'],
        },
        {
          name: 'displayItemStyle',
          type: 'select',
          selections: ['full', 'detailsOnly'],
        },
        {
          name: 'allowPublicView',
          type: 'select',
          selections: ['yes', 'no'],
        },
        {
          name: 'defaultDaysTarget',
          type: 'number',
          selections: [],
        },
      ],
    },
    {
      structure: 'cardsinvoiced',
      element: [
        {
          name: 'allowPublicPayment',
          type: 'select',
          selections: ['yes', 'no'],
        },
        {
          name: 'activateReview',
          type: 'select',
          selections: ['yes', 'no'],
        },
      ],
    },
    {
      structure: 'services',
      preferences: [
        {
          name: 'calculationRate',
          type: 'number',
          selections: [],
        },
      ],
    },
    {
      structure: 'passes',
      preferences: [
        {
          name: 'confirmationPresenceEmail',
          type: 'select',
          selections: ['notAtAll', 'yes24h', 'yes48h', 'yes72h'],
        },
        {
          name: 'doneStatus',
          type: 'select',
          selections: ['1', '2', '3'],
        },
        {
          name: 'assignationNotification',
          type: 'select',
          selections: ['yes', 'no'],
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
          name: 'cardMirror',
          type: 'select',
          selections: ['yes', 'no'],
        },
      ],
    },
    {
      structure: 'profiles',
      preferences: [
        {
          name: 'displayName',
          type: 'select',
          selections: ['name', 'attributes', 'default'],
        },
      ],
    },
  ];
};

export default getListStructureOptions;
