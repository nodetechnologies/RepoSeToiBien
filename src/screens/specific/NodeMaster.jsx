import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import TextField from '../../stories/general-components/TextField';
import Button from '../../stories/general-components/Button';
import GeneralText from '../../stories/general-components/GeneralText';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import Select from '../../stories/general-components/Select';

const NodeMaster = () => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [businessId, setBusinessId] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [businessData, setBusinessData] = useState({});
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');

  const [activeMenu, setActiveMenu] = useState(
    businessData?.businessUpdates?.activeMenu || []
  );
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    name_fr: '',
    name_en: '',
    groups: [],
  });

  // Function to add a new item to the activeMenu array
  const addItemToActiveMenu = (item) => {
    setActiveMenu((prevActiveMenu) => [...prevActiveMenu, item]);
    setNewMenuItem({ name: '', name_fr: '', name_en: '', groups: [] });
  };

  // Function to remove an item from the activeMenu array
  const removeItemFromActiveMenu = (itemToRemove) => {
    setActiveMenu((prevActiveMenu) =>
      prevActiveMenu.filter((item) => item.name !== itemToRemove.name)
    );
  };

  const getBusinessData = async () => {
    try {
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `masterData`,
        body: {
          businessId,
          authCode,
          operator: 'get',
          updates: {},
        },
      });
      setBusinessData(response);
      setActiveMenu(response?.businessUpdates?.activeMenu || []);
    } catch (error) {
      console.error('Error getting business data:', error);
    }
  };

  const updateBusinessData = async () => {
    try {
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `masterData`,
        body: {
          businessId,
          authCode,
          operator: 'update',
          updates: {
            activeMenu,
          },
        },
      });
      setBusinessData(response);
    } catch (error) {
      console.error('Error getting business data:', error);
    }
  };

  const addEmployee = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/employee`,
        body: {
          businessId: businessId,
          email: userId,
          role: 'ADMIN',
          groups: ['ADMIN'],
        },
      });
      setAuthCode('');
      setUserId('');
      setRole('');
      toast.success(t('employeeAdded'));
    } catch (error) {
      console.error('Error getting business data:', error);
    }
  };

  return (
    <MainLayoutV2 pageTitle={t('master')} elementId="node">
      <Block height={1} heightPercentage={82}>
        <GeneralText
          text={businessData?.businessData?.name ? t('loggedIn') : t('login')}
          primary={true}
        />
        {!businessData?.businessData?.name && (
          <div className="col-12">
            <TextField
              label={t('businessId')}
              value={businessId}
              fullWidth
              onChange={(e) => setBusinessId(e.target.value)}
            />
            <TextField
              label={t('authCode')}
              fullWidth
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            />
            <TextField
              label={t('employeeEmail')}
              fullWidth
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Select
              label={t('role')}
              fullWidth
              value={role}
              onChange={(e, value) => setRole(value)}
              options={[
                { value: 'ADMIN', label: 'Admin', id: 'ADMIN' },
                { value: 'EMPLOYEE', label: 'Employee', id: 'EMPLOYEE' },
              ]}
            />

            <div className="row">
              <div className="col-6">
                <Button
                  label={t('addEmployee')}
                  primary
                  fullWidth
                  onClick={addEmployee}
                  buttonSx={{ mt: 2 }}
                />
              </div>
              <div className="col-6">
                <Button
                  label={t('getData')}
                  primary
                  fullWidth
                  onClick={getBusinessData}
                  buttonSx={{ mt: 2 }}
                />
              </div>
            </div>
          </div>
        )}
        {businessData?.businessData?.name && (
          <div>
            <GeneralText
              text={businessData?.businessData?.name}
              primary={true}
            />
            <div>
              {activeMenu?.map((item, index) => (
                <div key={index}>
                  <p>{item.name}</p>
                  <Button onClick={() => removeItemFromActiveMenu(item)}>
                    Remove
                  </Button>
                </div>
              ))}
              <div>
                <TextField
                  label="Name"
                  value={newMenuItem.name}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, name: e.target.value })
                  }
                />
                <TextField
                  label="Name (French)"
                  value={newMenuItem.name_fr}
                  onChange={(e) =>
                    setNewMenuItem({
                      ...newMenuItem,
                      name_fr: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Name (English)"
                  value={newMenuItem.name_en}
                  onChange={(e) =>
                    setNewMenuItem({
                      ...newMenuItem,
                      name_en: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Groups (comma-separated)"
                  value={newMenuItem.groups.join(',')}
                  onChange={(e) =>
                    setNewMenuItem({
                      ...newMenuItem,
                      groups: e.target.value.split(','),
                    })
                  }
                />
                <Button
                  label={t('add')}
                  onClick={() => addItemToActiveMenu(newMenuItem)}
                />
              </div>
            </div>
            <Button
              label={t('update')}
              primary
              fullWidth
              onClick={updateBusinessData}
              buttonSx={{ mt: 2 }}
            />
          </div>
        )}
      </Block>
    </MainLayoutV2>
  );
};

export default NodeMaster;
