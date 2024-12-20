import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { setGeneralStatus } from '../redux/actions-v2/coreAction';

// Components
import ModalHuge from './Base/ModalHuge';
import GeneralText from '../stories/general-components/GeneralText';
import Checkbox from '@mui/material/Checkbox';
import PermDataSettingOutlinedIcon from '@mui/icons-material/PermDataSettingOutlined';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import PublicInvoiceComponent from '../screens/public/PublicInvoiceComponent';
import { FormControlLabel } from '@material-ui/core';

// Main component for displaying the invoice in a modal
const ModalInvoice = ({ isOpen, modalCloseHandler }) => {
  // Set up hooks and Redux states
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const printRef = useRef(null);
  const [includeLogsForms, setIncludeLogsForms] = useState(false);
  const [includeListOfpasses, setIncludeListOfpasses] = useState(false);
  const [includeGroupsTotal, setIncludeGroupsTotal] = useState(false);
  const [includeStorage, setIncludeStorage] = useState(false);
  const [includeLogs, setIncludeLogs] = useState(false);
  const [includeNodies, setIncludeNodies] = useState(false);
  const [includeFiles, setIncludeFiles] = useState(false);
  const [reload, setReload] = useState(true);

  const singleCardDetails = useSelector(
    (state) => state.element.singleElementDetails
  );

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const structures = businessStructure?.structures;

  const handleUpdatePreferences = async (event, key) => {
    const preferenceMap = {
      'preferences.tasks': setIncludeLogsForms,
      'preferences.passes': setIncludeListOfpasses,
      'preferences.groups': setIncludeGroupsTotal,
      'preferences.storages': setIncludeStorage,
      'preferences.logs': setIncludeLogs,
      'preferences.nodies': setIncludeNodies,
      'preferences.files': setIncludeFiles,
    };
    preferenceMap[key](event);

    setReload(true);
    dispatch(
      setGeneralStatus({
        status: 'loading',
        position: 'modal-invoice-preferences',
        type: 'pulse',
      })
    );
    await nodeAxiosFirebase({
      t,
      method: 'PATCH',
      url: `coreSeqV2`,
      body: {
        documentId: singleCardDetails?.id,
        elementPath: '/cards',
        key: key,
        value: event,
      },
    });
    dispatch(
      setGeneralStatus({
        status: 'success',
        position: 'modal-invoice-preferences',
        type: 'pulse',
      })
    );
  };

  useEffect(() => {
    if (singleCardDetails?.preferences) {
      setIncludeLogsForms(singleCardDetails.preferences.tasks || false);
      setIncludeListOfpasses(singleCardDetails.preferences.passes || false);
      setIncludeGroupsTotal(singleCardDetails.preferences.groups || false);
      setIncludeStorage(singleCardDetails.preferences.storages || false);
      setIncludeLogs(singleCardDetails.preferences.logs || false);
      setIncludeNodies(singleCardDetails.preferences.nodies || false);
      setIncludeFiles(singleCardDetails.preferences.files || false);
    }
  }, [singleCardDetails]);

  // Function to handle print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const passesTerm =
    structures?.find((structure) => structure?.collectionField === 'passes')?.[
      'name'
    ] || t('passes');

  const storagesTerm =
    structures?.find(
      (structure) => structure?.collectionField === 'storages'
    )?.['name'] || t('storages');

  const tasksTerm =
    structures?.find((structure) => structure?.collectionField === 'tasks')?.[
      'name'
    ] || t('tasks');

  const currentStructure = structures?.find(
    (structure) =>
      structure?.collectionField === singleCardDetails?.structureDetails?.name
  );

  // Render component
  return (
    <ModalHuge
      btnOnClick={handlePrint}
      btnLabel={t('print')}
      title={t('print')}
      isOpen={isOpen}
      modalCloseHandler={modalCloseHandler}
    >
      <Helmet>
        <title>
          {currentStructure?.name + ' - #' + singleCardDetails?.searchId}
        </title>
      </Helmet>
      <div className="row">
        <div className="col-3">
          <div className="d-flex mt-2 mb-3">
            <PermDataSettingOutlinedIcon />
            <GeneralText
              text={t('options')}
              fontSize="13px"
              size="bold"
              classNameComponent="mx-3"
              primary={true}
            />
          </div>
          <div className="middle-content mb-1">
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeLogsForms}
                    onChange={(e) =>
                      handleUpdatePreferences(
                        e.target.checked,
                        'preferences.tasks'
                      )
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t('includeList') + ' ' + tasksTerm}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeListOfpasses}
                    onChange={(e) =>
                      handleUpdatePreferences(
                        e.target.checked,
                        'preferences.passes'
                      )
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t('includeList') + ' ' + passesTerm}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeGroupsTotal}
                    onChange={(e) =>
                      handleUpdatePreferences(
                        e.target.checked,
                        'preferences.groups'
                      )
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t('includeGroupsTotal')}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeStorage}
                    onChange={(e) =>
                      handleUpdatePreferences(
                        e.target.checked,
                        'preferences.storages'
                      )
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t('includeList') + ' ' + storagesTerm}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeLogs}
                    onChange={(e) =>
                      handleUpdatePreferences(
                        e.target.checked,
                        'preferences.logs'
                      )
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t('includeLogs')}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeNodies}
                    onChange={(e) =>
                      handleUpdatePreferences(
                        e.target.checked,
                        'preferences.nodies'
                      )
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t('includeNodies')}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeFiles}
                    onChange={(e) =>
                      handleUpdatePreferences(
                        e.target.checked,
                        'preferences.files'
                      )
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t('includeFiles')}
              />
            </div>
          </div>
        </div>
        <div className="col-8">
          <div>
            <PublicInvoiceComponent
              fromBusiness={true}
              accessCode={singleCardDetails?.accessCode}
              setReload={setReload}
              reload={reload}
              printRef={printRef}
            />
          </div>
        </div>
      </div>
    </ModalHuge>
  );
};

export default ModalInvoice;
