import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import TextField from '../../stories/general-components/TextField';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import Geo from '../../stories/general-components/Geo';
import Select from '../../stories/general-components/Select';
import GeneralText from '../../stories/general-components/GeneralText';
import IconUploader from '../../components/@generalComponents/IconUploader';
import moment from 'moment';
import Button from '../../stories/general-components/Button';

const Node = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [businessData, setBusinessData] = useState({});
  const [displayImg, setDisplayImg] = useState(true);
  const [lists, setLists] = useState([]);
  const [payment, setPayment] = useState({});
  const [methods, setMethods] = useState([]);
  const businessPreference = useSelector((state) => state.core.businessData);
  const currentUser = useSelector((state) => state.core.user);

  useEffect(() => {
    setBusinessData(businessPreference);
  }, [businessPreference]);

  const handleChange = (type, newValue) => {
    setBusinessData({ ...businessData, address: newValue });
  };

  const handleChangeHandler = (e, fieldType) => {
    setBusinessData({ ...businessData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (files) => {
    setBusinessData({ ...businessData, backgroundImage: files?.[0]?.fileUrl });
  };

  const handleOpenCard = (card) => {
    window.open(
      `${window.location.origin}/redirect/6jyRhYMJ45SObIlg89EK/cardsinvoiced/KmyEevTikiqoH0nrY4qW/${card?.id}?accessCode=${card?.accessCode}&shared=true`,
      '_blank'
    );
  };

  const getLists = async () => {
    try {
      const lists = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/billing`,
        body: {},
      });
      setLists(lists?.cards);
      setPayment(lists?.payment);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLists();
  }, [businessPreference?.id]);

  const handleSave = async () => {
    await nodeAxiosFirebase({
      t,
      method: 'PATCH',
      url: `business/general`,
      body: {
        businessData: {
          ...businessData,
        },
      },
    });
    setDisplayImg(true);
    toast.success(t('saved'));
  };

  const handleClickImg = () => {
    setDisplayImg(!displayImg);
  };

  const businessTypes = [
    {
      value: 'accounting',
      label: t('accounting'),
      id: 'accounting',
    },
    {
      value: 'advertising',
      label: t('advertising'),
      id: 'advertising',
    },
    {
      value: 'agriculture',
      label: t('agriculture'),
      id: 'agriculture',
    },
    {
      value: 'automotive',
      label: t('automotive'),
      id: 'automotive',
    },
    {
      value: 'beauty',
      label: t('beauty'),
      id: 'beauty',
    },
    {
      value: 'businessServices',
      label: t('businessServices'),
      id: 'businessServices',
    },
    {
      value: 'construction',
      label: t('construction'),
      id: 'construction',
    },
    {
      value: 'consulting',
      label: t('consulting'),
      id: 'consulting',
    },
    {
      value: 'education',
      label: t('education'),
      id: 'education',
    },
    {
      value: 'energy',
      label: t('energy'),
      id: 'energy',
    },
    {
      value: 'engineering',
      label: t('engineering'),
      id: 'engineering',
    },
    {
      value: 'entertainment',
      label: t('entertainment'),
      id: 'entertainment',
    },
    {
      value: 'fashion',
      label: t('fashion'),
      id: 'fashion',
    },
    {
      value: 'finance',
      label: t('finance'),
      id: 'finance',
    },
    {
      value: 'food',
      label: t('food'),
      id: 'food',
    },
    {
      value: 'government',
      label: t('government'),
      id: 'government',
    },
    {
      value: 'healthcare',
      label: t('healthcare'),
      id: 'healthcare',
    },
    {
      value: 'hospitality',
      label: t('hospitality'),
      id: 'hospitality',
    },
    {
      value: 'humanResources',
      label: t('humanResources'),
      id: 'humanResources',
    },
    {
      value: 'informationTechnology',
      label: t('informationTechnology'),
      id: 'informationTechnology',
    },
    {
      value: 'insurance',
      label: t('insurance'),
      id: 'insurance',
    },
    {
      value: 'legal',
      label: t('legal'),
      id: 'legal',
    },
    {
      value: 'logistics',
      label: t('logistics'),
      id: 'logistics',
    },
    {
      value: 'manufacturing',
      label: t('manufacturing'),
      id: 'manufacturing',
    },
    {
      value: 'marketing',
      label: t('marketing'),
      id: 'marketing',
    },
    {
      value: 'media',
      label: t('media'),
      id: 'media',
    },
    {
      value: 'nonProfit',
      label: t('nonProfit'),
      id: 'nonProfit',
    },
    {
      value: 'other',
      label: t('other'),
      id: 'other',
    },
    {
      value: 'personalServices',
      label: t('personalServices'),
      id: 'personalServices',
    },
    {
      value: 'professionalServices',
      label: t('professionalServices'),
      id: 'professionalServices',
    },
    {
      value: 'realEstate',
      label: t('realEstate'),
      id: 'realEstate',
    },
    {
      value: 'retail',
      label: t('retail'),
      id: 'retail',
    },
    {
      value: 'science',
      label: t('science'),
      id: 'science',
    },
    {
      value: 'sports',
      label: t('sports'),
      id: 'sports',
    },
    {
      value: 'technology',
      label: t('technology'),
      id: 'technology',
    },
    {
      value: 'telecommunications',
      label: t('telecommunications'),
      id: 'telecommunications',
    },
    {
      value: 'transportation',
      label: t('transportation'),
      id: 'transportation',
    },
    {
      value: 'travel',
      label: t('travel'),
      id: 'travel',
    },
    {
      value: 'utilities',
      label: t('utilities'),
      id: 'utilities',
    },
    {
      value: 'wholesale',
      label: t('wholesale'),
      id: 'wholesale',
    },
  ];

  const getMethods = async () => {
    try {
      const intent = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/payments`,
        noAuth: true,
        body: {
          type: 'methods',
          businessId: businessPreference?.businessCustomerId,
        },
        reduxDispatcher: dispatch,
        loadingMessage: `${t('gettingCard')}`,
      });
      setMethods(intent?.paymentMethods?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (businessPreference?.businessCustomerId) {
      getMethods();
    }
  }, [businessPreference?.businessCustomerId]);

  return (
    <MainLayoutV2
      pageTitle={t('myNode')}
      actions={{
        save: handleSave,
      }}
    >
      <Block height={1} heightPercentage={100}>
        <div className="p-3">
          <div className="row">
            <div className="col-6 mt-4 px-4">
              <GeneralText
                text={businessData?.name}
                label={t('name')}
                primary={true}
                size="bold"
                fontSize="14px"
              />
              <div className="mt-3">
                <GeneralText
                  text={businessData?.city}
                  label={t('region')}
                  primary={true}
                  size="medium"
                  fontSize="12px"
                />
              </div>
              <div className="mt-3">
                <GeneralText
                  text={businessData?.isActive ? t('active') : t('inactive')}
                  label={t('status')}
                  primary={true}
                  size="medium"
                  fontSize="12px"
                />
              </div>
              <div className="mt-3">
                <GeneralText
                  text={businessData?.timeStamp}
                  label={t('onNodeFrom')}
                  primary={true}
                  type="date"
                  size="medium"
                  fontSize="12px"
                />
              </div>
              <div className="mt-3">
                <GeneralText
                  text={'# ' + businessData?.id}
                  label={t('businessId')}
                  primary={true}
                  size="medium"
                  fontSize="12px"
                />
              </div>
            </div>
            <div className="col-6 hover">
              {displayImg ? (
                <img
                  onClick={handleClickImg}
                  src={businessData?.backgroundImage}
                  alt="bg"
                  width="100%"
                  height="250px"
                  style={{
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <IconUploader
                  fieldType="media-single"
                  onBlur={handleImageUpload}
                  onComplete={handleImageUpload}
                />
              )}
            </div>
            <div className="col-12 mt-3">
              <Geo
                label={t('address')}
                fullWidth
                onChange={handleChange}
                margin="normal"
                name="address"
                value={businessData?.address}
              />
            </div>

            <div className="col-9">
              <TextField
                label={t('description')}
                fullWidth
                name="description"
                onChange={handleChangeHandler}
                margin="normal"
                value={businessData?.description}
              />
            </div>
            <div className="col-3">
              <Select
                label={t('industry')}
                value={businessData?.businessType}
                onChange={(e, value) =>
                  setBusinessData({ ...businessData, businessType: value })
                }
                fullWidth
                selections={businessTypes}
              />
            </div>
            <div className="col-4">
              <TextField
                label={t('email')}
                fullWidth
                name="email"
                onChange={handleChangeHandler}
                margin="normal"
                value={businessData?.email}
              />
            </div>
            <div className="col-4">
              <TextField
                label={t('phone')}
                fullWidth
                name="phone"
                onChange={handleChangeHandler}
                margin="normal"
                value={businessData?.phone}
              />
            </div>
            <div className="col-4">
              <TextField
                label={t('website')}
                fullWidth
                name="website"
                onChange={handleChangeHandler}
                margin="normal"
                value={businessData?.website}
              />
            </div>
            <div className="col-3">
              <TextField
                label={t('taxId')}
                fullWidth
                name="taxId"
                onChange={handleChangeHandler}
                margin="normal"
                value={businessData?.taxId}
              />
            </div>
            <div className="col-3">
              <TextField
                label={t('taxIdName')}
                fullWidth
                name="taxIdName"
                onChange={handleChangeHandler}
                margin="normal"
                value={businessData?.taxIdName || ''}
              />
            </div>
            <div className="col-3">
              <TextField
                label={t('taxIdSecond')}
                fullWidth
                name="taxIdSecond"
                onChange={handleChangeHandler}
                margin="normal"
                value={businessData?.taxIdSecond}
              />
            </div>
            <div className="col-3">
              <TextField
                label={t('taxIdSecondName')}
                fullWidth
                name="taxIdNameSecond"
                onChange={handleChangeHandler}
                margin="normal"
                value={businessData?.taxIdNameSecond || ''}
              />
            </div>
          </div>

          <Divider component="div" sx={{ mt: 3, mb: 3 }} />
          <div className="row">
            <div className="col-3">
              <TextField
                label={t('mainColor')}
                fullWidth
                name="mainColor"
                type="color"
                onChange={handleChangeHandler}
                margin="normal"
                value={businessData?.mainColor}
              />
            </div>
            <div className="col-3">
              <TextField
                label={t('secColor')}
                fullWidth
                name="secColor"
                type="color"
                onChange={handleChangeHandler}
                margin="normal"
                value={businessData?.secColor}
              />
            </div>
          </div>
          <Divider component="div" sx={{ mt: 3, mb: 3 }} />
        </div>
        <div className="p-3">
          <GeneralText
            text={t('invoices')}
            primary={true}
            size="bold"
            fontSize="14px"
            classNameComponent="px-3"
          />
          {!lists?.length === 0 && (
            <GeneralText
              text={t('noCardsGenerated')}
              primary={true}
              size="regular"
              fontSize="12px"
              classNameComponent="px-3 mt-2"
            />
          )}
          <List dense>
            {lists?.length > 0 &&
              lists?.map((card, idx) => {
                return (
                  <div key={idx}>
                    <ListItem divider>
                      <ListItemText sx={{ width: '35%' }}>
                        {card?.name}
                      </ListItemText>
                      <ListItemText sx={{ width: '15%' }}>
                        {moment
                          .unix(
                            card?.invoiceDate?.seconds ||
                              card?.invoiceDate?._seconds
                          )
                          .format('DD MMM YYYY')}
                      </ListItemText>
                      <ListItemText sx={{ width: '15%' }}>
                        {'# ' + card?.searchId}
                      </ListItemText>
                      <ListItemText sx={{ width: '20%' }}>
                        {card?.finances?.total?.toFixed(2) + ' $'}
                      </ListItemText>
                      <ListItemButton
                        sx={{
                          width: '15%',
                          fontWeight: 600,
                          color: 'secondary.main',
                        }}
                        onClick={() => {
                          handleOpenCard(card);
                        }}
                      >
                        {t('open')}
                      </ListItemButton>
                    </ListItem>
                  </div>
                );
              })}
          </List>
        </div>

        <div className="p-3 mt-5">
          <GeneralText
            text={t('finances')}
            primary={true}
            size="bold"
            fontSize="14px"
            classNameComponent="px-3"
          />

          <div className="row">
            {methods?.length === 0 && (
              <div className="col-5 mt-2 px-4">
                <GeneralText
                  text={t('noPaymentMethod')}
                  primary={true}
                  size="regular"
                  fontSize="12px"
                  classNameComponent="px-3 mt-2"
                />
              </div>
            )}

            {methods?.length > 0 && (
              <div className="col-5 mt-2 px-4">
                {methods?.map((method, idx) => {
                  return (
                    <div
                      key={idx}
                      className="mt-2"
                      style={{
                        backgroundColor: '#F9f9f9',
                        border: '1px solid #69696950',
                        padding: '10px',
                        borderRadius: '6px',
                      }}
                    >
                      <GeneralText
                        text={
                          t(method?.type) +
                          ' - ' +
                          t('added') +
                          ' ' +
                          moment.unix(method?.created).fromNow()
                        }
                        primary={true}
                        size="medium"
                        fontSize="12px"
                        classNameComponent="px-3 mt-2"
                      />
                      {method?.type === 'card' && (
                        <GeneralText
                          text={
                            method?.card?.brand?.toUpperCase() +
                            ' - ' +
                            method?.card?.last4
                          }
                          primary={true}
                          size="regular"
                          fontSize="10px"
                          classNameComponent="px-3 mt-2"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="col-3 mt-4 px-3"></div>
            <div className="col-4 mt-4 px-3">
              <Button
                label={t('portalFinances')}
                onClick={() => {
                  window.open(
                    `https://billing.stripe.com/p/login/8wM01UcrC2ZDd8Y6oo?prefilled_email=${currentUser?.email}`,
                    '_blank'
                  );
                }}
                size="small"
                variant="text"
                classNameComponent="mt-2"
                endIcon={'ArrowForward'}
              />
            </div>
          </div>
        </div>
      </Block>
    </MainLayoutV2>
  );
};

export default Node;
