// Define action types

export const SET_SINGLE_ELEMENT_DETAILS = 'SET_SINGLE_ELEMENT_DETAILS';

export const setSingleElementDetails = (elementDetails) => ({
  type: SET_SINGLE_ELEMENT_DETAILS,
  payload: elementDetails,
});
