export const VIEW_ELEMENT = 'VIEW_ELEMENT';
export const CREATE_APPOINTMENT = 'CREATE_APPOINTMENT';
export const VIEW_LEAD = 'VIEW_LEAD';

export const viewElement = (payload) => ({
  type: VIEW_ELEMENT,
  payload,
});

export const createAppointment = (payload) => ({
  type: 'CREATE_APPOINTMENT',
  payload,
});

export const viewLead = (payload) => ({
  type: 'VIEW_LEAD',
  payload,
});
