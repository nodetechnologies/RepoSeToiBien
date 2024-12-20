import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import { setGeneralStatus } from '../redux/actions-v2/coreAction';

// Components
import ModalHuge from './Base/ModalHuge';
import moment from 'moment';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import GeneralText from '../stories/general-components/GeneralText';
import Checkbox from '@mui/material/Checkbox';
import PermDataSettingOutlinedIcon from '@mui/icons-material/PermDataSettingOutlined';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import { FormControlLabel } from '@material-ui/core';
import BusinessInformationTag from '../components/@generalComponents/BusinessInformationTag';
import CardInformationTag from '../components/@generalComponents/CardInformationTag';
import CardClientInformation from '../components/finances/invoice/CardClientInformation';

// Main component for displaying the invoice in a modal
const ModalContact = ({ isOpen, modalCloseHandler }) => {
  // Set up hooks and Redux states
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const printRef = useRef(null);
  const [includeStatement, setIncludeStatement] = useState(false);
  const [reload, setReload] = useState(true);
  const [elementData, setElementData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const singleElement = useSelector(
    (state) => state.element.singleElementDetails
  );

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const element = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `public/element`,
        noAuth: true,
        body: {
          documentPath: singleElement?.documentPath,
          elementId: singleElement?.id,
          fromBusiness: true,
          accessCode: singleElement?.accessCode || '000000',
          lang: i18n.language,
        },
        reduxDispatcher: dispatch,
        loadingMessage: `${t('getting')}`,
      });
      setLogs(element?.logs);
      setElementData(element);
      setIsLoading(false);
      setReload(false);
    } catch (error) {
      console.error('Error getting document');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  useEffect(() => {
    if (reload && singleElement?.id) {
      getDetails();
    }
  }, [reload, singleElement?.id]);

  const handleUpdatePreferences = async (event, key) => {
    const preferenceMap = {
      'preferences.statement': setIncludeStatement,
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
    const pathWithoutId = singleElement?.documentPath.split(
      singleElement?.id
    )[0];
    await nodeAxiosFirebase({
      t,
      method: 'PATCH',
      url: `coreSeqV2`,
      body: {
        documentId: singleElement?.id,
        elementPath: pathWithoutId,
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
    if (singleElement?.preferences) {
      setIncludeStatement(singleElement.preferences.statement || false);
    }
  }, [singleElement]);

  // Function to handle print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // Function to render the statement table
  const renderStatementTable = () => {
    const statementItems = elementData?.items || [];
    let cumulativeBalance = 0;

    return (
      <TableContainer elevation={0} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('date')}</TableCell>
              <TableCell>{t('description')}</TableCell>
              <TableCell>{t('amount')}</TableCell>
              <TableCell>{t('cumulativeBalance')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statementItems.map((item, index) => {
              const amount = item.total / 10000 || 0; // Assuming amount in item is in cents
              cumulativeBalance += item?.type === 'payment' ? amount : -amount;

              return (
                <TableRow key={index}>
                  <TableCell>
                    {moment
                      .unix(item.date?._seconds || item?.date?.seconds)
                      .format('DD MMM YYYY')}
                  </TableCell>
                  <TableCell>
                    <div>{item?.name || t(item?.type)}</div>
                    <div className="fs-11 grey-text">{'# ' + item?.id}</div>
                  </TableCell>
                  <TableCell>{amount?.toFixed(2) + ' $'}</TableCell>
                  <TableCell>{cumulativeBalance.toFixed(2) + ' $'}</TableCell>
                </TableRow>
              );
            })}
            <TableRow key={'total'}>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                {(elementData?.balance / 10000)?.toFixed(2) + ' $'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render component
  return (
    <ModalHuge
      btnOnClick={handlePrint}
      btnLabel={t('print')}
      title={t('print')}
      isOpen={isOpen}
      modalCloseHandler={modalCloseHandler}
    >
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
                    checked={includeStatement}
                    onChange={(e) =>
                      handleUpdatePreferences(
                        e.target.checked,
                        'preferences.statement'
                      )
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t('includeStatement')}
              />
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="invoice-content" id="print-area" ref={printRef}>
            <div className="row mb-1 mt-3 px-4">
              <div className="col-md-6 col-6 mt-2 ">
                <BusinessInformationTag
                  businessData={elementData?.businessData}
                />
              </div>
              <div className="col-md-6 col-6 mt-2 align--right">
                <CardInformationTag
                  card={elementData}
                  langCode={i18n.language || 'fr'}
                />
              </div>
            </div>
            <div className="mt-2 mb-1 px-4 align-left">
              <CardClientInformation elementData={elementData} />
            </div>
            <div className="px-4">
              {elementData?.note &&
                elementData?.businessData?.view !== 'tabs-default' && (
                  <>
                    <p className="fs-11 fw-600">{t('details')}</p>
                    <p style={{ marginTop: '-6px' }} className="fs-10">
                      {elementData?.note}
                    </p>
                  </>
                )}
            </div>
            <div> {renderStatementTable()}</div>
          </div>
        </div>
      </div>
    </ModalHuge>
  );
};

export default ModalContact;
