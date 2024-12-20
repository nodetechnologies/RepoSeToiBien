export const RESET_SIDEBAR_STATE = 'RESET_SIDEBAR_STATE';
export const CLEAR_STATE = 'CLEAR_STATE';
export const AGENDA_SIDEBAR = 'AGENDA_SIDEBAR';
export const NODE_AI = 'NODE_AI';
export const ENTITY_CHANNEL_SIDEBAR = 'ENTITY_CHANNEL_SIDEBAR';
export const HISTORY_SIDEBAR = 'HISTORY_SIDEBAR';

export const resetSidebarState = (payload) => ({
  type: RESET_SIDEBAR_STATE,
  payload,
});

export const clearState = () => ({
  type: CLEAR_STATE,
});

export const agendaSidebar = (payload) => ({
  type: AGENDA_SIDEBAR,
  payload,
});

export const nodeAiSidebar = (payload) => ({
  type: NODE_AI,
  payload,
});

export const entityChannelSidebar = (payload) => ({
  type: ENTITY_CHANNEL_SIDEBAR,
  payload,
});

export const historySidebar = (payload) => ({
  type: HISTORY_SIDEBAR,
  payload,
});
