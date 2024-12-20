// src/redux/reducers/coreReducer.js
import { produce } from 'immer';
import { DATA_MAIN } from '../actions-v2/websiteAction';

// Define initial state
const initialState = {
  data: {
    home: {},
    features: {},
    pricing: {},
    structures: {},
    contact: {},
  },
  loading: false,
  error: null,
};

// Reducer function
const websiteReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DATA_MAIN:
        draft.loading = false;
        draft.data = action.payload;
        break;
    }
  });

export default websiteReducer;
