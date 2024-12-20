import * as Actions from '../actions/modal-actions';
const initialState = {
  modalEmployeeOnCard: { isOpen: false },
  modalConfirmation: { isOpen: false },
  modalAddItem: { isOpen: false },
  modalPayment: { isOpen: false },
  modalElementCreation: { isOpen: false },
  modalScan: { isOpen: false },
  modalInvoice: { isOpen: false },
  modalContact: { isOpen: false },
  modalEmail: { isOpen: false },
  modalCheckIn: { isOpen: false },
  modalQRCode: { isOpen: false },
  modalManageEmployee: { isOpen: false },
  modalAddCardRefund: { isOpen: false },
  modalFormHook: { isOpen: false },
  modalEmployeeCard: { isOpen: false },
  modalServicesInventory: { isOpen: false },
  modalEmployee: { isOpen: false },
  modalSelect: { isOpen: false },
  modalEmailCard: { isOpen: false },
  modalGemini: { isOpen: false },
  modalEditBlock: { isOpen: false },
};

export const modalReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.MODAL_CREATE_QUOTE:
      return { ...initialState, modalCreateQuote: payload };
    case Actions.MODAL_EDIT_BLOCK:
      return { ...initialState, modalEditBlock: payload };
    case Actions.MODAL_CREATE_INTERVAL:
      return { ...initialState, modalCreateInterval: payload };
    case Actions.MODAL_EDIT_PAYMENT:
      return { ...initialState, modalEditPayment: payload };
    case Actions.MODAL_APPOINTMENT_CONFIRMATION:
      return { ...initialState, modalAppointmentConfirmation: payload };
    case Actions.MODAL_GENERIC_ARTICLES:
      return { ...initialState, modalGenericArticles: payload };
    case Actions.MODAL_EMPLOYEE_ON_CARD:
      return { ...initialState, modalEmployeeOnCard: payload };
    case Actions.MODAL_CONFIRMATION:
      return { ...initialState, modalConfirmation: payload };
    case Actions.MODAL_CREATE_PROFILE:
      return { ...initialState, modalCreateProfile: payload };
    case Actions.MODAL_OPTIONS:
      return { ...initialState, modalOptions: payload };
    case Actions.MODAL_CONTACT:
      return { ...initialState, modalContact: payload };
    case Actions.MODAL_PARAMS:
      return { ...initialState, modalParams: payload };
    case Actions.MODAL_STATS:
      return { ...initialState, modalStats: payload };
    case Actions.MODAL_REGISTRATION_GRID:
      return { ...initialState, modalRegistrationGrid: payload };
    case Actions.MODAL_SWITCH_PROFILE_ON_ITEM:
      return { ...initialState, modalSwitchProfileOnItem: payload };
    case Actions.MODAL_HANDLE_OPTIONS:
      return { ...initialState, modalHandleOptions: payload };
    case Actions.MODAL_PROFILE_RECORDS:
      return { ...initialState, modalProfileRecords: payload };
    case Actions.MODAL_ADD_DISCOUNT:
      return { ...initialState, modalAddDiscount: payload };
    case Actions.MODAL_ADD_ITEM:
      return { ...initialState, modalAddItem: payload };
    case Actions.MODAL_MAINTENANCE_CHECK:
      return { ...initialState, modalMaintenanceCheck: payload };
    case Actions.MODAL_PAYMENT:
      return { ...initialState, modalPayment: payload };
    case Actions.MODAL_EDIT_CARD:
      return { ...initialState, modalEditCard: payload };
    case Actions.MODAL_EDIT_ITEM:
      return { ...initialState, modalEditItem: payload };
    case Actions.MODAL_ADD_CLIENT:
      return { ...initialState, modalAddClient: payload };
    case Actions.MODAL_ELEMENT_CREATION:
      return { ...initialState, modalElementCreation: payload };
    case Actions.MODAL_GEMINI:
      return { ...initialState, modalGemini: payload };
    case Actions.MODAL_ADD_ARTICLE:
      return { ...initialState, modalAddArticle: payload };
    case Actions.MODAL_ADD_CARD:
      return { ...initialState, modalAddCard: payload };
    case Actions.MODAL_ADD_REQUEST:
      return { ...initialState, modalAddRequest: payload };
    case Actions.MODAL_ADD_EXPENSE:
      return { ...initialState, modalAddExpense: payload };
    case Actions.MODAL_SCAN:
      return { ...initialState, modalScan: payload };
    case Actions.MODAL_DEPOSIT:
      return { ...initialState, modalDeposit: payload };
    case Actions.MODAL_CREATE_CARD_PASS:
      return { ...initialState, modalCreateCardPass: payload };
    case Actions.MODAL_INVOICE:
      return { ...initialState, modalInvoice: payload };
    case Actions.MODAL_CREATE_VARIANT:
      return { ...initialState, modalCreateVariant: payload };
    case Actions.MODAL_INTERVALS:
      return { ...initialState, modalIntervals: payload };
    case Actions.MODAL_EMAIL:
      return { ...initialState, modalEmail: payload };
    case Actions.MODAL_ADD_SERVICE_ON_CARD:
      return { ...initialState, modalAddServiceOnCard: payload };
    case Actions.MODAL_CHECK_IN:
      return { ...initialState, modalCheckIn: payload };
    case Actions.MODAL_SELECT_OPTION:
      return { ...initialState, modalSelectOption: payload };
    case Actions.MODAL_STORAGE:
      return { ...initialState, modalStorage: payload };
    case Actions.MODAL_STATEMENT:
      return { ...initialState, modalStatement: payload };
    case Actions.MODAL_ADD_STORAGE:
      return { ...initialState, modalAddStorage: payload };
    case Actions.MODAL_QR_CODE:
      return { ...initialState, modalQRCode: payload };
    case Actions.MODAL_MANAGE_EMPLOYEE:
      return { ...initialState, modalManageEmployee: payload };
    case Actions.MODAL_HOOK_ORDER_WITH_SERVICE_ITEM:
      return { ...initialState, modalHookOrderWithServiceItem: payload };
    case Actions.MODAL_VEHICLE_DETAILS:
      return { ...initialState, modalVehicleDetails: payload };
    case Actions.MODAL_PROFILE_FORM_SUBMISSION:
      return { ...initialState, modalProfileFormSubmission: payload };
    case Actions.MODAL_ITEM_INTERNAL_NOTES:
      return { ...initialState, modalItemInternalNotes: payload };
    case Actions.MODAL_CONFIRM_ORDER:
      return { ...initialState, modalConfirmOrder: payload };
    case Actions.MODAL_EDIT_REQUEST:
      return { ...initialState, modalEditRequest: payload };
    case Actions.MODAL_BUSINESS_LOCATIONS:
      return { ...initialState, modalBusinessLocations: payload };
    case Actions.MODAL_AVAILAB:
      return { ...initialState, modalAvailab: payload };
    case Actions.MODAL_AVAILAB_SELECTOR:
      return { ...initialState, modalAvailabSelector: payload };
    case Actions.MODAL_ADD_ACCOUNT:
      return { ...initialState, modalAddAccount: payload };
    case Actions.MODAL_TRANSFER_ACCOUNT:
      return { ...initialState, modalTransferAccount: payload };
    case Actions.MODAL_QUICK_CARD:
      return { ...initialState, modalQuickCard: payload };
    case Actions.MODAL_PUBLIC_PAYMENT:
      return { ...initialState, modalPublicPayment: payload };
    case Actions.MODAL_CONNECTORS:
      return { ...initialState, modalConnectors: payload };
    case Actions.MODAL_RENTAL:
      return { ...initialState, modalRental: payload };
    case Actions.MODAL_CONNS:
      return { ...initialState, modalConns: payload };
    case Actions.MODAL_PAYMENT_EXPENSE:
      return { ...initialState, modalPaymentExpense: payload };
    case Actions.MODAL_GROUP_DETAILS:
      return { ...initialState, modalGroupDetails: payload };
    case Actions.MODAL_CHECK_IN_OUT:
      return { ...initialState, modalCheckInOut: payload };
    case Actions.MODAL_AVAILAB_LOCATION:
      return { ...initialState, modalAvailabLocation: payload };
    case Actions.MODAL_SIGN_IN:
      return { ...initialState, modalSignIn: payload };
    case Actions.MODAL_REFUND_CARD:
      return { ...initialState, modalAddCardRefund: payload };
    case Actions.MODAL_FORM_HOOK:
      return { ...initialState, modalFormHook: payload };
    case Actions.MODAL_PASSES:
      return { ...initialState, modalPasses: payload };
    case Actions.MODAL_SERViCES_INVENTORY:
      return { ...initialState, modalServicesInventory: payload };
    case Actions.MODAL_SCRIPT:
      return { ...initialState, modalScript: payload };
    case Actions.MODAL_LOG_PRINT:
      return { ...initialState, modalLogPrint: payload };
    case Actions.MODAL_EMPLOYEE:
      return { ...initialState, modalEmployee: payload };
    case Actions.MODAL_EMPLOYEE_CARD:
      return { ...initialState, modalEmployeeCard: payload };
    case Actions.MODAL_EMAIL_CARD:
      return { ...initialState, modalEmailCard: payload };
    default:
      return state;
  }
};
