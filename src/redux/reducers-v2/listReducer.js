import {
  FETCH_DATA_BEGIN,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  FETCH_PASSES_BEGIN,
  FETCH_PASSES_SUCCESS,
  FETCH_PASSES_FAILURE,
  SET_LAST_DOC,
  SET_CURRENT_COLLECTION,
  SEARCH_DATA_SUCCESS,
  CLEAR_ALL_LISTS,
  SEARCH_RESULTS,
} from '../actions-v2/listAction';

const initialState = {
  data: {},
  passes: [],
  currentCollection: {},
  searchResults: [],
  searchData: {},
  lastDoc: null,
  loading: false,
  error: null,
};

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_ALL_LISTS:
      return {
        ...state,
        data: {},
        currentCollection: {},
        searchData: {},
        lastDoc: {
          id: '',
          path: '',
        },
      };

    case FETCH_DATA_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          [action.payload.collection]: action.payload.data,
        },
      };
    case SEARCH_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        searchData: {
          ...state.searchData,
          [action.payload.collection]: action.payload.data,
        },
      };
    case FETCH_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: [],
      };
    case FETCH_PASSES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PASSES_SUCCESS:
      return {
        ...state,
        loading: false,
        passes: action.payload.passes,
      };
    case FETCH_PASSES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        passes: [],
      };

    case SET_LAST_DOC:
      return {
        ...state,
        lastDoc: action.payload,
      };
    case SET_CURRENT_COLLECTION:
      return {
        ...state,
        currentCollection: {
          ...state.currentCollection,
          [action.payload.collection]: action.payload.data,
        },
      };
    case SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
      };
    default:
      return state;
  }
};

export default listReducer;
