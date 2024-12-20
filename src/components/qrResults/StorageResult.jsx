import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const StorageResult = ({ data, handleUpdateData }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        try {
          const id = data?.storageItemId || data?.id;
          const docRef = doc(db, 'storages', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const item = docSnap.data();
            const itemId = item?.id || data?.id;
            const documentPath = item?.documentPath || 'storages/' + id;

            setCurrentItem({
              type: 'STORAGE',
              documentPath: documentPath,
              profileName: item?.profileName || '',
              size: item?.size || item.metadata?.size || '',
              make: item?.make || item.metadata?.make || '',
              model: item?.model || item.metadata?.model || '',
              note: item?.note || item.metadata?.note || '',
              subLocation: item?.subLocation || item.subLocation || '',
              id: itemId || data?.storageItemId,
            });
            setDrawerOpen(true);
          } else {
            console.info('No such document!');
          }
        } catch (error) {
          console.error('Error fetching document: ', error);
        }
      }
    };

    fetchData();
  }, [data]);

  useEffect(() => {
    if (currentItem) {
      handleUpdateData(currentItem);
    }
  }, [currentItem]);

  return <div> </div>;
};

export default StorageResult;
