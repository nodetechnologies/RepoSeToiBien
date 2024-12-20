import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  FormControl,
  InputLabel,
  TextField,
  ListItem,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import { db } from '../../firebase';
import {
  collection,
  query,
  onSnapshot,
  where,
  doc,
  getDocs,
} from 'firebase/firestore';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const filter = createFilterOptions();

export const SelectAutoComplete = ({
  parentElementPath,
  label,
  fieldKey,
  fieldType,
  value,
  creationTargetId,
  onChange,
  allowNew,
  moreDetails,
  error,
  selections,
  required,
  size,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentlangCode = i18n.language;

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessStructures = businessStructure?.structures;
  const businessId = businessPreference?.id;
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';

  const [selectionsOptions, setSelectionsOptions] = useState(selections || []);
  const [selectedValue, setSelectedValue] = useState(value || null);
  const [data, setData] = useState([]);

  const parentElementPathArray =
    typeof parentElementPath === 'string' && parentElementPath?.split('/');

  const parentElementPathEnd =
    typeof parentElementPath === 'string' && parentElementPathArray?.pop();
  const isBusinessId = parentElementPathEnd === businessId;

  const getDocuments = async () => {
    const collectionFieldQuery =
      'users/' +
      creationTargetId +
      '/connections/' +
      creationTargetId +
      businessId +
      '/profiles';

    const targetRef = doc(db, 'users', creationTargetId);
    const businessRef = doc(db, 'businessesOnNode', businessId);

    const q = query(
      collection(db, collectionFieldQuery),
      where('targetId', '==', targetRef),
      where('ownerId', '==', businessRef)
    );

    try {
      // Retrieve the documents once
      const querySnapshot = await getDocs(q);

      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          label:
            doc.data().attribute1 +
            ' ' +
            doc.data().attribute2 +
            ' ' +
            doc.data().attribute3,
          subLabel: doc.data().name,
          value: doc.id || doc?.documentIdentifiant,
          structureId: doc.data().structureId?.id || '',
          targetId: doc.data().targetId?.id || '',
          ownerId: doc.data().ownerId?.id || '',
          dependencyId: doc.data().dependencyId?.id || '',
        });
      });

      setSelectionsOptions(data);
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  useEffect(() => {
    if (isBusinessId) {
      setSelectionsOptions(
        businessPreference?.profiles?.map((option) => {
          return {
            label:
              (option?.attribute1 || '') +
              ' ' +
              (option?.attribute2 || '') +
              ' ' +
              (option?.attribute3 || ''),
            subLabel: option?.name || '',
            value: option?.id || option?.documentIdentifiant,
          };
        })
      );
    } else if (fieldKey && parentElementPath && parentElementPathEnd) {
      getDocuments();
    }
  }, [parentElementPath]);

  const getDocumentsSub = async (newValueId) => {
    try {
      dispatch(setGeneralStatus({ status: 'loading' }));
      const queryPath =
        'users/' +
        creationTargetId +
        '/connections/' +
        creationTargetId +
        businessId +
        '/profiles/' +
        newValueId;
      const flattenedDetails = Object.values(moreDetails).flat();
      const elementData = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreMulti/specific`,
        errorToast: t('errorLoadingDocument'),
        body: {
          structureIds: flattenedDetails,
          lang: currentlangCode,
          filter: fieldKey,
          filterCondition: '==',
          filterValue: queryPath,
        },
      });
      setData(elementData?.hits);
      dispatch(setGeneralStatus({ status: 'success' }));
    } catch (error) {
      console.error('Error fetching data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const onSelectionChange = (event, fieldType, newValueId, type) => {
    onChange(event, fieldType, newValueId, type);
    setSelectedValue(newValueId);
    setTimeout(() => {
      getDocumentsSub(newValueId);
    }, 800);
  };

  useEffect(() => {
    if (!selections) {
      setSelectionsOptions([]);
      setSelectedValue(null);
    }
    setData({});
  }, [parentElementPath, creationTargetId]);

  const resolveStructureName = (structureId) => {
    const structure = businessStructures?.find((s) => s.id === structureId);
    return structure?.name || '';
  };

  return (
    <div className="middle-content">
      <div className={'col-12'}>
        <FormControl fullWidth margin="normal">
          <InputLabel
            shrink={true}
            required={required || false}
            error={error}
            sx={{
              backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '',
              padding: '2px 10px 2px 10px',
              borderRadius: '10px',
            }}
          >
            {label}
          </InputLabel>
          <Autocomplete
            options={selectionsOptions}
            disabled={!parentElementPath && !selections}
            error={error}
            key={fieldKey + creationTargetId}
            noOptionsText={t('noOption')}
            getOptionLabel={(option) =>
              `${
                option?.label ||
                selectionsOptions?.find((opt) => opt?.value === selectedValue)
                  ?.label ||
                '-'
              }`
            }
            value={value}
            onChange={(event, newValue) => {
              if (newValue) {
                onSelectionChange(event, fieldType, newValue.id, 'profiles');
              }
            }}
            freeSolo={allowNew}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) => inputValue === option.title
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  value: inputValue,
                  label: `${t('new')} : ${inputValue}`,
                  id: inputValue,
                });
              }

              return filtered;
            }}
            selectOnFocus={allowNew}
            clearOnBlur={allowNew}
            handleHomeEndKeys={allowNew}
            renderOption={(props, option) => (
              <Box
                sx={{
                  height: '41px',
                  textAlign: 'left',
                  position: 'relative',
                  zIndex: 1000,
                }}
                {...props}
              >
                <Box sx={{ height: '41px', textAlign: 'left' }}>
                  <Typography textAlign="left">
                    {option?.[`label_${currentlangCode}`] || option?.label}
                  </Typography>
                  <Typography
                    textAlign="left"
                    variant="caption"
                    color="textSecondary"
                    sx={{ textAlign: 'left', marginTop: '-5px' }}
                  >
                    {option?.subLabel || ''}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                error={error}
                disabled={!parentElementPath}
                sx={{
                  'MuiFormControl-root': {
                    width: '100%',
                  },
                  '.MuiInputBase-input': {
                    height: '12px',
                    fontSize: size === 'small' ? '11px' : '13px',
                  },
                  '& .MuiFormLabel-root': {
                    backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
                    borderRadius: '10px',
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&.Mui-focused fieldset': {
                      borderColor: businessPreference?.mainColor || '#000',
                      boxShadow: `0 0 0 0.2rem ${
                        businessPreference?.mainColor + '20'
                      }`,
                    },
                  },
                }}
              />
            )}
          />
        </FormControl>
      </div>
      {Object.keys(data).map((structureId) => (
        <Accordion elevation={0} key={structureId}>
          <AccordionSummary
            sx={{ height: '30px', maxHeight: '30px', margin: 0, padding: 0 }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography
              variant="body1"
              fontSize={'12px'}
              style={{ paddingLeft: '10px', paddingRight: '10px' }}
            >
              {resolveStructureName(structureId)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Array.isArray(data[structureId]) ? (
              data[structureId].map((detail, index) => (
                <ListItem dense divider>
                  <ListItemText
                    primary={detail?.name}
                    primaryTypographyProps={{
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                    secondary={moment
                      .unix(detail?.lastUpdate?._seconds)
                      .format('DD MMM YYYY')}
                    secondaryTypographyProps={{
                      fontSize: '10px',
                      fontWeight: 400,
                    }}
                  />
                  <ListItemText
                    primary={
                      (detail?.attribute1 || '') +
                      ' ' +
                      (detail?.attribute2 || '')
                    }
                    primaryTypographyProps={{
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                    secondary={
                      (detail?.attribute3 || '') +
                      ' ' +
                      (detail?.attribute4 || '')
                    }
                    secondaryTypographyProps={{
                      fontSize: '10px',
                      fontWeight: 400,
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                {t('noData')}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default SelectAutoComplete;
