import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import chroma from 'chroma-js';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import Button from '../general-components/Button';
import FieldComponent from '../../components/@generalComponents/FieldComponent';
import GeneralText from '../general-components/GeneralText';
import { toast } from 'react-toastify';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';
import { useDispatch } from 'react-redux';
import Avatar from '../general-components/Avatar';

const ContentLayout = ({ elementDetails, blockWith, layout, fontColor }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(null);
  const [value, setValue] = useState(null);
  const [type, setType] = useState(null);
  const [label, setLabel] = useState('');
  const [selections, setSelections] = useState([]);
  const [elementData, setElementData] = useState(null);
  const [currentMetric, setCurrentMetric] = useState(null);

  const businessPreference = useSelector((state) => state.core.businessData);

  const mainColor = businessPreference?.mainColor || '#000000';

  useEffect(() => {
    setElementData(elementDetails?.data);
    setCurrentMetric(singleElement?.targetProfileDetails?.metric);
  }, [elementDetails]);

  const updateField = (
    fieldKey,
    value,
    label,
    type,
    selections,
    action,
    item
  ) => {
    if (action === 'edit') {
      if (
        fieldKey === 'targetIdentifiant' ||
        fieldKey === 'targetId' ||
        fieldKey === 'id' ||
        fieldKey === 'documentPath' ||
        fieldKey === 'documentId' ||
        fieldKey === 'structureId' ||
        fieldKey === 'structureIdentifiant' ||
        fieldKey === 'values' ||
        fieldKey === 'assignedToId' ||
        fieldKey === 'locationId' ||
        fieldKey === 'nodes' ||
        fieldKey === 'financesAmount' ||
        fieldKey === 'height' ||
        fieldKey === 'label' ||
        fieldKey === 'width' ||
        fieldKey === 'finances.total' ||
        fieldKey === 'valueColor' ||
        fieldKey === 'value' ||
        fieldKey === 'isRequired' ||
        fieldKey === 'finances.subtotal' ||
        fieldKey === 'finances.tax1' ||
        fieldKey === 'finances.tax2' ||
        fieldKey === 'financesTotal' ||
        fieldKey === 'financesSubtotal' ||
        fieldKey === 'financesTax1' ||
        fieldKey === 'financesTax2' ||
        fieldKey === 'by' ||
        fieldKey === 'financesTax3' ||
        fieldKey === 'targetName' ||
        fieldKey === 'targetProfileName' ||
        fieldKey === 'dependencyName' ||
        fieldKey === 'targetAddress' ||
        fieldKey === 'timeStamp' ||
        fieldKey === 'children' ||
        fieldKey === 'targetProfileId' ||
        fieldKey === 'lastUpdate' ||
        fieldKey === 'attribute1' ||
        fieldKey === 'attribute2' ||
        fieldKey === 'attribute3'
      ) {
        return;
      }
      setKey(fieldKey);
      setValue(value);
      setLabel(label);
      setType(type);
      setSelections(selections);
      setIsOpen(true);
    } else if (action === 'navigate') {
      navigate(
        '/app/element/' +
          item[0]?.collectionField +
          '/' +
          item[0]?.structureId +
          '/' +
          item[0]?.primaryData?.elementId
      );
    } else if (action === 'copy') {
      navigator.clipboard.writeText(value);
      toast.success(t('copied'));
    } else if (action === 'none') {
      return;
    }
  };

  const handleFieldChange = (fieldKey, value, fieldId) => {
    let convertedValue = value;

    const index = elementData?.findIndex(
      (element) => element?.structureValue === fieldKey
    );

    setElementData((prevState) => {
      const updatedData = [...prevState];

      if (updatedData[index]) {
        updatedData[index].value = convertedValue;
      }

      return updatedData;
    });
    setValue(value);
    setKey(fieldKey);
  };

  const handleSave = async (providedKey, providedValue) => {
    setIsOpen(false);

    let formattedPath = elementDetails?.elementData?.documentPath.split('/');
    formattedPath = formattedPath
      .filter((part) => part !== elementDetails?.elementData?.id)
      .join('/');

    let forattedKey = key || providedKey;
    //if value start with data. remove it
    if (key?.startsWith('data.')) {
      forattedKey = key?.replace('data.', '');
    }

    try {
      dispatch(setGeneralStatus({ status: 'loading' }));
      if (
        forattedKey === 'metric' ||
        forattedKey === 'odometer' ||
        forattedKey === 'data.odometer'
      ) {
        let profilePath =
          elementDetails?.elementData?.targetProfilePath?.split('/');
        profilePath = profilePath
          .filter(
            (part) => part !== elementDetails?.elementData?.targetProfileId
          )
          .join('/');

        await nodeAxiosFirebase({
          t,
          method: 'PATCH',
          url: `coreSeqV2`,
          body: {
            documentId: elementDetails?.elementData?.targetProfileId,
            elementPath: profilePath,
            key: forattedKey,
            value: value || providedValue,
          },
        });
        await nodeAxiosFirebase({
          t,
          method: 'PATCH',
          url: `coreSeqV2`,
          body: {
            documentId: elementDetails?.elementData?.id,
            elementPath: formattedPath,
            key: forattedKey,
            value: value || providedValue,
          },
        });
      } else {
        await nodeAxiosFirebase({
          t,
          method: 'PATCH',
          url: `coreSeqV2`,
          body: {
            documentId: elementDetails?.elementData?.id,
            elementPath: formattedPath,
            key: forattedKey,
            value: value ?? providedValue,
          },
        });
      }
      dispatch(setGeneralStatus({ status: 'success' }));
    } catch (error) {
      console.error('Error updating field ');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
    setKey(null);
    setValue(null);
  };

  const singleElement = useSelector(
    (state) => state.element.singleElementDetails
  );

  const handleFieldChangeMetric = (fieldId, fieldValue) => {
    setCurrentMetric(fieldValue);
  };

  const getStatusColor = (count) => {
    const intensity = count / 10;
    return chroma.mix('grey', mainColor, intensity).hex();
  };

  return (
    <ErrorBoundary>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>{t('updateField')}</DialogTitle>
        <DialogContent>
          <div style={{ minWidth: '400px' }}>
            <FieldComponent
              key={key?.startsWith('data.') ? key?.replace('data.', '') : key}
              field={{
                typeData: type || 'string',
                label: label,
                name: label,
                selections: selections,
                value: key?.startsWith('data.')
                  ? key?.replace('data.', '')
                  : key,
              }}
              value={value}
              onChange={handleFieldChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="align-c p-2">
            <Button
              label={t('save')}
              onClick={handleSave}
              primary={true}
              fullWidth
              size="small"
            />{' '}
          </div>
        </DialogActions>
      </Dialog>

      <div
        className={elementData?.length === 1 ? 'middle-content' : ''}
        style={{ overflowX: 'hidden', marginTop: '-10px' }}
      >
        {elementData &&
          elementData?.map((element, index) => {
            return (
              <div key={index} className="mt-3">
                {element?.fieldType === 'field' ? (
                  <>
                    {element?.structureValue === 'metric' ? (
                      <FieldComponent
                        key={'metric' + element?.structureValue}
                        field={{
                          typeData: element?.typeValue,
                          label: element?.label,
                          name: element?.label,
                          selections: element?.selections,
                          value: element?.structureValue,
                        }}
                        defaultValue={element?.structureValue}
                        value={currentMetric || ''}
                        onChange={handleFieldChangeMetric}
                        handleSave={handleSave}
                      />
                    ) : (
                      <FieldComponent
                        key={element?.structureValue}
                        field={{
                          typeData: element?.typeValue,
                          label: element?.label,
                          name: element?.label,
                          selections: element?.selections,
                          value: element?.structureValue,
                        }}
                        defaultValue={element?.structureValue}
                        value={element?.value || ''}
                        onChange={(field, value) =>
                          handleFieldChange(field, value, index)
                        }
                        handleSave={handleSave}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {element?.typeValue === 'custom:statuses' && (
                      <div className="d-flex-3d mb-4">
                        {[0, 1, 2, 3].map((status) => {
                          const statusCount =
                            element?.value?.[`status${status}`] ?? 0;
                          return (
                            <div
                              key={status}
                              style={{
                                backgroundColor: getStatusColor(statusCount),
                                width: '25px',
                              }}
                              className="status-square"
                            >
                              {statusCount}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {(element?.typeValue === 'avatar' ||
                      element?.typeValue === 'media' ||
                      element?.typeValue === 'media-single' ||
                      element?.typeValue === 'media-single-private') && (
                      <Avatar
                        img={element?.value ?? ''}
                        name={element?.name ?? ''}
                        alt={element?.value ?? ''}
                        type={element?.typeValue}
                        label={element?.label}
                        blockWithLabel={blockWith}
                        size={'large'}
                        sx={{
                          maxWidth: `${'50px !important'}`,
                          maxHeight: `${'50px !important'}`,
                          borderRadius: '6px !important',
                          padding: '4px',
                        }}
                      />
                    )}
                    {element?.typeValue !== 'custom:statuses' &&
                      element?.typeValue !== 'avatar' &&
                      element?.typeValue !== 'media' &&
                      element?.typeValue !== 'media-single' &&
                      element?.typeValue !== 'media-single-private' && (
                        <GeneralText
                          primary={
                            element?.valueColor === 'primary' ? true : false
                          }
                          layout={layout}
                          size={element?.weight || 'regular'}
                          fontSize={
                            layout?.data?.length > 1
                              ? element?.size + 'px' || '12px'
                              : (element?.transformedValue || element?.value)
                                  ?.length < 10
                              ? '18px'
                              : element?.size + 'px' || '12px'
                          }
                          label={
                            layout?.header?.labels
                              ? element?.showLabel && element?.label
                              : '' || ''
                          }
                          structureId={element?.structureId}
                          color={
                            layout?.data?.length > 1
                              ? element?.valueColor
                              : fontColor || element?.valueColor
                          }
                          text={
                            element?.transformedValue || element?.value || '-'
                          }
                          type={element?.typeValue}
                          classNameComponent={
                            element?.action === 'none' ? '' : 'hover'
                          }
                          keyStructure={element?.structureValue}
                          action={element?.action}
                          onClick={() =>
                            updateField(
                              element?.structureValue,
                              element?.value,
                              element?.label,
                              element?.typeValue,
                              element?.selections,
                              element?.action,
                              [
                                {
                                  collectionField: element?.collectionField,
                                  structureId: element?.structureId,
                                  primaryData: elementDetails?.elementData,
                                },
                              ]
                            )
                          }
                        />
                      )}
                  </>
                )}
              </div>
            );
          })}
      </div>
    </ErrorBoundary>
  );
};

export default ContentLayout;
