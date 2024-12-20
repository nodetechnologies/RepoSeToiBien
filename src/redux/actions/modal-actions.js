export const MODAL_CREATE_CARD = 'MODAL_CREATE_CARD';
export const MODAL_CREATE_QUOTE = 'MODAL_CREATE_QUOTE';
export const MODAL_CREATE_INTERVAL = 'MODAL_CREATE_INTERVAL';
export const MODAL_EDIT_PAYMENT = 'MODAL_EDIT_PAYMENT';
export const MODAL_APPOINTMENT_CONFIRMATION = 'MODAL_APPOINTMENT_CONFIRMATION';
export const MODAL_GENERIC_ARTICLES = 'MODAL_GENERIC_ARTICLES';
export const MODAL_CONFIRM_REFUND = 'MODAL_CONFIRM_REFUND';
export const MODAL_EMPLOYEE_ON_CARD = 'MODAL_EMPLOYEE_ON_CARD';
export const MODAL_CONFIRMATION = 'MODAL_CONFIRMATION';
export const MODAL_CREATE_PROFILE = 'MODAL_CREATE_PROFILE';
export const MODAL_OPTIONS = 'MODAL_OPTIONS';
export const MODAL_REGISTRATION_GRID = 'MODAL_REGISTRATION_GRID';
export const MODAL_EDIT_PROFILE = 'MODAL_EDIT_PROFILE';
export const MODAL_SWITCH_PROFILE_ON_ITEM = 'MODAL_SWITCH_PROFILE_ON_ITEM';
export const MODAL_HANDLE_OPTIONS = 'MODAL_HANDLE_OPTIONS';
export const MODAL_PROFILE_RECORDS = 'MODAL_PROFILE_RECORDS';
export const MODAL_ADD_DISCOUNT = 'MODAL_ADD_DISCOUNT';
export const MODAL_SELECT_ACTIVE_LOCATION = 'MODAL_SELECT_ACTIVE_LOCATION';
export const MODAL_ADD_ITEM = 'MODAL_ADD_ITEM';
export const MODAL_MAINTENANCE_CHECK = 'MODAL_MAINTENANCE_CHECK';
export const MODAL_PAYMENT = 'MODAL_PAYMENT';
export const MODAL_EDIT_CARD = 'MODAL_EDIT_CARD';
export const MODAL_EDIT_ITEM = 'MODAL_EDIT_ITEM';
export const MODAL_ADD_ARTICLE = 'MODAL_ADD_ARTICLE';
export const MODAL_ELEMENT_CREATION = 'MODAL_ELEMENT_CREATION';
export const MODAL_ADD_CARD = 'MODAL_ADD_CARD';
export const MODAL_ADD_CLIENT = 'MODAL_ADD_CLIENT';
export const MODAL_ADD_REQUEST = 'MODAL_ADD_REQUEST';
export const MODAL_ADD_EXPENSE = 'MODAL_ADD_EXPENSE';
export const MODAL_SCAN = 'MODAL_SCAN';
export const MODAL_DEPOSIT = 'MODAL_DEPOSIT';
export const MODAL_CREATE_CARD_PASS = 'MODAL_CREATE_CARD_PASS';
export const MODAL_INVOICE = 'MODAL_INVOICE';
export const MODAL_CREATE_VARIANT = 'MODAL_CREATE_VARIANT';
export const MODAL_INTERVALS = 'MODAL_INTERVALS';
export const MODAL_ADD_SERVICE_ON_CARD = 'MODAL_ADD_SERVICE_ON_CARD';
export const MODAL_CHECK_IN = 'MODAL_CHECK_IN';
export const MODAL_SELECT_OPTION = 'MODAL_SELECT_OPTION';
export const MODAL_STORAGE = 'MODAL_STORAGE';
export const MODAL_AI = 'MODAL_AI';
export const MODAL_ADD_STORAGE = 'MODAL_ADD_STORAGE';
export const MODAL_SERVICE_AUTOMATION = 'MODAL_SERVICE_AUTOMATION';
export const MODAL_QR_CODE = 'MODAL_QR_CODE';
export const MODAL_MANAGE_EMPLOYEE = 'MODAL_MANAGE_EMPLOYEE';
export const MODAL_HOOK_ORDER_WITH_SERVICE_ITEM =
  'MODAL_HOOK_ORDER_WITH_SERVICE_ITEM';
export const MODAL_GEMINI = 'MODAL_GEMINI';
export const MODAL_VEHICLE_DETAILS = 'MODAL_VEHICLE_DETAILS';
export const MODAL_PROFILE_FORM_SUBMISSION = 'MODAL_PROFILE_FORM_SUBMISSION';
export const MODAL_ITEM_INTERNAL_NOTES = 'MODAL_ITEM_INTERNAL_NOTES';
export const MODAL_CONFIRM_ORDER = 'MODAL_CONFIRM_ORDER';
export const MODAL_TERMINAL_PAYMENT = 'MODAL_TERMINAL_PAYMENT';
export const MODAL_EDIT_REQUEST = 'MODAL_EDIT_REQUEST';
export const MODAL_BUSINESS_LOCATIONS = 'MODAL_BUSINESS_LOCATIONS';
export const MODAL_AVAILAB = 'MODAL_AVAILAB';
export const MODAL_AVAILAB_SELECTOR = 'MODAL_AVAILAB_SELECTOR';
export const MODAL_ADD_ACCOUNT = 'MODAL_ADD_ACCOUNT';
export const MODAL_TRANSFER_ACCOUNT = 'MODAL_TRANSFER_ACCOUNT';
export const MODAL_QUICK_CARD = 'MODAL_QUICK_CARD';
export const MODAL_PUBLIC_PAYMENT = 'MODAL_PUBLIC_PAYMENT';
export const MODAL_CONNECTORS = 'MODAL_CONNECTORS';
export const MODAL_RENTAL = 'MODAL_RENTAL';
export const MODAL_CONNS = 'MODAL_CONNS';
export const MODAL_PAYMENT_EXPENSE = 'MODAL_PAYMENT_EXPENSE';
export const MODAL_GROUP_DETAILS = 'MODAL_GROUP_DETAILS';
export const MODAL_CHECK_IN_OUT = 'MODAL_CHECK_IN_OUT';
export const MODAL_AVAILAB_LOCATION = 'MODAL_AVAILAB_LOCATION';
export const MODAL_SIGN_IN = 'MODAL_SIGN_IN';
export const MODAL_REFUND_CARD = 'MODAL_REFUND_CARD';
export const MODAL_FORM_HOOK = 'MODAL_FORM_HOOK';
export const MODAL_PASSES = 'MODAL_PASSES';
export const MODAL_SERViCES_INVENTORY = 'MODAL_SERViCES_INVENTORY';
export const MODAL_SCRIPT = 'MODAL_SCRIPT';
export const MODAL_STATEMENT = 'MODAL_STATEMENT';
export const MODAL_LOG_PRINT = 'MODAL_LOG_PRINT';
export const MODAL_EMPLOYEE = 'MODAL_EMPLOYEE';
export const MODAL_EMPLOYEE_CARD = 'MODAL_EMPLOYEE_CARD';
export const MODAL_SELECT = 'MODAL_SELECT';
export const MODAL_PARAMS = 'MODAL_PARAMS';
export const MODAL_STATS = 'MODAL_STATS';
export const MODAL_EMAIL = 'MODAL_EMAIL';
export const MODAL_ADD_ROOM = 'MODAL_ADD_ROOM';
export const MODAL_EMAIL_CARD = 'MODAL_EMAIL_CARD';
export const MODAL_CONTACT = 'MODAL_CONTACT';
export const MODAL_EDIT_BLOCK = 'MODAL_EDIT_BLOCK';

export const modalCreateCard = (payload) => ({
  type: MODAL_CREATE_CARD,
  payload,
});

export const modalEditBlock = (payload) => ({
  type: MODAL_EDIT_BLOCK,
  payload,
});

export const modalEditPayment = (payload) => ({
  type: MODAL_EDIT_PAYMENT,
  payload,
});

export const modalSelect = (payload) => ({
  type: MODAL_SELECT,
  payload,
});

export const modalParams = (payload) => ({
  type: MODAL_PARAMS,
  payload,
});

export const modalCreateQuote = (payload) => ({
  type: MODAL_CREATE_QUOTE,
  payload,
});

export const modalCreateInterval = (payload) => ({
  type: MODAL_CREATE_INTERVAL,
  payload,
});

export const modalAppointmentConfirmation = (payload) => ({
  type: MODAL_APPOINTMENT_CONFIRMATION,
  payload,
});

export const modalGenericArticles = (payload) => ({
  type: MODAL_GENERIC_ARTICLES,
  payload,
});

export const modalGemini = (payload) => ({
  type: MODAL_GEMINI,
  payload,
});

export const modalEmployeeOnCard = (payload) => ({
  type: MODAL_EMPLOYEE_ON_CARD,
  payload,
});

export const modalConfirmation = (payload) => ({
  type: MODAL_CONFIRMATION,
  payload,
});

export const modalStats = (payload) => ({
  type: MODAL_STATS,
  payload,
});

export const modalCreateProfile = (payload) => ({
  type: MODAL_CREATE_PROFILE,
  payload,
});

export const modalOptions = (payload) => ({
  type: MODAL_OPTIONS,
  payload,
});

export const modalRegistrationGrid = (payload) => ({
  type: MODAL_REGISTRATION_GRID,
  payload,
});

export const modalSwitchProfileOnItem = (payload) => ({
  type: MODAL_SWITCH_PROFILE_ON_ITEM,
  payload,
});

export const modalHandleOptions = (payload) => ({
  type: MODAL_HANDLE_OPTIONS,
  payload,
});

export const modalProfileRecords = (payload) => ({
  type: MODAL_PROFILE_RECORDS,
  payload,
});

export const modalAddDiscount = (payload) => ({
  type: MODAL_ADD_DISCOUNT,
  payload,
});

export const modalSelectActiveLocation = (payload) => ({
  type: MODAL_SELECT_ACTIVE_LOCATION,
  payload,
});

export const modalAddItem = (payload) => ({
  type: MODAL_ADD_ITEM,
  payload,
});

export const modalMaintenanceCheck = (payload) => ({
  type: MODAL_MAINTENANCE_CHECK,
  payload,
});

export const modalPayment = (payload) => ({
  type: MODAL_PAYMENT,
  payload,
});

export const modalEditCard = (payload) => ({
  type: MODAL_EDIT_CARD,
  payload,
});

export const modalEditItem = (payload) => ({
  type: MODAL_EDIT_ITEM,
  payload,
});

export const modalAddArticle = (payload) => ({
  type: MODAL_ADD_ARTICLE,
  payload,
});

export const modalElementCreation = (payload) => ({
  type: MODAL_ELEMENT_CREATION,
  payload,
});

export const modalAddCard = (payload) => ({
  type: MODAL_ADD_CARD,
  payload,
});

export const modalAddClient = (payload) => ({
  type: MODAL_ADD_CLIENT,
  payload,
});

export const modalAddExpense = (payload) => ({
  type: MODAL_ADD_EXPENSE,
  payload,
});

export const modalAddRequest = (payload) => ({
  type: MODAL_ADD_REQUEST,
  payload,
});

export const modalScan = (payload) => ({
  type: MODAL_SCAN,
  payload,
});

export const modalDeposit = (payload) => ({
  type: MODAL_DEPOSIT,
  payload,
});

export const modalCreateCardPass = (payload) => ({
  type: MODAL_CREATE_CARD_PASS,
  payload,
});

export const modalInvoice = (payload) => ({
  type: MODAL_INVOICE,
  payload,
});

export const modalContact = (payload) => ({
  type: MODAL_CONTACT,
  payload,
});

export const modalCreateVariant = (payload) => ({
  type: MODAL_CREATE_VARIANT,
  payload,
});

export const modalIntervals = (payload) => ({
  type: MODAL_INTERVALS,
  payload,
});

export const modalEmail = (payload) => ({
  type: MODAL_EMAIL,
  payload,
});

export const modalAddServiceOnCard = (payload) => ({
  type: MODAL_ADD_SERVICE_ON_CARD,
  payload,
});

export const modalCheckIn = (payload) => ({
  type: MODAL_CHECK_IN,
  payload,
});

export const modalSelectOption = (payload) => ({
  type: MODAL_SELECT_OPTION,
  payload,
});

export const modalStorage = (payload) => ({
  type: MODAL_STORAGE,
  payload,
});

export const modalAddStorage = (payload) => ({
  type: MODAL_ADD_STORAGE,
  payload,
});

export const modalQRCode = (payload) => ({
  type: MODAL_QR_CODE,
  payload,
});

export const modalManageEmployee = (payload) => ({
  type: MODAL_MANAGE_EMPLOYEE,
  payload,
});

export const modalHookOrderWithServiceItem = (payload) => ({
  type: MODAL_HOOK_ORDER_WITH_SERVICE_ITEM,
  payload,
});

export const modalVehicleDetails = (payload) => ({
  type: MODAL_VEHICLE_DETAILS,
  payload,
});

export const modalProfileFormSubmission = (payload) => ({
  type: MODAL_PROFILE_FORM_SUBMISSION,
  payload,
});
export const modalItemInternalNotes = (payload) => ({
  type: MODAL_ITEM_INTERNAL_NOTES,
  payload,
});
export const modalConfirmOrder = (payload) => ({
  type: MODAL_CONFIRM_ORDER,
  payload,
});
export const modalEditRequest = (payload) => ({
  type: MODAL_EDIT_REQUEST,
  payload,
});

export const modalBusinessLocations = (payload) => ({
  type: MODAL_BUSINESS_LOCATIONS,
  payload,
});

export const modalAvailab = (payload) => ({
  type: MODAL_AVAILAB,
  payload,
});

export const modalAvailabSelector = (payload) => ({
  type: MODAL_AVAILAB_SELECTOR,
  payload,
});

export const modalAddAccount = (payload) => ({
  type: MODAL_ADD_ACCOUNT,
  payload,
});

export const modalTransferAccount = (payload) => ({
  type: MODAL_TRANSFER_ACCOUNT,
  payload,
});

export const modalQuickCard = (payload) => ({
  type: MODAL_QUICK_CARD,
  payload,
});

export const modalPublicPayment = (payload) => ({
  type: MODAL_PUBLIC_PAYMENT,
  payload,
});

export const modalConnectors = (payload) => ({
  type: MODAL_CONNECTORS,
  payload,
});

export const modalRental = (payload) => ({
  type: MODAL_RENTAL,
  payload,
});

export const modalConns = (payload) => ({
  type: MODAL_CONNS,
  payload,
});

export const modalPaymentExpense = (payload) => ({
  type: MODAL_PAYMENT_EXPENSE,
  payload,
});

export const modalGroupDetails = (payload) => ({
  type: MODAL_GROUP_DETAILS,
  payload,
});

export const modalCheckInOut = (payload) => ({
  type: MODAL_CHECK_IN_OUT,
  payload,
});

export const modalAvailabLocation = (payload) => ({
  type: MODAL_AVAILAB_LOCATION,
  payload,
});

export const modalSignIn = (payload) => ({
  type: MODAL_SIGN_IN,
  payload,
});

export const modalAddCardRefund = (payload) => ({
  type: MODAL_REFUND_CARD,
  payload,
});

export const modalServicesInventory = (payload) => ({
  type: MODAL_SERViCES_INVENTORY,
  payload,
});

export const modalPasses = (payload) => ({
  type: MODAL_PASSES,
  payload,
});

export const modalFormHook = (payload) => ({
  type: MODAL_FORM_HOOK,
  payload,
});

export const modalScript = (payload) => ({
  type: MODAL_SCRIPT,
  payload,
});

export const modalStatement = (payload) => ({
  type: MODAL_STATEMENT,
  payload,
});

export const modalLogPrint = (payload) => ({
  type: MODAL_LOG_PRINT,
  payload,
});

export const modalEmployee = (payload) => ({
  type: MODAL_EMPLOYEE,
  payload,
});

export const modalEmployeeCard = (payload) => ({
  type: MODAL_EMPLOYEE_CARD,
  payload,
});

export const modalAddRoom = (payload) => ({
  type: MODAL_ADD_ROOM,
  payload,
});

export const modalEmailCard = (payload) => ({
  type: MODAL_EMAIL_CARD,
  payload,
});
