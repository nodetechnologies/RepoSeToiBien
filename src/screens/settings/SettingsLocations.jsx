import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ListItem, ListItemText } from '@material-ui/core';
import moment from 'moment';
import { toast } from 'react-toastify';
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import TextField from '../../stories/general-components/TextField';
import Checkbox from '../../stories/general-components/Checkbox';

const SettingsLocations = () => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const dispatch = useDispatch();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const businessPreference = useSelector((state) => state.core.businessData);

  useEffect(() => {
    setLocations(businessPreference?.locations || []);
  }, [businessPreference]);

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };
  const handleAdd = () => {
    setSelectedLocation({
      name: '',
      address: '',
      order: locations?.length,
    });
  };

  const handleSave = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `business/general`,
        showLoading: true,
        body: {
          type: 'location',
          lang: currentLangCode,

          locationData: selectedLocation,
        },
      });

      const allLocations = locations?.map((item) => {
        if (item?.id === selectedLocation?.id) {
          return selectedLocation;
        } else if (!item?.id) {
          //add new location in array
          return selectedLocation;
        }
        return item;
      });

      setLocations(allLocations?.sort((a, b) => a?.order - b?.order) || []);
      toast.success(t('saved'));
    } catch (error) {
      console.error('Error saving fields:', error);
    }
  };

  return (
    <MainLayoutV2
      pageTitle={t('resources')}
      actions={{
        add: handleAdd,
        save: selectedLocation && handleSave,
      }}
    >
      <Block height={1} heightPercentage={100} noBorder>
        <div className="row">
          <div className={selectedLocation ? 'col-4' : 'col-12'}>
            {locations?.map((item, index) => (
              <div key={index} className="hover">
                <ListItem
                  dense
                  divider
                  onClick={() => handleSelectLocation(item)}
                >
                  <ListItemText
                    primary={item?.name}
                    secondary={item?.address || t('noAddress')}
                  />
                  <ListItemText
                    primary={moment
                      .unix(
                        item?.lastUpdate?.seconds ||
                          item?.lastUpdate?._seconds ||
                          moment().unix()
                      )
                      .format('DD MMM YYYY')}
                    secondary={''}
                  />
                </ListItem>
              </div>
            ))}
          </div>
          <div className={selectedLocation ? 'col-8' : 'hide'}>
            <TextField
              fullWidth
              type="text"
              label={t('name')}
              value={selectedLocation?.name}
              onChange={(e) =>
                setSelectedLocation({
                  ...selectedLocation,
                  name: e.target.value,
                })
              }
            />

            <TextField
              fullWidth
              label={t('address')}
              type="geo"
              value={selectedLocation?.address}
              onChange={(e) =>
                setSelectedLocation({
                  ...selectedLocation,
                  address: e.target.value,
                })
              }
            />
            <div className="d-flex">
              <div className="col-8" style={{ paddingRight: '20px' }}>
                <TextField
                  fullWidth
                  label={t('order')}
                  type="number"
                  value={selectedLocation?.order}
                  onChange={(e) =>
                    setSelectedLocation({
                      ...selectedLocation,
                      order: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-4 mt-1">
                <Checkbox
                  value={selectedLocation?.isActive ?? true}
                  label={t('isActive')}
                  onChange={(e) =>
                    setSelectedLocation({
                      ...selectedLocation,
                      isActive: e.target.checked,
                    })
                  }
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </div>
            </div>
          </div>
        </div>
      </Block>
    </MainLayoutV2>
  );
};

export default SettingsLocations;
