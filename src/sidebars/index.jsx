import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as sidebarActions from '../redux/actions/sidebar-actions';
import AgendaSidebar from './AgendaSidebar';
import NodeAI from './NodeAI';
import EntityChannelSidebar from './EntityChannelSidebar';
import History from './History';

const AllSidebarsRoot = () => {
  const dispatch = useDispatch();

  const globalSidebarState = useSelector((state) => state.sidebarReducer);

  return (
    <React.Fragment>
      {globalSidebarState.agendaSidebar.show && (
        <AgendaSidebar
          {...globalSidebarState.agendaSidebar}
          closeSidebar={() =>
            dispatch(
              sidebarActions.agendaSidebar({
                show: false,
              })
            )
          }
        />
      )}
      {globalSidebarState.nodeAiSidebar.show && (
        <NodeAI
          {...globalSidebarState.nodeAiSidebar}
          closeSidebar={() =>
            dispatch(
              sidebarActions.nodeAiSidebar({
                show: false,
              })
            )
          }
        />
      )}{' '}
      {globalSidebarState.historySidebar.show && (
        <History
          {...globalSidebarState.historySidebar}
          closeSidebar={() =>
            dispatch(
              sidebarActions.historySidebar({
                show: false,
              })
            )
          }
        />
      )}{' '}
      {globalSidebarState.entityChannelSidebar.show && (
        <EntityChannelSidebar
          {...globalSidebarState.entityChannelSidebar}
          closeSidebar={() =>
            dispatch(
              sidebarActions.entityChannelSidebar({
                show: false,
              })
            )
          }
        />
      )}
    </React.Fragment>
  );
};

export default AllSidebarsRoot;
