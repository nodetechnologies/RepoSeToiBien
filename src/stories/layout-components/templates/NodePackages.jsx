import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../../../components/@generalComponents/ErrorBoundary';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';
import { Divider, Drawer, IconButton, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import GeneralText from '../../general-components/GeneralText';
import moment from 'moment';
import {
  Add,
  AddOutlined,
  EditOutlined,
  GridOnOutlined,
  LeaderboardOutlined,
  OpenInNewOutlined,
  ReceiptOutlined,
  RemoveCircleOutlineOutlined,
  SchemaOutlined,
  ViewInArOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import Geo from '../../general-components/Geo';
import TextField from '../../general-components/TextField';
import Checkbox from '../../general-components/Checkbox';
import DrawerSide from '../DrawerSide';
import Selection from '../../general-components/Selection';

const NodePackages = ({ elementDetails }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    isDev: true,
  });
  const [businessData, setBusinessData] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState('add');
  const [drawerOpenStructure, setDrawerOpenStructure] = useState(false);

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleCloseDrawerStructure = () => {
    setDrawerOpenStructure(false);
  };

  const fetchPackages = async () => {
    try {
      const dataBusiness = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `masterData`,
        body: {
          businessId: elementDetails?.elementData?.businessId,
          operator: 'get-package',
          data: {},
        },
      });
      setBusinessData(dataBusiness);
      setFormData({
        name: dataBusiness?.business?.name,
        city: dataBusiness?.business?.city || '',
        address: dataBusiness?.business?.address || '',
        description: dataBusiness?.business?.description || '',
        phone: dataBusiness?.business?.phone || '',
        email: dataBusiness?.business?.email || '',
        mainColor: dataBusiness?.business?.mainColor,
        secondaryColor: dataBusiness?.business?.secColor,
        website: dataBusiness?.business?.website || '',
        isDev: dataBusiness?.business?.isDev || false,
        taxId: dataBusiness?.business?.taxId || '',
        taxIdSecond: dataBusiness?.business?.taxIdSecond || '',
        taxIdThird: dataBusiness?.business?.taxIdThird || '',
        isListed: dataBusiness?.business?.isListed || false,
        planCode: dataBusiness?.business?.planCode || 'active',
        formula: dataBusiness?.business?.formula || 'trial',
        billingReset: dataBusiness?.business?.billingReset || '',
        discountPlan: dataBusiness?.business?.discountPlan || 0,
        manualLineBilling: dataBusiness?.business?.manualLineBilling,
        frequency: dataBusiness?.business?.frequency,
      });
    } catch (error) {
      console.error('Error fetching data');
    }
  };

  const handleSaveData = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `masterData`,
        body: {
          businessId: elementDetails?.elementData?.businessId,
          operator: 'set-business',
          data: {
            name: formData?.name,
            city: formData?.city,
            address: formData?.address,
            description: formData?.description,
            phone: formData?.phone,
            email: formData?.email,
            mainColor: formData?.mainColor,
            secColor: formData?.secondaryColor,
            isDev: formData?.isDev || false,
            website: formData?.website,
            taxId: formData?.taxId,
            taxIdSecond: formData?.taxIdSecond,
            taxIdThird: formData?.taxIdThird,
            isListed: formData?.isListed || false,
            planCode: formData?.planCode || 'active',
            formula: formData?.formula || 'trial',
            billingReset: formData?.billingReset || '',
            discountPlan: formData?.discountPlan || 0,
            manualLineBilling: formData?.manualLineBilling,
            frequency: formData?.frequency,
          },
        },
      });
      fetchPackages();
      handleCloseDrawer();
    } catch (error) {
      console.error('Error saving data');
    }
  };

  const editBusinessDetails = () => {
    setDrawerOpen(true);
    setCurrentAction('edit');
  };

  const handleNewStrucutre = () => {
    setDrawerOpenStructure(true);
    setCurrentAction('create-structures');
  };

  const viewUsage = () => {
    setDrawerOpen(true);
    setCurrentAction('usage');
  };

  const openPage = () => {
    window.open(
      'https://usenode.com/page/' + elementDetails?.elementData?.businessId,
      '_blank'
    );
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSaveDataStructure = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `handleUpdateBusinessMaster`,
        body: {
          businessId: elementDetails?.elementData?.businessId,
          type: 'structure-create',
          data: {
            collectionField: formData?.collectionField,
          },
        },
      });
      fetchPackages();
      handleCloseDrawerStructure();
    } catch (error) {
      console.error('Error saving data');
    }
  };

  return (
    <div>
      <DrawerSide
        isDrawerOpen={drawerOpen}
        handleSave={handleSaveData}
        handleDrawerClose={() => handleCloseDrawer()}
        title={t(currentAction)}
        subtitle={t(elementDetails?.elementData?.name)}
      >
        {currentAction === 'edit' && (
          <div>
            <GeneralText
              text={t('businessData')}
              primary={true}
              fontSize="14px"
              size="medium"
              classNameComponent="mt-4 px-3"
            />
            <div>
              <TextField
                label={t('name')}
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                value={formData?.name}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label={t('territory')}
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city: e.target.value,
                  })
                }
                value={formData?.city}
                fullWidth
              />
            </div>
            <div>
              <Geo
                label={t('address')}
                type="text"
                onChange={(e, value) =>
                  setFormData({
                    ...formData,
                    address: value,
                  })
                }
                value={formData?.address}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label={t('descriptionDescribe')}
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                value={formData?.description}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label={t('phone')}
                type="phone"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                value={formData?.phone}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label={t('email')}
                type="email"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                value={formData?.email}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label={t('website')}
                type="url"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    website: e.target.value,
                  })
                }
                value={formData?.website}
                fullWidth
              />
            </div>

            <div>
              <TextField
                label={t('taxId')}
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxId: e.target.value,
                  })
                }
                value={formData?.taxId}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label={t('taxIdSecond')}
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxIdSecond: e.target.value,
                  })
                }
                value={formData?.taxIdSecond}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label={t('taxIdThird')}
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxIdThird: e.target.value,
                  })
                }
                value={formData?.taxIdThird}
                fullWidth
              />
            </div>

            <div>
              <TextField
                label={t('mainColor')}
                type="color"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mainColor: e.target.value,
                  })
                }
                value={formData?.mainColor}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label={t('secColor')}
                type="color"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secColor: e.target.value,
                  })
                }
                value={formData?.secColor}
                fullWidth
              />
            </div>
            <div>
              <Checkbox
                label={t('isDev')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isDev: e.target.checked,
                  })
                }
                value={formData?.isDev}
                fullWidth
              />
            </div>
            <div>
              <Checkbox
                label={t('isListed')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isListed: e.target.checked,
                  })
                }
                value={formData?.isListed}
                fullWidth
              />
            </div>
            <GeneralText
              text={t('billingData')}
              primary={true}
              fontSize="14px"
              size="medium"
              classNameComponent="mt-4 px-3"
            />
            <div>
              <TextField
                label={t('billingResetDay')}
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    billingReset: e.target.value,
                  })
                }
                value={formData?.billingReset}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label={t('discountPlan')}
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountPlan: e.target.value,
                  })
                }
                value={formData?.discountPlan}
                fullWidth
              />
            </div>
            <Selection
              value={formData?.formula}
              onChange={(e, value) =>
                setFormData({ ...formData, formula: value })
              }
              field={{
                typeData: 'selectionNode',
                required: false,
              }}
              selections={[
                {
                  label: 'Trial',
                  value: 'trial',
                  id: 'trial',
                  color: '#000000',
                },
                {
                  label: 'Flash',
                  value: 'flash',
                  id: 'flash',
                  color: '#000000',
                },
                {
                  label: 'Rise',
                  value: 'rise',
                  id: 'rise',
                  color: '#000000',
                },
                {
                  label: 'No plan',
                  value: 'inactive',
                  id: 'inactive',
                  color: '#000000',
                },
              ]}
              label={t('formula')}
            />
            <Selection
              value={formData?.frequency}
              onChange={(e, value) =>
                setFormData({ ...formData, frequency: value })
              }
              field={{
                typeData: 'selectionNode',
                required: false,
              }}
              selections={[
                {
                  label: 'Monthly',
                  value: 'month',
                  id: 'month',
                  color: '#000000',
                },
                {
                  label: 'Annual',
                  value: 'ann',
                  id: 'ann',
                  color: '#000000',
                },
              ]}
              label={t('frequency')}
            />
            <Selection
              value={formData?.planCode}
              onChange={(e, value) =>
                setFormData({ ...formData, planCode: value })
              }
              field={{
                typeData: 'selectionNode',
                required: false,
              }}
              selections={[
                {
                  label: 'Active',
                  value: 'active',
                  id: 'active',
                  color: '#000000',
                },
                {
                  label: 'Billing Issue',
                  value: 'billing',
                  id: 'billing',
                  color: '#000000',
                },
                {
                  label: 'Locked',
                  value: 'locked',
                  id: 'locked',
                  color: '#000000',
                },
              ]}
              label={t('planCode')}
            />
            <div className="d-flex">
              <div className="col-7">
                <TextField
                  label={t('name')}
                  type="text"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      manualLineBilling: {
                        ...formData?.manualLineBilling,
                        name: e.target.value,
                      },
                    })
                  }
                  value={formData?.manualLineBilling?.name}
                  fullWidth
                />
              </div>
              <div className="col-5">
                <TextField
                  label={t('price')}
                  type="number"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      manualLineBilling: {
                        ...formData?.manualLineBilling,
                        price: e.target.value,
                      },
                    })
                  }
                  value={formData?.manualLineBilling?.price}
                  fullWidth
                />
              </div>
            </div>
            <div>
              <TextField
                label={t('description')}
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    manualLineBilling: {
                      ...formData?.manualLineBilling,
                      description: e.target.value,
                    },
                  })
                }
                value={formData?.manualLineBilling?.description}
                fullWidth
              />
            </div>
          </div>
        )}
      </DrawerSide>

      <DrawerSide
        isDrawerOpen={drawerOpenStructure}
        handleSave={handleSaveDataStructure}
        handleDrawerClose={() => handleCloseDrawerStructure()}
        title={t(currentAction)}
      >
        {currentAction === 'create-structures' && (
          <div>
            <GeneralText
              text={t('createStructure')}
              primary={true}
              fontSize="14px"
              size="medium"
              classNameComponent="mt-4 px-3"
            />

            <Selection
              value={formData?.collectionField}
              onChange={(e, value) => setFormData({ collectionField: value })}
              field={{
                typeData: 'selectionNode',
                required: false,
              }}
              selections={[
                {
                  label: 'Contacts',
                  value: 'contacts',
                  id: 'contacts',
                  color: '#000000',
                },
                {
                  label: 'Services',
                  value: 'services',
                  id: 'services',
                  color: '#000000',
                },
                {
                  label: 'Articles',
                  value: 'articles',
                  id: 'articles',
                  color: '#000000',
                },
                {
                  label: 'Grids',
                  value: 'grids',
                  id: 'grids',
                  color: '#000000',
                },
                {
                  label: 'Passes',
                  value: 'passes',
                  id: 'passes',
                  color: '#000000',
                },
                {
                  label: 'Items',
                  value: 'items',
                  id: 'items',
                  color: '#000000',
                },
                {
                  label: 'Payments',
                  value: 'payments',
                  id: 'payments',
                  color: '#000000',
                },
                {
                  label: 'Cards Invoiced',
                  value: 'cardsInvoiced',
                  id: 'cardsInvoiced',
                  color: '#000000',
                },
                {
                  label: 'Cards',
                  value: 'cardsuninvoiced',
                  id: 'cardsuninvoiced',
                  color: '#000000',
                },
                {
                  label: 'Cards Expense',
                  value: 'cardsexpense',
                  id: 'cardsexpense',
                  color: '#000000',
                },
                {
                  label: 'Profiles',
                  value: 'profiles',
                  id: 'profiles',
                  color: '#000000',
                },
                {
                  label: 'Storages',
                  value: 'storages',
                  id: 'storages',
                  color: '#000000',
                },
                {
                  label: 'Tasks',
                  value: 'tasks',
                  id: 'tasks',
                  color: '#000000',
                },
                {
                  label: 'Nodies',
                  value: 'nodies',
                  id: 'nodies',
                  color: '#000000',
                },
              ]}
              label={t('type')}
            />
          </div>
        )}
      </DrawerSide>
      <div className="row mb-3">
        <div className="col-2 align-c">
          <Avatar
            sx={{ marginLeft: '15px', width: '30px', height: '30px' }}
            src={`https://storage.googleapis.com/node-business-logos/${elementDetails?.elementData?.businessId}.png`}
          />
        </div>
        <div className="col-6">
          <div>
            <GeneralText
              text={'#' + ' ' + elementDetails?.elementData?.businessId}
              primary={true}
              fontSize="12px"
              size="medium"
            />
          </div>
          <div>
            <GeneralText
              text={moment
                .unix(
                  businessData?.business?.lastUpdate?._seconds ||
                    moment().unix()
                )
                .format('DD MMM YYYY HH:mm')}
              primary={true}
              fontSize="10px"
              size="regular"
            />
          </div>
        </div>
        <div className="col-4">
          <Tooltip title={t('edit')}>
            <span>
              <IconButton onClick={editBusinessDetails}>
                <EditOutlined />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('usage')}>
            <span>
              <IconButton onClick={viewUsage}>
                <LeaderboardOutlined />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('openPage')}>
            <span>
              <IconButton onClick={openPage}>
                <OpenInNewOutlined />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
      <Divider component="div" />
      <div className="row mt-3 mb-3">
        <div className="col-2 align-c"></div>
        <div className="col-6">
          <div>{t('structures')}</div>
          <div>
            <GeneralText
              text={businessData?.structures?.length + ' ' + t('structures')}
              primary={true}
              fontSize="10px"
              size="regular"
            />
          </div>
        </div>
        <div className="col-4">
          <Tooltip title={t('addNew')}>
            <span>
              <IconButton onClick={handleNewStrucutre}>
                <Add />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('viewStructures')}>
            <span>
              <IconButton>
                <GridOnOutlined />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('accountSchema')}>
            <span>
              <IconButton>
                <SchemaOutlined />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
      <Divider component="div" />
      <div className="row mt-3 mb-3">
        <div className="col-2 align-c"></div>
        <div className="col-6">
          <div>{t('modules')}</div>
          <div>
            <GeneralText
              text={businessData?.modules?.length + ' ' + t('modules')}
              primary={true}
              fontSize="10px"
              size="regular"
            />
          </div>
        </div>
        <div className="col-4">
          <Tooltip title={t('addNew')}>
            <span>
              <IconButton>
                <Add />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('viewList')}>
            <span>
              <IconButton>
                <ViewInArOutlined />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
      <Divider component="div" />
      <div className="row mt-3 mb-3">
        <div className="col-2 align-c"></div>
        <div className="col-6">
          <div>{t('users')}</div>
          <div>
            <GeneralText
              text={(businessData?.employees?.length || 0) + ' ' + t('users')}
              primary={true}
              fontSize="10px"
              size="regular"
            />
          </div>
        </div>
        <div className="col-4">
          <Tooltip title={t('listActive')}>
            <span>
              <IconButton>
                <VisibilityOutlined />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default NodePackages;
