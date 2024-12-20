import * as Actions from '../actions/sidebar-actions';
const initialState = {
  agendaSidebar: { show: false },
  historySidebar: { show: false },
  nodeAiSidebar: { show: false },
  entityChannelSidebar: { show: false },
  historySidebar: { show: false },
};

export const sidebarReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.RESET_SIDEBAR_STATE:
      return initialState;
    case Actions.CLEAR_STATE:
      return initialState;
    case Actions.AGENDA_SIDEBAR:
      return { ...initialState, agendaSidebar: payload };
    case Actions.NODE_AI:
      return { ...initialState, nodeAiSidebar: payload };
    case Actions.ENTITY_CHANNEL_SIDEBAR:
      return { ...initialState, entityChannelSidebar: payload };
    case Actions.HISTORY_SIDEBAR:
      return { ...initialState, historySidebar: payload };
    default:
      return state;
  }
};
