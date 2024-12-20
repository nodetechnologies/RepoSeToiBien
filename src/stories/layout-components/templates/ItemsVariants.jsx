import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../../../components/@generalComponents/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Badge,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { db } from '../../../firebase';
import { getDocs, query, collection } from 'firebase/firestore';
import { useParams } from 'react-router';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Add, DeleteForever, Edit } from '@mui/icons-material';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';
import TextField from '../../general-components/TextField';
import Button from '../../general-components/Button';
import Checkbox from '../../general-components/Checkbox';
import getRandomString from '../../../utils/getRandomString';
import Search from '../../general-components/Search';
import GeneralText from '../../general-components/GeneralText';
import SelectAutoComplete from '../../general-components/SelectAutoComplete';

const ItemsVariants = ({ elementData }) => {
  const { t } = useTranslation();
  const [currentType, setCurrentType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { elementId, moduleName } = useParams();

  const options = elementData?.options || [];
  const [variants, setVariants] = useState([]);
  const [items, setItems] = useState([]);
  const [fieldsToDisplay, setFieldsToDisplay] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [action, setAction] = useState(null);
  const [parentElementCollection, setParentElementCollection] = useState(null);
  const [optionsByGroup, setOptionsByGroup] = useState({});
  const [listOfGroups, setListOfGroups] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    if (elementData?.nbVariants > 0) {
      getVariants();
    }
    if (elementData?.nbItems > 0) {
      getItems();
    }
  }, [elementData?.nbVariants]);

  const handleSearchChange = (fieldKey) => {
    setFieldValues((prevValues) => ({ ...prevValues, id: fieldKey }));
  };

  const getVariants = async () => {
    try {
      const variantsQuery = query(
        collection(db, moduleName, elementId, 'variants')
      );
      const querySnapshot = await getDocs(variantsQuery);

      const allVariants = querySnapshot?.docs?.map((doc) => {
        const variantData = doc.data();
        return {
          id: doc?.id,
          ...variantData,
          ownerId: variantData?.businessId?.id || null,
          businessRef: variantData?.businessId?.id || null,
        };
      });
      setVariants(allVariants);
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  const getItems = async () => {
    try {
      const itemsQuery = query(collection(db, moduleName, elementId, 'items'));
      const querySnapshot = await getDocs(itemsQuery);

      const allItems = querySnapshot?.docs?.map((doc) => {
        const itemData = doc.data();
        return {
          id: doc?.id,
          ...itemData,
          ownerId: itemData?.businessId?.id || null,
          businessRef: itemData?.businessId?.id || null,
        };
      });
      setItems(allItems);
    } catch (error) {
      console.error('Error getting items: ', error);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === 'items' || type === 'variants') {
        await nodeAxiosFirebase({
          t,
          method: 'DELETE',
          url: `coreSeqV2/variants`,
          body: {
            elementId: elementId,
            variantId: id,
            type: moduleName,
            subType: type,
          },
        });
      } else {
        const newOptions = options.filter((option) => option?.id !== id);

        const newOptionsToSend = newOptions.map((option) => {
          return {
            ...option,
            price: option?.price / 10000,
          };
        });

        await nodeAxiosFirebase({
          t,
          method: 'PATCH',
          url: `coreSeqV2/variants`,
          body: {
            elementId: elementId,
            type: moduleName,
            newOptions: newOptionsToSend,
          },
        });
      }
    } catch (error) {
      console.error('Error deleting documents: ', error);
    }
  };

  const addOptions = () => {
    setAction('add');
    setCurrentType('option');
    setDialogOpen(true);
    setFieldsToDisplay(['name', 'price', 'group', 'tax1', 'tax2']);
    setSelectedElement(['name', 'price', 'group', 'tax1', 'tax2']);
  };

  const addVariants = () => {
    setAction('add');
    setCurrentType('variant');
    setDialogOpen(true);
    setFieldsToDisplay([
      'name',
      'elementId',
      'attribute1',
      'attribute2',
      'attribute3',
    ]);
    setSelectedElement([
      'name',
      'elementId',
      'attribute1',
      'attribute2',
      'attribute3',
    ]);
  };

  const addItems = () => {
    setAction('add');
    setCurrentType('item');
    setDialogOpen(true);
    setFieldsToDisplay(['name', 'elementId', 'quantity']);
    setSelectedElement(['name', 'elementId', 'quantity']);
  };

  const handleEdit = (typeOpt, id) => {
    setAction('edit');
    setCurrentType(typeOpt);
    let selectedObj;

    if (typeOpt === 'option') {
      selectedObj = options.find((option) => option.id === id);
      setFieldsToDisplay(['name', 'price', 'tax1', 'tax2']);
    } else {
      selectedObj = items.find((item) => item.id === id);
      setFieldsToDisplay(['quantity']);
    }

    setSelectedElement({
      ...selectedObj,
      price: selectedObj?.price / 10000,
    });
    setFieldValues({
      ...selectedObj,
      price: selectedObj?.price / 10000,
    });
    setDialogOpen(true);
  };

  // Step 3: Handling input changes
  const handleFieldChange = (fieldName, value) => {
    setSelectedElement((prevValues) => ({ ...prevValues, [fieldName]: value }));
    setFieldValues((prevValues) => ({ ...prevValues, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    if (action === 'add') {
      if (currentType === 'option') {
        const newFormattedOption = {
          name: fieldValues?.name,
          price: parseFloat(fieldValues?.price),
          group: fieldValues?.group || '',
          tax1: fieldValues?.tax1 || false,
          tax2: fieldValues?.tax2 || false,
          optionId: getRandomString(6),
          id: getRandomString(6),
        };

        const optionsToSend = options.map((option) => {
          return {
            ...option,
            price: option?.price / 10000,
          };
        });

        const newOptions = [...optionsToSend, newFormattedOption];
        await nodeAxiosFirebase({
          t,
          method: 'PATCH',
          url: `coreSeqV2/variants`,
          body: {
            elementId: elementId,
            type: moduleName,
            newOptions: newOptions,
          },
        });
      } else if (currentType === 'item') {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `coreSeqV2/variants`,
          body: {
            genericId: elementId,
            type: moduleName,
            subType: 'items',
            quantity: fieldValues?.quantity,
            articleId: fieldValues?.id,
            fromType: parentElementCollection,
          },
        });
      } else {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `coreSeqV2/variants`,
          body: {
            genericId: elementId,
            type: moduleName,
            subType: 'variants',
            fromType: parentElementCollection,
            quantity: fieldValues?.quantity,
            articleId: fieldValues?.id,
            attributes: {
              attribute1: fieldValues?.attribute1,
              attribute2: fieldValues?.attribute2,
              attribute3: fieldValues?.attribute3,
            },
          },
        });
      }
    } else {
      if (currentType === 'option') {
        const newUpdatedOption = {
          name: fieldValues?.name,
          price: fieldValues?.price,
          tax1: fieldValues?.tax1 || false,
          group: fieldValues?.group || '',
          tax2: fieldValues?.tax2 || false,
          optionId: fieldValues?.optionId,
          id: fieldValues?.id,
        };

        const newOptions = options.map((option) =>
          option.id === fieldValues?.id
            ? newUpdatedOption
            : {
                ...option,
                price: option?.price / 10000,
              }
        );
        await nodeAxiosFirebase({
          t,
          method: 'PATCH',
          url: `coreSeqV2/variants`,
          body: {
            elementId: elementId,
            type: moduleName,
            newOptions: newOptions,
          },
        });
      }
    }
    setCurrentType(null);
    setFieldValues({});
    setFieldsToDisplay([]);
    setDialogOpen(false);
  };

  useEffect(() => {
    const optionsGroup = options?.reduce((acc, option) => {
      if (!acc[option?.group]) {
        acc[option?.group] = [];
      }
      acc[option?.group].push(option);

      return acc;
    }, {});

    setOptionsByGroup(optionsGroup);

    const groups = options?.map((option) => option?.group);
    const uniqueGroups = [...new Set(groups)];
    const formattedListGroups = uniqueGroups?.map((group) => ({
      label: group,
      value: group,
      subLabel: '',
      id: group,
    }));
    setListOfGroups(formattedListGroups);
  }, [options]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentType(null);
    setFieldValues({});
    setFieldsToDisplay([]);
  };

  return (
    <ErrorBoundary>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{t(currentType)}</DialogTitle>
        <DialogContent sx={{ minWidth: '500px' }}>
          {fieldsToDisplay?.map((field) =>
            field === 'tax1' || field === 'tax2' ? (
              <Checkbox
                key={field}
                value={selectedElement[field]}
                onChange={(e) => handleFieldChange(field, e.target.checked)}
                label={t(field)}
              />
            ) : field === 'elementId' ? (
              <Search
                key={field}
                fieldKey={field}
                required={true}
                label={t(field)}
                value={selectedElement[field] || ''}
                fullWidth
                setSelected={setParentElementCollection}
                fieldType={'search'}
                selections={['business:articles']}
                onChange={handleSearchChange}
              />
            ) : field === 'group' ? (
              <SelectAutoComplete
                key={'group'}
                allowNew
                fieldKey={'group'}
                label={t(field)}
                value={selectedElement['group']}
                selections={listOfGroups}
                fullWidth
                onChange={(e, type, value) => handleFieldChange(field, value)}
              />
            ) : (
              <TextField
                key={field}
                label={t(field)}
                value={selectedElement[field] || ''}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                fullWidth
                margin="dense"
              />
            )
          )}

          <div className="mt-3">
            <Button fullWidth label={t('save')} onClick={handleSubmit} />
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <GeneralText
            text={t('items')}
            fontSize="14px"
            size="bold"
            primary={true}
          />
          <IconButton
            color="primary"
            onClick={addItems}
            style={{ padding: '0px' }}
          >
            <Add fontSize="small" />
          </IconButton>
        </div>
        <List>
          {items?.map((item) => (
            <ListItem divider key={item?.id}>
              <ListItemText sx={{ width: '45%' }}>
                <Typography fontWeight={600} variant="body1" fontSize="12px">
                  {' '}
                  {item?.name}
                </Typography>
                <Typography fontSize="11px" variant="subtitle1">
                  {item?.sku || item?.reference}
                </Typography>
              </ListItemText>

              <ListItemText sx={{ width: '45%' }}>
                <Typography variant="body1" fontSize="12px">
                  {t('qty') + ' ' + item?.quantity}
                </Typography>
              </ListItemText>

              <ListItemButton
                onClick={() => {
                  handleDelete(item?.id, 'items');
                }}
              >
                <DeleteForever />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <div
          className="mt-3 mb-2"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <GeneralText
            text={t('addons')}
            fontSize="14px"
            size="bold"
            primary={true}
          />
          <IconButton
            color="primary"
            onClick={addOptions}
            style={{ padding: '0px' }}
          >
            <Add fontSize="small" />
          </IconButton>
        </div>

        {Object.keys(optionsByGroup).map((group, key) => (
          <Accordion elevation={0} key={key}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={500} fontSize={'12px'}>
                {group || ''}{' '}
                <Badge
                  badgeContent={optionsByGroup[group].length}
                  variant="standard"
                  color="secondary"
                  sx={{ ml: 2, fontSize: '8px', width: '20px' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List sx={{ marginTop: '-20px' }} dense>
                {optionsByGroup[group].map((option) => (
                  <ListItem dense divider key={option?.id}>
                    <ListItemText sx={{ width: '45%' }}>
                      <Typography
                        fontWeight={600}
                        fontSize="12px"
                        variant="body1"
                      >
                        {option?.name}
                      </Typography>
                      <Typography fontSize="11px" variant="subtitle1">
                        {option?.price / 10000 + ' $'}
                      </Typography>
                    </ListItemText>

                    <ListItemText sx={{ width: '45%' }}>
                      <Typography variant="body1" fontSize="12px">
                        {option?.tax1 && t('tax1')} -{' '}
                        {option?.tax2 && t('tax2')}
                      </Typography>
                    </ListItemText>
                    <ListItemButton
                      onClick={() => {
                        handleEdit('option', option?.id);
                      }}
                    >
                      <Edit />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() => {
                        handleDelete(option?.id, 'option');
                      }}
                    >
                      <DeleteForever />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}

        <div
          className="mt-3"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <GeneralText
            text={t('variants')}
            fontSize="14px"
            size="bold"
            primary={true}
          />
          <IconButton
            color="primary"
            onClick={addVariants}
            style={{ padding: '0px' }}
          >
            <Add fontSize="small" />
          </IconButton>
        </div>

        <List>
          {variants?.map((variant) => (
            <ListItem divider key={variant?.id}>
              <ListItemText sx={{ width: '45%' }}>
                <Typography fontWeight={600} variant="body1" fontSize="12px">
                  {variant?.name}
                </Typography>
                <Typography fontSize="11px" variant="subtitle1">
                  {variant?.sku || variant?.reference}
                </Typography>
              </ListItemText>

              <ListItemText sx={{ width: '45%' }}>
                <Typography variant="body1" fontSize="12px">
                  {variant?.attribute1 +
                    ' ' +
                    variant?.attribute2 +
                    ' ' +
                    variant?.attribute3}
                </Typography>
              </ListItemText>
              <ListItemButton
                onClick={() => {
                  handleDelete(variant?.id, 'variants');
                }}
              >
                <DeleteForever />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </ErrorBoundary>
  );
};

export default ItemsVariants;
