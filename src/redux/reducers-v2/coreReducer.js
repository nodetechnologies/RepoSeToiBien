// src/redux/reducers/coreReducer.js
import { produce } from 'immer';
import {
  FETCH_BUSINESS_DATA_BEGIN,
  FETCH_BUSINESS_DATA_SUCCESS,
  FETCH_STRUCTURE_DATA_SUCCESS,
  FETCH_BUSINESS_DATA_FAILURE,
  FETCH_SUBLOCATIONS_SUCCESS,
  FETCH_SUBLOCATIONS_FAILURE,
  FETCH_USER_SUCCESS,
  SET_USER_AUTHENTICATION_STATUS,
  SET_CATEGORIES,
  SET_TOAST_MESSAGE,
  SET_CURRENT_FORM,
  GENERAL_DATA,
  ACTIVE_MENU,
  MESSAGE,
  NOTIFS_COUNT,
  REFRESH_DATA,
  SET_CURRENT_SECTION,
  SET_EMPLOYEES,
  SET_WORK_SESSIONS,
  SET_GENERAL_STATUS,
  SET_ON_CALL,
  SET_PAGE_LOADED,
  SET_ROOM,
  pageLoaded,
} from '../actions-v2/coreAction';

// Define initial state
const initialState = {
  user: {},
  categories: [],
  businessData: {
    businessId: '',
  },
  businessStructure: {
    structures: [],
    modules: [],
  },
  loading: false,
  notifs: [],
  message: false,
  status: {
    status: '',
    position: '',
    type: '',
  },
  room: null,
  generalData: {},
  activeMenu: [],
  pageLoaded: false,
  onCall: false,
  nodes: [],
  employees: [],
  currentForm: null,
  currentSection: 'OPERATIONS',
  isAuthenticated: false,
  error: null,
  refreshData: {
    status: false,
    structureId: null,
  },
  toastMessage: {
    show: false,
    type: null,
    message: null,
  },
};

// Reducer function
const coreReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case FETCH_BUSINESS_DATA_BEGIN:
        draft.loading = true;
        draft.error = null;
        break;
      case FETCH_BUSINESS_DATA_SUCCESS:
        draft.loading = false;
        draft.businessData = action.payload;
        break;
      case FETCH_STRUCTURE_DATA_SUCCESS:
        draft.loading = false;
        draft.businessStructure = action.payload;
        break;
      case FETCH_BUSINESS_DATA_FAILURE:
        draft.loading = false;
        draft.error = action.payload.error;
        draft.businessData = {};
        draft.businessStructure = {};
        break;
      case SET_PAGE_LOADED:
        draft.pageLoaded = action.payload;
        break;
      case GENERAL_DATA:
        return {
          ...state,
          generalData: action.payload,
        };
      case ACTIVE_MENU:
        return {
          ...state,
          activeMenu: action.payload,
        };
      case NOTIFS_COUNT:
        return {
          ...state,
          notifs: action.payload,
        };
      case MESSAGE:
        return {
          ...state,
          message: action.payload,
        };
      case FETCH_USER_SUCCESS:
        draft.user = action.payload;
        break;
      case FETCH_SUBLOCATIONS_SUCCESS:
        return {
          ...state,
          loading: false,
          subLocations: action.payload,
        };
      case FETCH_SUBLOCATIONS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload.error,
          subLocations: {},
        };
      case SET_GENERAL_STATUS:
        draft.status = action.payload;
        break;
      case SET_CATEGORIES:
        return {
          ...state,
          categories: action.payload,
        };
      case SET_USER_AUTHENTICATION_STATUS:
        return {
          ...state,
          isAuthenticated: action.payload,
        };
      case SET_TOAST_MESSAGE:
        return {
          ...state,
          toastMessage: action.payload,
        };

      case SET_CURRENT_FORM:
        return {
          ...state,
          currentForm: action.payload,
        };
      case REFRESH_DATA:
        return {
          ...state,
          refreshData: action.payload,
        };
      case SET_CURRENT_SECTION:
        return {
          ...state,
          currentSection: action.payload,
        };
      case SET_EMPLOYEES:
        return {
          ...state,
          employees: action.payload,
        };
      case SET_WORK_SESSIONS:
        return {
          ...state,
          nodes: action.payload,
        };

      case SET_ON_CALL:
        return {
          ...state,
          onCall: action.payload,
        };
      case SET_ROOM:
        return {
          ...state,
          room: action.payload,
        };
        break;
    }
  });

export default coreReducer;
