export const financesTransactionsColumns = [
  {
    field: 'date',
    headerName: 'Date',
    width: 170,
    editable: false,
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 160,
    editable: false,
  },
  {
    field: 'typeLetter',
    headerName: 'Desc',
    width: 200,
    editable: false,
  },
  {
    field: 'amount',
    headerName: 'Montant',
    width: 100,
    editable: false,
  },
  {
    field: 'balance',
    headerName: 'Balance',
    width: 100,
    editable: false,
  },
  {
    field: 'cardNumber',
    headerName: 'Numéro de carte',
    width: 180,
    editable: false,
  },
  {
    field: 'createdBy',
    headerName: 'Création',
    width: 200,
    editable: false,
  },
  {
    field: 'cardId',
    headerName: 'Carte',
    width: 240,
    disableReorder: true,
  },
];

export const financesTaxesColumns = [
  { field: 'date', headerName: 'Date de facturation', width: 160 },
  { field: 'name', headerName: 'Item', width: 280 },
  { field: 'sku', headerName: 'SKU', width: 120 },
  { field: 'unity', headerName: 'Unité', width: 120 },
  { field: 'quantity', headerName: 'Qt.', width: 75 },
  { field: 'price', headerName: 'Montant', width: 120 },
  { field: 'tax1', headerName: 'Taxe 1', width: 100 },
  { field: 'tax2', headerName: 'Taxe 2', width: 100 },
  { field: 'card', headerName: 'Carte', width: 200 },
  { field: 'profile', headerName: 'Profil', width: 190 },
  { field: 'category', headerName: 'Catégorie', width: 190 },
];

export const depositColumns = [
  { field: 'name', headerName: 'Nom', width: 280 },
  { field: 'balance', headerName: 'Balance', width: 120 },
  { field: 'status', headerName: 'Statut', width: 140 },
  { field: 'transactionsNumber', headerName: 'Transactions', width: 110 },
  { field: 'id', headerName: 'Identifiant du dépôt', width: 240 },
];

export const cardsColumns = [
  { field: 'name', headerName: 'Projet', width: 320 },
  { field: 'assignedTo', headerName: 'Distributeur', width: 280 },
  { field: 'clientName', headerName: 'Client', width: 210 },
  { field: 'date', headerName: 'Date', width: 140 },
  { field: 'status', headerName: 'Statut', width: 190 },
  { field: 'value', headerName: 'Valeur est.', width: 130 },
  { field: 'region', headerName: 'Région', width: 180 },
];

export const cardsColumnsEn = [
  { field: 'name', headerName: 'Project', width: 320 },
  { field: 'assignedTo', headerName: 'Distributor', width: 280 },
  { field: 'clientName', headerName: 'Client', width: 210 },
  { field: 'date', headerName: 'Date', width: 140 },
  { field: 'status', headerName: 'Status', width: 190 },
  { field: 'value', headerName: 'Value est.', width: 130 },
  { field: 'region', headerName: 'Region', width: 180 },
];

export const requestsColumns = [
  { field: 'name', headerName: 'Nom', width: 240 },
  { field: 'assignedTo', headerName: 'Assignée à', width: 200 },
  { field: 'dueDate', headerName: 'Échéance', width: 180 },
  { field: 'type', headerName: 'Type', width: 140 },
  { field: 'cardHooked', headerName: 'Carte liée', width: 230 },
  { field: 'fromUser', headerName: 'Prevenance', width: 200 },
  { field: 'id', headerName: 'ID', width: 250, disableReorder: true },
];

export const servicesColumns = [
  { field: 'name', headerName: 'Nom', width: 300 },
  { field: 'price', headerName: 'Prix', flex: 1, editable: true },
  { field: 'duration', headerName: 'Durée', flex: 1, editable: true },
  { field: 'availableToBook', headerName: 'Disponi.', flex: 1 },
  { field: 'category', headerName: 'Catégorie', flex: 1 },
  // { field: 'updatedAt', headerName: 'Mise à jour', width: 170 },
];

export const subpassesColumns = [
  { field: 'card', headerName: 'Carte liée', width: 280 },
  { field: 'status', headerName: 'Statut', width: 120 },
  { field: 'profile', headerName: 'Profil', width: 250 },
  { field: 'age', headerName: 'Age', width: 120 },
  { field: 'name', headerName: 'Nom', width: 260 },
  { field: 'startDate', headerName: 'Début', width: 180 },
  { field: 'endDate', headerName: 'Fin', width: 180 },
  { field: 'confirmed', headerName: 'Confirmation', width: 180 },
  { field: 'locationId', headerName: 'Ressource', width: 240 },
  { field: 'group', headerName: 'Groupe', width: 140 },
  { field: 'interval', headerName: 'Ajustement', width: 200 },
];

export const storageColumns = [
  { field: 'id', headerName: 'ID', width: 250 },
  { field: 'client', headerName: 'Client', width: 240 },
  { field: 'name', headerName: 'Profil lié', width: 260 },
  { field: 'sublocation', headerName: 'Ressource', width: 180 },
  { field: 'frontLeft', headerName: 'Av. gauche', width: 180 },
  { field: 'frontRight', headerName: 'Av. droit', width: 180 },
  { field: 'rearLeft', headerName: 'Ar. gauche', width: 180 },
  { field: 'rearRight', headerName: 'Ar. droit', width: 180 },
  { field: 'make', headerName: 'Marque', width: 240 },
  { field: 'model', headerName: 'Model', width: 240 },
  { field: 'note', headerName: 'Notes', width: 240 },
];

export const submissionColumns = [
  { field: 'profileName', headerName: 'Nom du profil', width: 240 },
  { field: 'cardId', headerName: 'Liée à la carte', width: 240 },
];

export const subpassesServiceColumns = [
  { field: 'group', headerName: ' Groupe', width: 130 },
  { field: 'option', headerName: 'Option', width: 190 },
  { field: 'name', headerName: 'Nom', width: 190 },
  { field: 'profile', headerName: 'Profil', width: 260 },
  { field: 'age', headerName: 'Age', width: 140 },
  { field: 'uniqueAttribute', headerName: 'Courriel', width: 260 },
  { field: 'phone', headerName: 'Téléphone', width: 200 },
  { field: 'status', headerName: 'Statut', width: 140 },
  { field: 'checkIn', headerName: 'Enreg.', width: 140 },
  { field: 'startDate', headerName: 'Début', width: 180 },
  { field: 'endDate', headerName: 'Fin', width: 180 },
  { field: 'location', headerName: 'Lieu', width: 180 },
  { field: 'interval', headerName: 'Ajust.', width: 140 },
  { field: 'card', headerName: 'Carte liée', width: 260 },
];

export const employeesColumns = [
  { field: 'id', headerName: 'ID', width: 120 },
  { field: 'name', headerName: 'Nom', width: 260 },
  { field: 'email', headerName: 'Courriel', width: 220 },
  { field: 'phone', headerName: 'Téléphone', width: 220 },
  { field: 'permission', headerName: 'Permission', width: 220 },
];

export const availColumns = [
  { field: 'profileName', headerName: 'Liaison', width: 260 },
  { field: 'clientName', headerName: 'Utilisateur', width: 240 },
  { field: 'employeeName', headerName: 'Employé', width: 240 },
  { field: 'startDate', headerName: 'Début', width: 160 },
  { field: 'endDate', headerName: 'Fin', width: 160 },
  { field: 'locationName', headerName: 'Lieu', width: 160 },
  { field: 'subLocationName', headerName: 'Ressource', width: 160 },
  { field: 'address', headerName: 'Adresse', width: 260 },
];
