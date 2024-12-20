import { VIEW_ELEMENT, CREATE_APPOINTMENT } from '../actions-v2/drawer-actions';

const initialState = {
  viewElement: { isDrawerOpen: false },
  createAppointment: { isDrawerOpen: false },
  viewLead: { isDrawerOpen: false },
};

export const drawerReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case VIEW_ELEMENT:
      return { ...state, viewElement: payload };
    case CREATE_APPOINTMENT:
      return { ...state, createAppointment: payload };
    case 'VIEW_LEAD':
      return { ...state, viewLead: payload };
    default:
      return state;
  }
};
