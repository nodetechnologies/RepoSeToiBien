import { SET_SINGLE_ELEMENT_DETAILS } from '../actions-v2/elementAction';

const initialState = {
  singleElementDetails: null,
};

const elementReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_ELEMENT_DETAILS:
      return {
        ...state,
        singleElementDetails: action.payload,
      };
    default:
      return state;
  }
};

export default elementReducer;
