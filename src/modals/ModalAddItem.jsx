import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGeneralStatus, setRefresh } from '../redux/actions-v2/coreAction';

//utilities
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import Tabs from '@mui/material/Tabs';
import Badge from '@mui/material/Badge';
import Tab from '@mui/material/Tab';
import { db } from '../firebase';
import { groupBy } from 'lodash';
import { getDocs, query, doc, collection } from '@firebase/firestore';
import { useParams } from 'react-router-dom';

//components
import ModalHuge from './Base/ModalHuge';
import { handleListData } from '../redux/actions-v2/listAction';
import ItemSelect from '../components/modalHelpers/ItemSelect';
import TextField from '../stories/general-components/TextField';
import { useTheme } from '@mui/material/styles';
import {
  Chip,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import moment from 'moment';
import {
  AddCircleOutlineSharp,
  Article,
  BusinessCenter,
  DeleteForever,
  ShoppingCart,
} from '@mui/icons-material';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import NodeAIIcon from '../components/@generalComponents/layout/NodeAIIcon';

const ModalSelectArticle = ({
  isOpen,
  modalCloseHandler,
  onSelect,
  group,
  defaultTab,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { moduleName, moduleId, structureId, segmentId } = useParams();

  const singleCardDetails = useSelector(
    (state) => state.element.singleElementDetails
  );

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const businessStructures = businessStructure?.structures;
  const businessModules = businessStructure?.modules;

  const serviceModuleId = businessModules?.find(
    (module) => module?.collectionField === 'services'
  )?.id;

  const articleModuleId = businessModules?.find(
    (module) => module?.collectionField === 'articles'
  )?.id;

  const serviceStructureId = businessStructures?.find(
    (structure) => structure?.collectionField === 'services'
  )?.id;

  const articleStructureId = businessStructures?.find(
    (structure) => structure?.collectionField === 'articles'
  )?.id;

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultTab || 0);
  const [reservedItems, setReservedItems] = useState([]);
  const [suggestItems, setSuggestItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const articlesReducer = useSelector((state) => state.list.data);
  const articles = articlesReducer?.articles;
  const servicesReducer = useSelector((state) => state.list.data);
  const services = servicesReducer?.services;

  const groupItems = (items) => {
    return groupBy(items, 'group');
  };

  const handleItemSelected = (item, option) => {
    const quantity =
      activeTab === 0 ? (item?.type === 0 ? 1 : item?.price || 1) : 1;
    onSelect(item, option, group, activeTab, quantity);
    modalCloseHandler();
  };

  useEffect(() => {
    setSearchValue('');
  }, [activeTab]);

  // Debounced search function
  const debouncedSearch = debounce(() => {
    if (searchValue === '') {
      return;
    } else {
      if (activeTab === 0) {
        dispatch(
          handleListData(
            searchValue,
            serviceStructureId,
            serviceModuleId,
            null,
            null,
            30,
            null,
            null,
            t,
            null,
            null,
            'fr',
            null,
            null,
            null
          )
        );
      }
      if (activeTab === 1) {
        dispatch(
          handleListData(
            searchValue,
            articleStructureId,
            articleModuleId,
            null,
            null,
            30,
            null,
            null,
            t,
            null,
            null,
            'fr',
            null,
            null,
            null
          )
        );
      }
    }
  }, 400);

  useEffect(() => {
    if ((activeTab === 0 || activeTab === 1) && searchValue !== '') {
      debouncedSearch();
      return () => {
        debouncedSearch.cancel();
      };
    }
  }, [searchValue]);

  useEffect(() => {
    if (activeTab === 0) {
      dispatch(
        handleListData(
          '',
          serviceStructureId,
          serviceModuleId,
          null,
          null,
          30,
          null,
          null,
          t,
          null,
          null,
          'fr',
          null,
          null,
          null
        )
      );
    }
    if (activeTab === 1) {
      dispatch(
        handleListData(
          '',
          articleStructureId,
          articleModuleId,
          null,
          null,
          30,
          null,
          null,
          t,
          null,
          null,
          'fr',
          null,
          null,
          null
        )
      );
    }
    if (activeTab === 2) {
      getDocsRecommendations();
    }
    if (activeTab === 3) {
      getDocsReserveItems();
    }
  }, [activeTab]);

  const getDocsReserveItems = async () => {
    try {
      const targetRef = doc(
        db,
        'users',
        singleCardDetails?.targetId,
        'connections',
        singleCardDetails?.targetId + businessPreference?.id
      );
      const itemsQuery = query(collection(targetRef, 'items'));
      const querySnapshot = await getDocs(itemsQuery);
      let reserveItems = [];
      reserveItems = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        ownerId: businessPreference?.id,
        targetId: singleCardDetails?.targetId,
        dependencyId: doc.data()?.dependencyId?.id,
        targetProfileId: doc.data()?.targetProfileId?.id,
        structureId: doc.data()?.structureId?.id,
        itemRef: doc.data()?.itemRef?.path,
      }));

      setReservedItems(reserveItems);
    } catch (error) {
      console.error('Error getting documents');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };
  const getDocsRecommendations = async () => {
    try {
      const suggestion = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreMulti/suggestions`,
        body: {
          currentElementId: singleCardDetails?.id,
          collection: 'cards',
          structureId: structureId,
        },
      });

      setSuggestItems(suggestion?.suggestions);
    } catch (error) {
      console.error('Error getting documents');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };
  const deleteReserveGroup = async (item, option) => {
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'modal',
          type: 'pulse',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'DELETE',
        url: `business/single-item`,
        body: {
          userId: singleCardDetails?.targetId,
          itemId: item?.id,
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'modal',
          type: 'pulse',
        })
      );
      getDocsReserveItems();
    } catch (error) {
      console.error('Failed to delete item');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const addGroupItems = async (items, groupKey) => {
    for (let item of items) {
      const type = item?.serviceId ? 0 : 1;
      onSelect(
        {
          id: item?.serviceId || item?.articleId,
          name: item?.name,
          quantity: item?.quantity,
        },
        null,
        groupKey,
        type,
        item?.quantity
      );
    }
    modalCloseHandler();
  };

  return (
    <ModalHuge
      isOpen={isOpen}
      modalCloseHandler={modalCloseHandler}
      title={t('addItem')}
    >
      <div className="p-3" style={{ height: '72vh' }}>
        <div
          style={{
            position: 'fixed',
            width: '94%',
            backgroundColor: isDark ? '#333' : '#fff',
            zIndex: 100,
            padding: '4px 12px',
            borderRadius: '12px',
          }}
          className="d-flex"
        >
          <div className="col-7 d-flex">
            <div
              className={activeTab === 2 || activeTab === 3 ? 'hide' : 'col-8'}
            >
              <TextField
                type="search"
                fullWidth
                label={t('search')}
                onChange={(e) => setSearchValue(e?.target?.value)}
              />
            </div>
            <div className="col-4 px-2"></div>
          </div>
          <div className="col-5 mt-2">
            <Tabs
              value={activeTab}
              onChange={(event, newValue) => setActiveTab(newValue)}
              indicatorColor="primary"
              centered
            >
              <Tab
                value={0}
                label={
                  <div className="d-flex middle-content">
                    <BusinessCenter style={{ marginRight: '8px' }} />
                    {'Services'}
                  </div>
                }
              />
              <Tab
                value={1}
                label={
                  <div className="d-flex middle-content">
                    <ShoppingCart style={{ marginRight: '8px' }} />
                    {'Articles'}
                  </div>
                }
              />
              <Tab
                value={2}
                label={
                  <div className="d-flex middle-content">
                    <NodeAIIcon size={22} style={{ marginRight: '8px' }} />
                    {t('recommendations')}
                  </div>
                }
              />
              <Tab
                value={3}
                label={
                  <div className="d-flex middle-content">
                    <Article style={{ marginRight: '8px' }} />
                    {t('reserveItems')}
                  </div>
                }
              />
            </Tabs>
          </div>
        </div>
        <div style={{ marginTop: '100px' }}>
          {' '}
          <ListItem divider dense>
            <ListItemText sx={{ width: '7%' }} primary={'-'} />
            <ListItemText sx={{ width: '36%' }} primary={t('name')} />
            <ListItemText sx={{ width: '21%' }} primary={t('unity')} />
            <ListItemText
              sx={{ width: '21%' }}
              primary={activeTab === 2 ? t('lastPurchase') : t('lastUpdate')}
            />
            <ListItemText sx={{ width: '4%' }} primary={'-'} />
            <ListItemText sx={{ width: '4%' }} primary={'-'} />
            <ListItemText sx={{ width: '4%' }} primary={'-'} />
          </ListItem>
        </div>
        <div>
          {activeTab === 0 && (
            <div className="row mt-3 mb-4">
              {services &&
                services?.map((article) => {
                  return (
                    <ItemSelect
                      article={article}
                      selectedArticle={selectedArticle}
                      setSelectedArticle={setSelectedArticle}
                      handleItemSelected={handleItemSelected}
                    />
                  );
                })}
            </div>
          )}
          {activeTab === 1 && (
            <div className="row mt-3 mb-4">
              {articles &&
                articles?.map((article) => {
                  return (
                    <ItemSelect
                      article={article}
                      selectedArticle={selectedArticle}
                      setSelectedArticle={setSelectedArticle}
                      handleItemSelected={handleItemSelected}
                    />
                  );
                })}
            </div>
          )}
          {activeTab === 2 && (
            <div className="row mt-3 mb-4">
              {suggestItems &&
                suggestItems?.map((article) => {
                  return (
                    <ItemSelect
                      article={article}
                      selectedArticle={selectedArticle}
                      setSelectedArticle={setSelectedArticle}
                      handleItemSelected={handleItemSelected}
                    />
                  );
                })}
            </div>
          )}
          {activeTab === 3 &&
            Object.entries(groupItems(reservedItems))?.map(
              ([groupKey, items]) => (
                <div
                  style={{
                    border: '1px solid #f9f9f990',
                    borderRadius: '10px',
                    padding: '8px',
                    marginBottom: '15px',
                  }}
                  key={groupKey}
                >
                  {' '}
                  <IconButton onClick={() => addGroupItems(items, groupKey)}>
                    <AddCircleOutlineSharp color="primary" />
                  </IconButton>
                  <Chip
                    key={groupKey}
                    label={t('group') + ' ' + groupKey?.toUpperCase() || 'N/A'}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ marginRight: '5px' }}
                  />
                  {items?.map((article) => (
                    <ListItem divider key={article.id}>
                      <ListItemText
                        sx={{ width: '40%' }}
                        primary={article?.name}
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondary={article?.targetProfileName || '-'}
                      />
                      <ListItemText
                        sx={{ width: '40%' }}
                        primary={article?.subtotal + ' $'}
                        secondary={moment
                          .unix(
                            article?.lastUpdate.seconds ||
                              article?.lastUpdate._seconds
                          )
                          .format('DD MMM YYYY')}
                      />
                      <ListItemText
                        sx={{ width: '20%' }}
                        primary={article?.sku || '-'}
                        secondary={article?.note || '-'}
                      />
                      <ListItemIcon
                        onClick={() =>
                          deleteReserveGroup(article, 'reserveItem')
                        }
                      >
                        <DeleteForever />
                      </ListItemIcon>
                    </ListItem>
                  ))}
                </div>
              )
            )}
        </div>
      </div>
    </ModalHuge>
  );
};

export default ModalSelectArticle;
