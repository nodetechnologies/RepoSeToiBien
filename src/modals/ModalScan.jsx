import React, { useEffect, useState } from 'react';
import StorageResult from '../components/qrResults/StorageResult';
import { useDispatch } from 'react-redux';
import ModalSmallVertical from './Base/ModalSmallVertical';
import Qr from '../components/@generalComponents/Qr';
import * as drawerActions from '../redux/actions-v2/drawer-actions';
import * as modalActions from '../redux/actions/modal-actions';

const ModalScan = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [finalData, setFinalData] = useState(null);

  const handleClose = () => {
    dispatch(drawerActions.viewElement({ isDrawerOpen: false }));
  };

  const handleOpenDrawer = () => {
    dispatch(
      drawerActions.viewElement({
        isDrawerOpen: true,
        item: {
          ...finalData,
          id: finalData.id || data.id,
          documentPath: finalData?.documentPath || 'storages/' + data.id,
        },
        handleDrawerClose: handleClose,
        type: 'edit',
      })
    );
    dispatch(
      modalActions.modalScan({
        isOpen: false,
      })
    );
  };

  const handleUpdateData = (newData) => {
    setFinalData(newData);
  };

  useEffect(() => {
    if (data && data.type === 'STORAGE') {
      handleOpenDrawer();
    } else {
      setData(null);
    }
  }, [finalData]);

  return (
    <div>
      {data && data.type === 'STORAGE' ? (
        <StorageResult data={data} handleUpdateData={handleUpdateData} />
      ) : (
        <ModalSmallVertical {...props} title="Scan QR">
          <div className="container-scan">
            <div style={{ marginLeft: '-30px' }} className="scan-qr-container">
              <Qr data={data} setData={setData} show={props.isOpen} />
            </div>
          </div>
        </ModalSmallVertical>
      )}
    </div>
  );
};

export default ModalScan;
