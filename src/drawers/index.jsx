import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as drawerActions from '../redux/actions-v2/drawer-actions';
import Quickview from '../sidebars/Quickview';
import Appointment from '../sidebars/Appointment';

const AllDrawersRoot = () => {
  const dispatch = useDispatch();

  const globalDrawerState = useSelector((state) => state.drawer);

  return (
    <React.Fragment>
      {globalDrawerState?.viewElement?.isDrawerOpen && (
        <Quickview
          {...globalDrawerState.viewElement}
          handleDrawerClose={() =>
            dispatch(
              drawerActions.viewElement({
                isDrawerOpen: false,
              })
            )
          }
        />
      )}
      {globalDrawerState?.createAppointment?.isDrawerOpen && (
        <Appointment
          {...globalDrawerState.createAppointment}
          handleDrawerClose={() =>
            dispatch(
              drawerActions.createAppointment({
                isDrawerOpen: false,
              })
            )
          }
        />
      )}
    </React.Fragment>
  );
};

export default AllDrawersRoot;
