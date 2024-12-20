import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MessagesFeed from '../../components/@generalComponents/MessagesFeed';
import CardMainPanel from '../layout-components/templates/CardMainPanel';
import QuickNote from '../../components/@generalComponents/QuickNote';
import { useParams } from 'react-router';
import FieldComponent from '../../components/@generalComponents/FieldComponent';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { toast } from 'react-toastify';
import CardItemsList from '../layout-components/templates/CardItemsList';
import ActionBtn from '../layout-components/templates/ActionBtn';
import ActionBtnDone from '../layout-components/templates/ActionBtnDone';
import ScheduleLocations from '../layout-components/templates/ScheduleLocations';
import Calendar from '../layout-components/templates/Calendar';
import Files from '../layout-components/templates/Files';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';
import NodePackages from '../layout-components/templates/NodePackages';
import ItemsVariants from '../layout-components/templates/ItemsVariants';
import PCOActions from '../layout-components/templates/PCOActions';
import VlnOrder from '../layout-components/templates/VlnOrder';
import MapGeo from '../layout-components/templates/MapGeo';
import PublicInvoiceComponent from '../../screens/public/PublicInvoiceComponent';
import StatusesEvolution from '../layout-components/templates/StatusesEvolution';
import Summary from '../layout-components/templates/Summary';

const ActionLayout = ({
  elementDetails,
  heightPercentage,
  handleAddItem,
  structureData,
  fromList,
  layout,
  componentData,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { cardId, elementId, moduleName } = useParams();

  const [data, setData] = useState({});

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessStructures = businessStructure?.structures;
  const structure = businessStructures?.find(
    (s) => s.id === elementDetails?.elementData?.structureId
  );

  const structureFields = structureData?.fields;

  const elementData = elementDetails?.elementData;

  useEffect(() => {
    setData(elementDetails?.data || elementData);
  }, [elementData, cardId, elementId, elementDetails?.elementData]);

  const handleFieldChange = (fieldId, value) => {
    let convertedValue;
    convertedValue = value;

    setData((prevState) => ({ ...prevState, [fieldId]: convertedValue }));
  };

  const handleSave = async (key, value) => {
    if ((elementData?.documentPath, elementData?.id, key, value)) {
      let formatedPath = elementData?.documentPath.split('/');
      formatedPath = formatedPath
        .filter((part) => part !== elementData?.id)
        .join('/');

      try {
        dispatch(setGeneralStatus({ status: 'loading' }));
        if (key && value !== undefined && value !== null) {
          await nodeAxiosFirebase({
            t,
            method: 'PATCH',
            url: `coreSeqV2`,
            body: {
              documentId: elementData?.id,
              elementPath: formatedPath,
              key: key,
              value: value,
            },
          });
        }
        dispatch(setGeneralStatus({ status: 'success' }));
      } catch (error) {
        console.error('Error updating field ');
        dispatch(setGeneralStatus({ status: 'error', error: error }));
      }
    } else {
      toast.error(t('errorTryToRefreshThePage'));
    }
  };

  const cleanedFields = structureFields?.filter(
    (field) =>
      field?.value !== 'targetId' &&
      field?.value !== 'dependencyId' &&
      field?.value !== 'targetProfileId' &&
      field?.value !== 'name'
  );

  function componentResolver(component) {
    switch (component) {
      case 'logFeed':
        return (
          <MessagesFeed
            elementId={elementData?.id}
            elementType={moduleName || 'cards'}
            userId={elementData?.targetId}
            heightPercentage={heightPercentage - 40}
            elementPath={elementData?.documentPath}
            fromList={fromList}
          />
        );
      case 'quickNote':
        return (
          <QuickNote
            elementPath={elementData?.documentPath}
            elementDetails={elementData?.note}
            handleSave={handleSave}
            fromList={fromList}
          />
        );
      case 'variants':
        return (
          <ItemsVariants
            elementDetails={elementDetails}
            elementData={elementData}
            handleSave={handleSave}
          />
        );
      case 'pcoActions':
        return (
          <PCOActions elementDetails={elementDetails} structure={structure} />
        );
      case 'vlnOrder':
        return (
          <VlnOrder elementDetails={elementDetails} structure={structure} />
        );
      case 'summary':
        return (
          <Summary elementDetails={elementDetails} structure={structure} />
        );
      case 'mainCardItems':
        return (
          <CardMainPanel
            isTablet={isTablet}
            cardIden={data?.id}
            handleAddItem={handleAddItem}
          />
        );
      case 'nodePackages':
        return <NodePackages elementDetails={elementDetails} />;
      case 'secCardItems':
        return (
          <CardItemsList
            isTablet={isTablet}
            heightPercentage={heightPercentage / 2}
            cardIden={data?.id}
            layout={layout}
            handleAddItem={handleAddItem}
          />
        );
      case 'contentForm':
        return (
          <div className="p-3">
            {cleanedFields?.map((field) => {
              if (!field) return null;
              const fieldValue =
                data?.[field?.value] || data?.data?.[field?.value];
              return (
                <FieldComponent
                  key={field?.value}
                  field={field}
                  defaultValue={field?.defaultValue}
                  value={fieldValue || ''}
                  onChange={handleFieldChange}
                  handleSave={handleSave}
                  fromList={fromList}
                />
              );
            })}
          </div>
        );
      case 'actionBtn':
        return (
          <ActionBtn
            elementDetails={elementDetails}
            structure={structure}
            fromList={fromList}
            componentData={componentData}
          />
        );
      case 'map':
        return (
          <MapGeo
            elementDetails={elementDetails}
            structure={structure}
            fromList={fromList}
          />
        );
      case 'files':
        return <Files elementDetails={elementDetails} structure={structure} />;
      case 'scheduleLocation':
        return (
          <ScheduleLocations
            elementDetails={elementDetails}
            structure={structure}
          />
        );

      case 'statusesEvolution':
        return (
          <StatusesEvolution
            elementDetails={elementDetails}
            structure={structure}
            componentData={componentData}
          />
        );

      case 'calendarActions':
        return (
          <Calendar elementDetails={elementDetails} structure={structure} />
        );
      case 'actionBtnDone':
        return (
          <ActionBtnDone
            elementDetails={elementDetails}
            structure={structure}
            componentData={componentData}
          />
        );
      case 'cardDetails':
        return (
          <PublicInvoiceComponent
            elementDetails={elementDetails}
            structure={structure}
          />
        );
      default:
        return null;
    }
  }

  return (
    <ErrorBoundary>
      <div style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
        <div>{componentResolver(elementDetails?.type)}</div>
      </div>
    </ErrorBoundary>
  );
};

export default ActionLayout;
