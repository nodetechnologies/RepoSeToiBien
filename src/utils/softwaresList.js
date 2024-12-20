const softwaresList = [
  {
    name: '4me',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/0d80bd3a-8207-426d-80e8-8aa75f5db662.png',
    category: 'operations',
  },
  {
    name: 'AWeber',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/d1295a5e-5c9a-4a88-b584-c861c71007fc.png',
    category: 'marketing',
  },
  {
    name: 'Accelo',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e36d9d8c-8188-40e9-9fbf-9f4b5433e4ee.png',
    category: 'operations',
  },
  {
    name: 'Act-On',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/63ff5b87-a5d4-4098-b6a6-4bd42c0574f1.png',
    category: 'marketing',
  },
  {
    name: 'ActionKit',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/3520b8f3-640a-4d07-95af-e01c4cfebba7.png',
    category: 'marketing',
  },
  {
    name: 'ActiveCampaign',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/0cf5156f-ea17-4023-9487-e664f22c934e.png',
    category: 'marketing',
  },
  {
    name: 'ActiveTrail',
    logo: 'https://zenprospect-production.s3.amazonaws.com/uploads/pictures/624ae253a653580001564aa4/picture',
    category: 'marketing',
  },
  {
    name: 'Acuity Scheduling',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/00e032dd-9e52-4b39-9956-300543d1a8df.png',
    category: 'productivity',
  },
  {
    name: 'Acumbamail',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/af10bb98-d29f-4e85-b371-f4a76b31b8c8.png',
    category: 'marketing',
  },
  {
    name: 'AddEvent',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/86afbcea-898d-4039-9f66-e29165aa7b0c.png',
    category: 'operations',
  },
  {
    name: 'Agendor',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/218b3993-7ae2-4095-865f-3ccdb3c1d66b.png',
    category: 'productivity',
  },
  {
    name: 'Agile CRM',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/33e2cea1-9d9d-487f-8f50-5f7da00966e2.png',
    category: 'marketing',
  },
  {
    name: 'Aha!',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ea7ed496-8158-41ac-a1be-543200381b45.png',
    category: 'productivity',
  },
  {
    name: 'Aircall',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/fc097f6f-a580-46b2-8e5b-d94edb23fc9f',
    category: 'operations',
  },
  {
    name: 'Airtable',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/09567c00-72b6-42e9-82fd-8ab37cbef489.png',
    category: 'productivity',
  },
  {
    name: 'Alegra',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/70c5a1b7-eb09-4a3f-a915-f22a68a07ee2.png',
    category: 'finances',
  },
  {
    name: 'Amazon SES',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ddfde745-8527-42eb-b6c4-55ba424ed101.jobs',
    category: 'marketing',
  },
  {
    name: 'Amplitude',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/11875f5a-45cf-43af-be36-808001940c4c.png',
    category: 'marketing',
  },
  {
    name: 'Apollo',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e25f7cdf-51ef-4370-abf3-894c22210b02.png',
    category: 'marketing',
  },
  {
    name: 'Asana',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/bd00a8fd-d309-4d42-ad95-e7aa7536c495.png',
    category: 'productivity',
  },
  {
    name: 'Avalara',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b46c9d93-5f8e-4ea5-8862-710c7c47047c.png',
    category: 'finances',
  },
  {
    name: 'Basecamp3',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/6656082d-f3dc-49e6-961b-7d3b4ea1b8a5.png',
    category: 'productivity',
  },
  {
    name: 'Beehiiv',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/3bf7b0ee-ea03-4e9c-a34e-19dba8186b52.png',
    category: 'marketing',
  },
  {
    name: 'Benchmark Email',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b130801c-54b0-4484-838d-782939375f2a.png',
    category: 'marketing',
  },
  {
    name: 'Better Proposals',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b2583f8a-7be5-4153-8c5c-2cd01a2b0244.png',
    category: 'productivity',
  },
  {
    name: 'BirdSend',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/48cefeb9-b937-434a-829c-914178b8230d.png',
    category: 'marketing',
  },
  {
    name: 'Bitbucket',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a36adc65-49a2-4b36-92e5-10fe3a8ee528.png',
    category: 'productivity',
  },
  {
    name: 'Blastable',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/f4a5310a-b04c-4382-abcf-67baa57b4798.png',
    category: 'marketing',
  },
  {
    name: 'BoldDesk',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/59cec7da-8493-4671-8b45-69493843798e.png',
    category: 'operations',
  },
  {
    name: 'Bonusly',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/66c9d4a3-8207-4b1a-8886-695670fe32a0.png',
    category: 'hr',
  },
  {
    name: 'Box',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b9bb0c21-2f8a-4d96-b046-677b11c50a74.png',
    category: 'productivity',
  },
  {
    name: 'Breezy HR',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/5139eda7-19b3-4497-bc08-611b20efcbc6.png',
    category: 'hr',
  },
  {
    name: 'Brevo',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/d9b26745-7bce-46f2-baf3-9f49e7be0c09.png',
    category: 'marketing',
  },
  {
    name: 'CSV App',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/070eff23-3c01-4fe0-8a45-93cc5074d8de.png',
    category: 'productivity',
  },
  {
    name: 'Calendly',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a6abd4a1-1490-4c40-b5a4-ef1df0a325c0.png',
    category: 'productivity',
  },
  {
    name: 'Campaign Monitor',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e9506332-41fc-4ecc-90fa-83cc8026134b.png',
    category: 'marketing',
  },
  {
    name: 'Campaign Refinery',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a45364b8-8501-439a-9a26-5fe92774c88c',
    category: 'marketing',
  },
  {
    name: 'Canny',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ef968713-c9b9-4a2b-b47a-a41d47312983.png',
    category: 'productivity',
  },
  {
    name: 'Capsule CRM',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/da7637df-9551-445d-b123-7e52e2a8d59c.png',
    category: 'marketing',
  },
  {
    name: 'Chargebee',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/0989d484-fe98-4211-9644-f6dcec3e8ced.png',
    category: 'finances',
  },
  {
    name: 'Chargify',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/1bf7636b-3257-488e-8433-3ac39b995d12.png',
    category: 'finances',
  },
  {
    name: 'Circle',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/039d16a0-bad3-4f92-8f45-cf7d870eba9d.png',
    category: 'operations',
  },
  {
    name: 'CleverReach',
    logo: 'https://zenprospect-production.s3.amazonaws.com/uploads/pictures/62db700a0f55e80001f0d1e3/picture',
    category: 'marketing',
  },
  {
    name: 'ClickSend',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/03f44ca3-36a2-45be-8c85-1e56bb3264a9.png',
    category: 'marketing',
  },
  {
    name: 'ClickUp',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/bb73c9f8-f4e3-4b3a-9078-1a9337ca64f3.png',
    category: 'productivity',
  },
  {
    name: 'Clickfunnels',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/4e37f793-84e9-419c-a17b-0873883ac9da.png',
    category: 'marketing',
  },
  {
    name: 'Clickpost',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b31e2b67-0dc2-42db-9d69-59b144bbf271',
    category: 'operations',
  },
  {
    name: 'Cliengo',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/20ba8e6e-dadb-472f-92b8-d91562475ba2.png',
    category: 'marketing',
  },
  {
    name: 'Clientary',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/5783a12c-31bd-4afe-a341-c3619c09c388.png',
    category: 'finances',
  },
  {
    name: 'ClinchPad',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b082773a-3092-405b-9ff8-b7ded3208695.png',
    category: 'marketing',
  },
  {
    name: 'Clockify',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/c355bb5c-e000-4e75-9e99-26cffa88fc15.png',
    category: 'productivity',
  },
  {
    name: 'Close.io',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/95840764-5a36-4fe7-872c-c14d2b1c5d24.png',
    category: 'marketing',
  },
  {
    name: 'Coda',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/f47f1c03-0a05-4a87-8afe-7f59d166f96a.png',
    category: 'productivity',
  },
  {
    name: 'Coinbase Commerce',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b2d1a5e1-8939-4f0d-bdad-7f6bb74688db.png',
    category: 'finances',
  },
  {
    name: 'Constant Contact',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/3a182770-fa2d-4cd6-86be-775c007eb98a.png',
    category: 'marketing',
  },
  {
    name: 'Contactually',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/86189f94-a148-4f10-af74-acda28d94921.png',
    category: 'marketing',
  },
  {
    name: 'ConvertKit',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/8e719769-fb23-4d43-8339-5c034e7b2bf5.png',
    category: 'marketing',
  },
  {
    name: 'Copper',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ea7daf41-3a19-4bad-940b-03699f76ca57.png',
    category: 'marketing',
  },
  {
    name: 'Customer.guru',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/7e514bdf-4757-471c-845a-d26be61d6190.png',
    category: 'marketing',
  },
  {
    name: 'Customer.io',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/5ab843b0-a437-4989-bd0e-ce2fa81a3020.png',
    category: 'marketing',
  },
  {
    name: 'Cvent',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/7b99b4d6-9984-4f33-b42b-3a0f7a00dc84.png',
    category: 'operations',
  },
  {
    name: 'Datadog',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/485c7ad5-1497-483d-b045-768dda4d2fed.png',
    category: 'operations',
  },
  {
    name: 'Dealfront',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/bac8c747-f932-4874-83ee-1754dd95237e.png',
    category: 'marketing',
  },
  {
    name: 'Delighted',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/5d91b1e0-d532-48d4-9570-8c6e584281f6.png',
    category: 'operations',
  },
  {
    name: 'Demio',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/3dfbb210-3d6a-4c15-b796-3e526f8c94bd.png',
    category: 'marketing',
  },
  {
    name: 'Disqus',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/68c4cc99-0fa7-4fe0-a047-3b43d12a308b.png',
    category: 'marketing',
  },
  {
    name: 'DocuSign',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e0d600e5-498e-430a-919e-2aa49dcaf40e.png',
    category: 'productivity',
  },
  {
    name: 'Doneday',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/check-black.png',
    category: 'productivity',
  },
  {
    name: 'DotDigital',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ea6973a8-3f9e-46a2-a140-f552c6e86f7b.png',
    category: 'marketing',
  },
  {
    name: 'Drip',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/be3fddb5-90d1-4a96-acbc-d89738120ca5.png',
    category: 'marketing',
  },
  {
    name: 'Dropbox',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/84acf73d-1295-4a97-8907-7e74c7c6f03e.png',
    category: 'productivity',
  },
  {
    name: 'E-goi',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/53ca1f28-c4c1-47e3-828e-2a4f1e6b1803.png',
    category: 'marketing',
  },
  {
    name: 'Elastic Email',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/f5400cd9-e53a-4546-a56b-bbd9d2f94243.png',
    category: 'marketing',
  },
  {
    name: 'Eventbrite',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e2d0f04f-af29-4bec-8f83-7390733fe970.com',
    category: 'operations',
  },
  {
    name: 'Everhour',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/4f47e4db-2313-42d7-b555-d975cca43dd3.png',
    category: 'productivity',
  },
  {
    name: 'EveryAction',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e1319add-5867-4021-bec7-92ea7035f317.png',
    category: 'operations',
  },
  {
    name: 'Excel Online',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/add6ef2b-c3a6-49ac-8ed9-d8870eda6294.png',
    category: 'productivity',
  },
  {
    name: 'FTP',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/f0ef7905-334b-4335-9843-a54855d301e5.png',
    category: 'operations',
  },
  {
    name: 'Featurebase',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b873be7f-8440-4026-860b-bfd41ddafc97.png',
    category: 'operations',
  },
  {
    name: 'File Append App',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/481133f6-0217-4225-b9b2-d045df858f26.png',
    category: 'productivity',
  },
  {
    name: 'Filters',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/3e48c61f-ca93-4d1f-9e5e-ace9e5b0cc4a.png',
    category: 'operations',
  },
  {
    name: 'Fireberry',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/f58b4092-1cd6-490f-9d06-2a0a2f91dcfd.png',
    category: 'marketing',
  },
  {
    name: 'Fireflies.ai',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/79d9c90b-cb57-4aac-921c-83c11d428d2e',
    category: 'productivity',
  },
  {
    name: 'Float',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/0d4cf356-160e-4301-9706-8aae7ca9acdc.png',
    category: 'productivity',
  },
  {
    name: 'Follow Up Boss',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b0f63632-69fe-43af-8c1d-4d201691dcae.png',
    category: 'marketing',
  },
  {
    name: 'Formstack',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/711ddd32-15a4-49eb-8db1-6a9654850139.png',
    category: 'productivity',
  },
  {
    name: 'Freedcamp',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/eff432a5-b905-4014-9755-3f92bd10f66a.png',
    category: 'productivity',
  },
  {
    name: 'FreshBooks',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/2ec9cb0f-fcec-456d-afcc-43c64e1f88dc.png',
    category: 'finances',
  },
  {
    name: 'Freshdesk',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/73c9860c-8c46-4da3-b751-9113538d7ec4.png',
    category: 'operations',
  },
  {
    name: 'Freshsales',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/37a6bc42-d46b-46ec-98f7-ee34e26cd600.png',
    category: 'marketing',
  },
  {
    name: 'Freshworks CRM',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/2e033cb8-fb2e-4ad3-93a9-b1dc5b10572e.png',
    category: 'marketing',
  },
  {
    name: 'Front',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/9cb156e7-1ec9-47bf-81e5-ba304e2a94fa.png',
    category: 'operations',
  },
  {
    name: 'Full Contact',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/3b011168-71e1-4588-8f46-4dcc88d147d7.png',
    category: 'marketing',
  },
  {
    name: 'GetProspect',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/432cbba9-ddc6-4ba5-bc1c-0d55b75744f8.png',
    category: 'marketing',
  },
  {
    name: 'GetResponse',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/f8fd429c-f0e5-4808-b4de-634869d22c52.png',
    category: 'marketing',
  },
  {
    name: 'GitHub',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/7aed9128-9c22-4b24-a2d3-3aca491f3ba3.png',
    category: 'productivity',
  },
  {
    name: 'GoTo Meeting',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/2c605112-290a-46a5-8347-6c71b93781d5.png',
    category: 'operations',
  },
  {
    name: 'GoTo Webinar',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/9a3b0310-01cb-4503-a35d-ef3eb145ff2e.png',
    category: 'operations',
  },
  {
    name: 'Gong',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/30c64073-6329-4ab7-b605-5abfa690e565.png',
    category: 'operations',
  },
  {
    name: 'Google Calendar',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/6709a3e3-905e-4c21-b60b-271bdc66da43.png',
    category: 'productivity',
  },
  {
    name: 'Google Contacts',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/7bd15606-1085-4069-aa38-7078246de5ee.png',
    category: 'operations',
  },
  {
    name: 'Google Forms',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/79428583-7c6c-47dd-9948-14c5ba0b7052',
    category: 'productivity',
  },
  {
    name: 'Google Geocoding API',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ab92cc35-af4c-4279-ac73-7e90dcd13f1c.png',
    category: 'operations',
  },
  {
    name: 'Google Places API',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a192ca92-6802-43b4-8389-21d3b12728b2',
    category: 'operations',
  },
  {
    name: 'Google Sheets',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/3bc29776-8732-4ccb-8757-ae714725cfb2.png',
    category: 'productivity',
  },
  {
    name: 'Gravity Forms',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/96f2a78c-09cc-4a84-b9ca-8176b8d138c0.png',
    category: 'productivity',
  },
  {
    name: 'Greenhouse',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/29ee5948-b3fb-4bd0-8ec5-9d57f96d039f.png',
    category: 'hr',
  },
  {
    name: 'Groove',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ba2b609a-c317-489b-94e2-92cc9a07e8b4.png',
    category: 'operations',
  },
  {
    name: 'Harvest',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/1fff47c4-2f51-4db2-9cd8-0dbd85b9c6e8.png',
    category: 'finances',
  },
  {
    name: 'Help Scout',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a4ded608-7b18-4549-a77c-c9c8e7b0fac5.png',
    category: 'operations',
  },
  {
    name: 'Highlevel',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/5a65fffc-3995-45b0-9a39-6a27b8ca83cc.png',
    category: 'marketing',
  },
  {
    name: 'Hive',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b967934c-5369-497a-bc41-d112d072b828.png',
    category: 'productivity',
  },
  {
    name: 'Hiveage',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/35b92fad-c4c2-4243-a5f6-efb32fa1b017.png',
    category: 'finances',
  },
  {
    name: 'HubSpot',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ad5ab824-1d5d-4c55-85e8-8aa3113cb000.png',
    category: 'marketing',
  },
  {
    name: 'Hunter',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/bb15a261-b3b4-40bb-bf6c-650285c1e940.png',
    category: 'marketing',
  },
  {
    name: 'Insightly',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/d7ee3d42-aa51-4c38-aa41-e450bdd59236.png',
    category: 'marketing',
  },
  {
    name: 'Instantly',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/68dad85c-03f6-4cfe-baa2-a4b86a2a815f.png',
    category: 'marketing',
  },
  {
    name: 'Intercom',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e57fd3d2-da78-4d55-8bad-94957a3b505c.png',
    category: 'marketing',
  },
  {
    name: 'Interseller',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/fac0fabe-b862-463b-9022-affae225b722.png',
    category: 'marketing',
  },
  {
    name: 'Invoice Ninja',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/82fe2257-ef34-44ca-ae4a-c7e7ce3f0cea.png',
    category: 'finances',
  },
  {
    name: 'Invoiced',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/52ff827f-4b08-4ea0-b03c-9f327c5f1e86.png',
    category: 'finances',
  },
  {
    name: 'Iterable',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/2d16ea03-25d0-41e1-a8ae-a3702a1449b5.png',
    category: 'marketing',
  },
  {
    name: 'JSON',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/f764fa36-67bb-4156-92ad-ce02a6a4f1fe.png',
    category: 'operations',
  },
  {
    name: 'JazzHR',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/8229d930-e741-497e-9a5c-fe6777a4e75c.png',
    category: 'hr',
  },
  {
    name: 'Jira',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/850322d5-c089-455a-ae71-efd377ddec6c.png',
    category: 'productivity',
  },
  {
    name: 'JobNimbus',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/6f5c1d7b-1e36-4cbe-8076-f906fbaf3cda.png',
    category: 'operations',
  },
  {
    name: 'Jotform',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a824a42c-5520-46cc-97a6-83cd822956e9.png',
    category: 'productivity',
  },
  {
    name: 'Judge.me',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/4293c77a-3d05-41c5-900f-0229a74ab032.png',
    category: 'operations',
  },
  {
    name: 'Jumplead',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b69cacbe-c2da-4d97-967e-23b74226d7c1.png',
    category: 'marketing',
  },
  {
    name: 'JustCall',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/18fa58df-6eff-4a9d-9468-6de03e48c709.png',
    category: 'operations',
  },
  {
    name: 'Keap',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/2cd417a9-29f4-4235-936c-8edd6bd5be44.png',
    category: 'marketing',
  },
  {
    name: 'Klaviyo',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/524d4923-d63e-45c8-bb4c-1028c5950e43.png',
    category: 'marketing',
  },
  {
    name: 'Klenty',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e98838b0-fc7f-4a24-9520-f01df49458d0.png',
    category: 'marketing',
  },
  {
    name: 'Knack',
    logo: 'https://zenprospect-production.s3.amazonaws.com/uploads/pictures/64bbc4284026e000015f2bf0/picture',
    category: 'operations',
  },
  {
    name: 'LeadDyno',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/23addff6-8c73-44e2-a06f-a4a32ca4606e.png',
    category: 'marketing',
  },
  {
    name: 'LeadSquared',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/809b0ce5-186c-4b63-9578-5791e6b28023.png',
    category: 'marketing',
  },
  {
    name: 'Leap CRM',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/44f22533-09a2-4f4c-9f50-6cfe2ead127d',
    category: 'marketing',
  },
  {
    name: 'Lemlist',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/afaeb623-1a2a-4ba0-bf4a-8ddeb32b6a7c.png',
    category: 'marketing',
  },
  {
    name: 'Less Annoying CRM',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/86f2aa31-9d08-4b03-b2c2-911d72794cd9.com',
    category: 'marketing',
  },
  {
    name: 'Linear',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/4a7072de-4b8e-4e20-ae35-a34ace3491fc.png',
    category: 'productivity',
  },
  {
    name: 'LinkedIn',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/4fff9e03-8802-4dda-bd87-105db0a117d7.png',
    category: 'marketing',
  },
  {
    name: 'Liondesk CRM',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/4eb926ed-66b8-44f3-be2b-23c5ed772875.png',
    category: 'marketing',
  },
  {
    name: 'LiquidPlanner',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/d7f82c4e-588b-4a6c-8436-15e29927b340.png',
    category: 'productivity',
  },
  {
    name: 'Loops',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/68d93ccb-fb7b-411f-ac79-45efbafdc2df',
    category: 'marketing',
  },
  {
    name: 'MailUp',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/da44279a-938e-47a8-9705-ce3c6acf672e.png',
    category: 'marketing',
  },
  {
    name: 'MailWizz',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/1582f7ae-74c1-452c-8958-4c1d3eaab9f2.png',
    category: 'marketing',
  },
  {
    name: 'Mailchimp',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/316c9627-8f84-4e83-9264-6e4fcf06cf0c.png',
    category: 'marketing',
  },
  {
    name: 'Mailchimp Transactional',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/3ef81a82-3bca-49a7-8296-2de3d4b695cd.png',
    category: 'marketing',
  },
  {
    name: 'MailerLite',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/dc9900ed-2d30-4208-a0ad-8e3328305808.png',
    category: 'marketing',
  },
  {
    name: 'Mailgun',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/bf0f2e98-96a0-435d-9419-f10723d4d136.png',
    category: 'marketing',
  },
  {
    name: 'Mailjet',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/1341471f-9496-4a26-9d86-a42cc70e2961.png',
    category: 'marketing',
  },
  {
    name: 'Marketo',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e8bfc2c3-1e54-4b7f-a412-d3410a9e9216.png',
    category: 'marketing',
  },
  {
    name: 'Mautic',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/78f64f8e-6c2f-4ba9-82b7-7e9f062f4575.png',
    category: 'marketing',
  },
  {
    name: 'MeisterTask',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a7e51f71-4f12-42ba-87e7-aeefee056bd2.png',
    category: 'productivity',
  },
  {
    name: 'Memory Store',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/8fc7abc0-0719-4845-bdba-2b1835448e23.png',
    category: 'operations',
  },
  {
    name: 'MessageBird',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/7ea66e94-661f-46da-a814-2fa103076db5.png',
    category: 'marketing',
  },
  {
    name: 'Microsoft Dynamics 365 CRM',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b8a226a4-09f8-4239-a044-0caffb4f1bb0.png',
    category: 'marketing',
  },
  {
    name: 'Microsoft Outlook',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/0ecb71f4-cd26-4b4c-b179-2c9e133ce34e.png',
    category: 'productivity',
  },
  {
    name: 'Microsoft Teams',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/cbd1c59f-6a56-4b8c-b613-93e39985da32.png',
    category: 'productivity',
  },
  {
    name: 'Minelead',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b9f53282-b277-411f-9d1b-78577f7ae0b2.png',
    category: 'marketing',
  },
  {
    name: 'Miro',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/6e6fe305-6ecf-48cc-b762-45ea449a6daf.png',
    category: 'productivity',
  },
  {
    name: 'Mitto',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/796dac3d-7e3a-4924-aecd-a6cb3b01eee6',
    category: 'marketing',
  },
  {
    name: 'Moco',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/8ecce2fe-cbb0-42ae-a6b7-a16131e3cc57.png',
    category: 'operations',
  },
  {
    name: 'Monday.com',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/c94d484a-8f9f-4df3-9dc7-df074241d733.png',
    category: 'productivity',
  },
  {
    name: 'MongoDB',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e553e092-937d-4a5d-9795-fc8d12f32574.png',
    category: 'operations',
  },
  {
    name: 'MoonMail',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/3a349dc5-fd3e-4ac2-95a6-13ea646b5244.png',
    category: 'marketing',
  },
  {
    name: 'Moosend',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/abee1c29-e29c-44d4-adb6-79a9ed4ecd43.png',
    category: 'marketing',
  },
  {
    name: 'Motion',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/d0fb38f3-2dce-44e9-ba87-bd1db858a69a.png',
    category: 'productivity',
  },
  {
    name: 'MySQL',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a95e3fae-2f9e-4258-af47-c905183c0574.png',
    category: 'operations',
  },
  {
    name: 'NetHunt',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/9638926b-1358-4cce-90c7-aab7b8433c72.png',
    category: 'marketing',
  },
  {
    name: 'Netcore Customer Engagement',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/351c0b9e-786d-4611-9996-62adfdfbc307',
    category: 'marketing',
  },
  {
    name: 'Nimble',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/1ea038db-c62d-434a-8c37-2f9c338a9269.png',
    category: 'marketing',
  },
  {
    name: 'Pipeliner CRM',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/264fabc9-2208-41d9-8b8a-cde93e8c2baa.png',
    category: 'marketing',
  },
  {
    name: 'Pixl8',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/58e15e8b-1205-41db-99e2-efc5dc17b769',
    category: 'operations',
  },
  {
    name: 'Podio',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e9be6cdb-9eb2-4baa-bc0d-1a5df86ae267.png',
    category: 'productivity',
  },
  {
    name: 'PostgreSQL',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ba17b26a-3b74-408e-9e6a-a3fd761e1f0a.png',
    category: 'operations',
  },
  {
    name: 'Postmark',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/9f1cf346-3746-4b9d-96eb-768465468084.png',
    category: 'marketing',
  },
  {
    name: 'Prodpad',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/fa4bcaa5-8b61-471d-9034-a18c86d2e143.png',
    category: 'productivity',
  },
  {
    name: 'Quaderno',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/72706857-3e79-4d45-8684-b18b449902eb.png',
    category: 'finances',
  },
  {
    name: 'QuickBooks Online',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e493a92a-fe0f-473d-bfb8-c5ea00ac9010.png',
    category: 'finances',
  },
  {
    name: 'RSS',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/adfff3ed-0b9f-4cf9-a0ad-e2a5b1d1f206.png',
    category: 'marketing',
  },
  {
    name: 'Re:amaze',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ea30c8a7-b64b-48d2-839e-e93adaff384c.png',
    category: 'operations',
  },
  {
    name: 'ReachOut',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a5ba40f3-8bf9-4f79-8ec8-ecbbc635ca34.png',
    category: 'operations',
  },
  {
    name: 'Recruitee',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/550258de-4a3a-45eb-bc70-fb801564c481.png',
    category: 'hr',
  },
  {
    name: 'Redbooth',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/2c1a8f3f-17a2-442c-a8f3-2ad70e2991a0.png',
    category: 'productivity',
  },
  {
    name: 'Redis',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/e36ae53a-bf6b-4d57-8c5e-138ab2a2d57b.png',
    category: 'operations',
  },
  {
    name: 'Referral Rock',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/22f63389-9c31-452b-8656-53fe8b461617.png',
    category: 'marketing',
  },
  {
    name: 'Repsly',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/65a793c9-2de6-4ef9-859f-6c6bc4a3af09.png',
    category: 'operations',
  },
  {
    name: 'Resend',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/086e4a6b-8c00-48d8-a1e0-c8eba618baf5.png',
    category: 'marketing',
  },
  {
    name: 'Respond.io',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/1a98760e-e49d-4799-b4fe-bf464f75caa3.png',
    category: 'marketing',
  },
  {
    name: 'RingCentral',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/7ead3a35-3b1d-4ca7-a678-e0b30d343d16',
    category: 'operations',
  },
  {
    name: 'Sage Accounting',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/d09691c7-c9ac-4166-b526-28c6508835cd',
    category: 'finances',
  },
  {
    name: 'Sage HR',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a654dd56-ed6d-4595-afa4-13fbb668a6b1.png',
    category: 'hr',
  },
  {
    name: 'Salesflare',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/f695cdd7-0fe1-4a87-8286-94a4da32fb69.png',
    category: 'marketing',
  },
  {
    name: 'Salesforce',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/8c446a6b-e1e6-4624-a41a-256172656dee.png',
    category: 'marketing',
  },
  {
    name: 'Salesforce Pardot',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/6d1771cb-907c-431a-8593-0199d659e6ae.png',
    category: 'marketing',
  },
  {
    name: 'Salesmachine',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/c080dec4-7317-4716-ad67-f80630e6a0b5.png',
    category: 'marketing',
  },
  {
    name: 'Salesmate',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/bfeec4b9-abea-4e95-ad42-74ab5d220e6d.png',
    category: 'marketing',
  },
  {
    name: 'Scrumwise',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a3fa921d-fbb5-4c72-9f4f-d802c465e765.png',
    category: 'productivity',
  },
  {
    name: 'Segment',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b9465ff1-518d-4186-89aa-6fe1bd10843a.png',
    category: 'marketing',
  },
  {
    name: 'SendGrid',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/1c88166c-85b3-4fe8-b60c-6c2182fe61bb.png',
    category: 'marketing',
  },
  {
    name: 'SendPulse',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/251a0b99-cb62-4d1d-9caf-3c8fd1e412cc.png',
    category: 'marketing',
  },
  {
    name: 'Sendlane',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/4f657b7d-640f-48b4-a163-387d5ce22f2e.png',
    category: 'marketing',
  },
  {
    name: 'Sendy',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/c9fa0539-7f44-45e0-9e62-20ffcfc38e5a',
    category: 'marketing',
  },
  {
    name: 'ServiceM8',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/d6c8a9f0-e4ff-46c7-a803-b4fa31f8ec27.png',
    category: 'operations',
  },
  {
    name: 'ServiceTitan',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/0207630b-ea73-4edc-80e5-fa59cb9c77e6',
    category: 'operations',
  },
  {
    name: 'SharpSpring',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b09232fd-76ea-45c8-937f-47d81008b362.png',
    category: 'marketing',
  },
  {
    name: 'ShipStation',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/da6eab55-6d11-444e-baa9-f87b2ba6cd80.png',
    category: 'operations',
  },
  {
    name: 'Shortcut',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/3c2cecc1-076d-4204-8352-3cb8d7e102bf.png',
    category: 'productivity',
  },
  {
    name: 'Slack',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/c53aa5ce-1ced-48cb-98cc-8859eb8bf85d.png',
    category: 'productivity',
  },
  {
    name: 'SmartReach',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/2417320a-17b9-457a-a3b9-7301bfd578c0.png',
    category: 'marketing',
  },
  {
    name: 'Smartlead',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/1d100b03-3dfd-4076-ae54-90242c0065d8',
    category: 'marketing',
  },
  {
    name: 'Smartsheet',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a50b9e79-0b86-4936-b031-b25952da427d.png',
    category: 'productivity',
  },
  {
    name: 'Snappy',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/bd671594-6785-4127-b8e1-88c219bf547f.png',
    category: 'hr',
  },
  {
    name: 'SolarWinds',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/83bb965c-e90e-4e9c-a4ff-e87fecbb3e0a.png',
    category: 'operations',
  },
  {
    name: 'SparkPost',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/6c11ccff-6288-4012-b391-c3e58e3ec67e.png',
    category: 'marketing',
  },
  {
    name: 'Splio',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/6007a78d-c45b-4f2b-9e96-b97984b71871.png',
    category: 'marketing',
  },
  {
    name: 'Splitwise',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ee83a8aa-6681-4457-8329-95bcfc1baf66.png',
    category: 'finances',
  },
  {
    name: 'Storage',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/5ee9f9fa-c264-47c2-8e8c-f4849f24d601.png',
    category: 'operations',
  },
  {
    name: 'Stripe',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/870aef31-f0e3-48d5-8378-a8baa5cf4775.png',
    category: 'finances',
  },
  {
    name: 'SupportBee',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/477cfbdd-2085-404a-b12a-fd66d2976eee.png',
    category: 'operations',
  },
  {
    name: 'SurveyMonkey',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b0c4bc7e-b01a-4d7d-885b-81005351bac7.png',
    category: 'marketing',
  },
  {
    name: 'SurveySparrow',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/98f7ebcf-a851-4cc7-b630-888a1ce006f9.png',
    category: 'marketing',
  },
  {
    name: 'Survicate',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/7837ec50-8902-4a1b-b755-3063db11c13a.png',
    category: 'marketing',
  },
  {
    name: 'TaxJar',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/1d8c5361-8faf-4e3c-af44-10761feb2f0b.png',
    category: 'finances',
  },
  {
    name: 'TeamWave',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/71a6b337-ba20-4334-913c-6103bc773d57.png',
    category: 'productivity',
  },
  {
    name: 'Teamgate',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ecd3564e-922c-4938-9ff0-5e6a353f2114.png',
    category: 'marketing',
  },
  {
    name: 'Teamwork Projects',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/5f7d2380-a37c-4c52-8dd2-22237603b45a.png',
    category: 'productivity',
  },
  {
    name: 'TestRail',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/7906451c-02e3-4b86-8ec7-5a23da62424e.png',
    category: 'productivity',
  },
  {
    name: 'TimeCamp',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/f73238a8-2240-4c7d-ad22-c6f3c2500235.png',
    category: 'productivity',
  },
  {
    name: 'Todoist',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/fe3f641c-5400-45f8-958a-0337096b5075.png',
    category: 'productivity',
  },
  {
    name: 'Toggl',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/b9838be3-6dfb-4d78-b2f1-39b6a1df303f.png',
    category: 'productivity',
  },
  {
    name: 'Trello',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/1292f678-3419-4452-ad73-d7d889a7c3bf.com',
    category: 'productivity',
  },
  {
    name: 'Twilio',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/003da8fe-7b24-4763-9a29-f9a64a59c6f4.png',
    category: 'operations',
  },
  {
    name: 'Twist',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/39e9e4c4-7ea3-475f-8313-cb0cb26d5c9b.png',
    category: 'productivity',
  },
  {
    name: 'Typeform',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/45f0f6fe-f255-41c9-8905-fa376eb3fd2a.png',
    category: 'productivity',
  },
  {
    name: 'Unbounce',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/c04ec8fa-7054-46c5-be23-bd465090ea5e.png',
    category: 'marketing',
  },
  {
    name: 'Variables',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/cb11e598-b83f-4b6c-bc2a-29f3782563ef.png',
    category: 'operations',
  },
  {
    name: 'Webflow',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/bb8e9e83-cf36-4b30-bed4-bb4cb66bd3e2.png',
    category: 'marketing',
  },
  {
    name: 'Webhooks',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/9b5c1087-1391-436e-8aa0-895643a1efde.png',
    category: 'operations',
  },
  {
    name: 'WebinarFuel',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/5acbeda4-295c-416a-97e4-e8bc5905bc6d.png',
    category: 'marketing',
  },
  {
    name: 'WorkBoard',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/55e395b7-51b3-4259-9774-3f71ca6d7162.png',
    category: 'productivity',
  },
  {
    name: 'Workstack',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/86d12412-b3ec-4665-9805-cf5fda940afa.png',
    category: 'productivity',
  },
  {
    name: 'Wrike',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a4be3939-4d2b-416c-80c5-2ed7f06ba986.png',
    category: 'productivity',
  },
  {
    name: 'Yammer',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/326760e8-4a3f-499f-bb95-6e07f2dbde8b.png',
    category: 'productivity',
  },
  {
    name: 'Zendesk Sell',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/fb269155-48cb-4551-9fc7-e5e1dc1c8432.png',
    category: 'marketing',
  },
  {
    name: 'Zendesk Support',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/a5f62764-8d8b-4627-a06b-db21a6749120.png',
    category: 'operations',
  },
  {
    name: 'Zoho Books',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/d4990421-67ae-4e73-83fa-d705ec5e0765.png',
    category: 'finances',
  },
  {
    name: 'Zoho CRM',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/ba9aada2-2d43-4d9d-a798-ea5441e940af.png',
    category: 'marketing',
  },
  {
    name: 'Zoho Campaigns',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/beaa88f8-1a2d-46fc-aa6f-85800fcce50a.png',
    category: 'marketing',
  },
  {
    name: 'Zoho Mail',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/132a1439-3bf1-4ef2-a1dd-420fb2705593.png',
    category: 'productivity',
  },
  {
    name: 'Zoho People',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/132e6349-536d-4c9d-9657-87f0c193e907.png',
    category: 'hr',
  },
  {
    name: 'Zoho Sprints',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/38c37d7f-6a7e-4e7c-aeb2-e3a6ea85c792.png',
    category: 'productivity',
  },
  {
    name: 'Zoho Writer',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/05a8459e-53dc-4e4b-9778-e8652085f742.png',
    category: 'productivity',
  },
  {
    name: 'Zoom',
    logo: 'https://storage.googleapis.com/app-services-prod--bucket/public/cf46a076-36f8-46b7-a976-c18025c73922.png',
    category: 'operations',
  },
];

export default softwaresList;
