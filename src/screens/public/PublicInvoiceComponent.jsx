import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../../lotties/success.json';
import { useParams } from 'react-router-dom';

//components
import BusinessInformationTag from '../../components/@generalComponents/BusinessInformationTag';
import CardInformationTag from '../../components/@generalComponents/CardInformationTag';
import CardPayments from '../../components/finances/invoice/CardPayments';
import CardClientInformation from '../../components/finances/invoice/CardClientInformation';
import CardItems from '../../components/finances/invoice/CardItems';
import CardPasses from '../../components/finances/invoice/CardPasses';
import GeneralText from '../../stories/general-components/GeneralText';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import CardTasks from '../../components/finances/invoice/CardTasks';
import CardStorages from '../../components/finances/invoice/CardStorages';
import CardNodies from '../../components/finances/invoice/CardNodies';
import CardFiles from '../../components/finances/invoice/CardFiles';
import { Divider, Tabs, Tab } from '@mui/material';
import Button from '../../stories/general-components/Button';
import Checkbox from '../../stories/general-components/Checkbox';
import moment from 'moment/moment';
import TextField from '../../stories/general-components/TextField';
import Loading from '../../stories/general-components/Loading';
import {
  CheckBoxOutlined,
  NoteAltOutlined,
  ReceiptOutlined,
} from '@mui/icons-material';

const PublicInvoiceComponent = ({
  fromBusiness,
  printRef,
  reload,
  setReload,
}) => {
  const componentRef = useRef(null);
  const { elementId } = useParams();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const langCode = i18n.language || 'fr';

  const from = new URLSearchParams(search).get('from');
  const accessCode = new URLSearchParams(search).get('accessCode');
  const accessToken = new URLSearchParams(search).get('accessToken');

  const [cardData, setCardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isLoadingDrawer, setIsLoadingDrawer] = useState(false);
  const [approvedItems, setApprovedItems] = useState([]);
  const [error, setError] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [noteClient, setNoteClient] = useState('');
  const [approved, setApproved] = useState(false);
  const [ccNumber, setCcNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [logMessage, setLogMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [clientSecret, setClientSecret] = useState('');

  const singleCardDetails = useSelector(
    (state) => state.element.singleElementDetails
  );

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const navigateHome = () => {
    window.location.href = '/';
  };

  const getCardDetails = async () => {
    setIsLoading(true);
    try {
      const card = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `public/element`,
        noAuth: true,
        body: {
          cardId: elementId,
          fromBusiness: fromBusiness,
          accessCode: singleCardDetails?.accessCode || accessCode,
          lang: langCode,
        },
        reduxDispatcher: dispatch,
        loadingMessage: `${t('gettingCard')}`,
      });
      setLogs(card?.logs);
      setCardData(card);
      setIsLoading(false);
      setReload(false);
    } catch (error) {
      setError(true);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      if (logMessage) {
        setLogs(
          logs.concat({
            id: logs?.length + 1,
            name: cardData?.targetName,
            description: logMessage,
            timeStamp: new Date(),
          })
        );

        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `addLogPublic`,
          noAuth: true,
          body: {
            cardId: elementId,
            accessCode: accessCode,
            message: logMessage,
          },
          reduxDispatcher: dispatch,
          loadingMessage: `${t('gettingCard')}`,
        });
      }
      setLogMessage('');
    }
  };

  useEffect(() => {
    getCardDetails();
  }, [elementId, reload]);

  return (
    <div ref={printRef}>
      {isLoading && <Loading />}
      {cardData?.businessData?.view === 'tabs-default' && (
        <div
          style={{
            height: '70px',

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          <Tabs value={activeIndex}>
            <Tab
              tabIndex={0}
              icon={<ReceiptOutlined />}
              iconPosition="start"
              label={t('presentation')}
              onClick={() => setActiveIndex(0)}
            />
            <Tab
              tabIndex={1}
              icon={<NoteAltOutlined />}
              iconPosition="start"
              label={t('details')}
              onClick={() => setActiveIndex(1)}
            />
            <Tab
              tabIndex={2}
              icon={<CheckBoxOutlined />}
              iconPosition="start"
              label={t('approval')}
              onClick={() => setActiveIndex(2)}
            />
          </Tabs>
        </div>
      )}
      {activeIndex === 0 && (
        <div className="mt-5 align-left">
          <div className="col-md-6 col-6 mt-2 ">
            <BusinessInformationTag businessData={cardData?.businessData} />
          </div>
          <div
            style={{ maxWidth: '800px', maxHeight: '38vh', overflow: 'scroll' }}
            className="row"
          >
            <GeneralText
              primary={true}
              size="regular"
              fontSize="12px"
              markdown
              text={cardData?.note}
            />
          </div>

          <div style={{ height: '20vh', overflow: 'scroll' }}>
            {logs?.map((log) => (
              <div
                style={{
                  backgroundColor: '#F5F5F5',
                  padding: '5px 10px',
                  borderRadius: '10px',
                }}
                className="row mt-3 mx-1"
                key={log.id}
              >
                <div className="row">
                  <GeneralText
                    primary={true}
                    size="bold"
                    fontSize="12px"
                    text={`${log?.name}`}
                  />
                </div>
                <GeneralText
                  primary={true}
                  size="regular"
                  fontSize="11px"
                  text={log?.description}
                />
                <div className="mt-2">
                  <GeneralText
                    primary={true}
                    size="regular"
                    fontSize="10px"
                    text={moment(log?.timeStamp).format('DD MMM YYYY')}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <TextField
              fullWidth
              label={t('addComment')}
              variant="outlined"
              size="small"
              type="message"
              value={logMessage}
              onChange={(e) => setLogMessage(e.target.value)}
              handleKeyPress={(e) => handleKeyDown(e)}
              sx={{
                '.MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
            />
          </div>
        </div>
      )}

      {activeIndex === 2 && (
        <div
          className="align-c row px-3"
          style={{
            overflowX: 'hidden',
            overflowY: 'scroll',
            maxHeight: '82vh',
          }}
        >
          <div
            style={{
              maxWidth: '700px',
              marginLeft: '50%',
              marginRight: '50%',
            }}
            className="align-c mt-4 mb-3"
          >
            <GeneralText
              primary={true}
              size="bold"
              fontSize="16px"
              text={`${t('approveCard')}`}
              classNameComponent="px-3 mb-3"
            />
          </div>

          {isLoadingDrawer && paymentDone === false ? (
            <div className="f-w align-c">
              <Loading size="small" type="logo" />
            </div>
          ) : cardData?.businessData?.approvalMethod !== 'selection' ? (
            <div
              style={{
                maxWidth: '700px',
                marginLeft: '50%',
                marginRight: '50%',
              }}
            >
              <Checkbox
                label={
                  t('approveMsg') +
                  ' ' +
                  moment().format('DD MMM YYYY HH:mm') +
                  ' ' +
                  t('approveMsgSec') +
                  ' ' +
                  cardData?.finances?.balance?.toFixed(2) +
                  '$ ' +
                  t('approveMsgThird')
                }
                value={approved}
                onChange={(e) => setApproved(e.target.checked)}
                onBlur={(e) => setApproved(e.target.checked)}
              />
              <div>
                <TextField
                  label={t('approveMsgClient')}
                  type="text"
                  multiline
                  onChange={(e) => setNoteClient(e.target.value)}
                  rows={2}
                  variant="outlined"
                  fullWidth
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                maxWidth: '700px',
                marginLeft: '50%',
                marginRight: '50%',
                // marginTop: '80px',
              }}
            >
              <GeneralText
                primary={true}
                size="medium"
                fontSize="13px"
                text={`${t('approveMsgHead')}`}
                classNameComponent="px-2 mb-3"
              />
              <div className="hei-7 mb-3">
                {cardData?.items?.map((item) => (
                  <div className="align-left">
                    <Checkbox
                      label={
                        <div
                          style={{
                            width: '100%',
                            minWidth: '100%',
                            maxWidth: '100%',
                          }}
                          className="justify-content-between row"
                        >
                          <div className="col-10"> {item?.itemData?.name} </div>
                          {/* <div className="col-2 fw-600 align-right px-3 mt-2">
                            {' '}
                            {(item?.itemData?.price / 10000)?.toFixed(2) +
                              '$ '}{' '}
                          </div> */}
                        </div>
                      }
                      value={approvedItems.includes(item?.id)}
                      onChange={(e) =>
                        setApprovedItems(
                          approvedItems.includes(item?.id)
                            ? approvedItems.filter((id) => id !== item?.id)
                            : [...approvedItems, item?.id]
                        )
                      }
                      onBlur={(e) =>
                        setApprovedItems(
                          approvedItems.includes(item?.id)
                            ? approvedItems.filter((id) => id !== item?.id)
                            : [...approvedItems, item?.id]
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <div>
                <TextField
                  label={t('approveMsgClient')}
                  type="text"
                  multiline
                  onChange={(e) => setNoteClient(e.target.value)}
                  rows={2}
                  variant="outlined"
                  fullWidth
                />
              </div>
              {approvedItems.length > 0 && (
                <div className="mt-2">
                  <Button
                    label={t('submitApprove')}
                    primary={true}
                    endIcon={'CheckBoxOutlined'}
                    size="medium"
                  />
                </div>
              )}
            </div>
          )}
          {paymentDone && (
            <Lottie options={defaultOptions} height={120} width={250} />
          )}
        </div>
      )}
      {activeIndex === 1 && (
        <div
          style={{ overflow: 'scroll', height: '90vh', paddingBottom: '40px' }}
          className="mt-4 mb-3 justify-content-between align-left"
        >
          {cardData?.id === elementId && (
            <div>
              {isLoading ? (
                <div>
                  <Loading size="small" type="logo" />
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: '#FFF',
                    color: '#000000',
                  }}
                  className="invoice-content"
                  id="print-area"
                  ref={printRef || componentRef}
                >
                  <div className="row mb-1 mt-3 px-4">
                    <div className="col-md-6 col-6 mt-2 ">
                      <BusinessInformationTag
                        businessData={cardData?.businessData}
                      />
                    </div>
                    <div className="col-md-6 col-6 mt-2 align--right">
                      <CardInformationTag
                        card={cardData}
                        from={from}
                        langCode={langCode || 'fr'}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: '8px',
                    }}
                    className="mt-2 mb-1 px-4 align-left"
                  >
                    <CardClientInformation cardData={cardData} />
                  </div>
                  <div
                    className="px-4"
                    style={{
                      marginLeft: '8px',
                    }}
                  >
                    {cardData?.note &&
                      cardData?.businessData?.view !== 'tabs-default' && (
                        <>
                          <p className="fs-11 fw-600">{t('details')}</p>
                          <p style={{ marginTop: '-16px' }} className="fs-10">
                            <GeneralText
                              primary={false}
                              text={cardData?.note}
                              fontSize="11px"
                              markdown
                            />
                          </p>
                        </>
                      )}
                  </div>

                  {cardData?.items && (
                    <div className="mb-2 mt-4 px-3 ">
                      <CardItems
                        items={cardData?.items}
                        card={cardData}
                        includeGroupsTotal={cardData?.preferences?.groups}
                      />
                    </div>
                  )}

                  {cardData?.isInvoiced && (
                    <div className="row px-4 mb-4">
                      <GeneralText
                        primary={false}
                        color="black"
                        size="bold"
                        fontSize="13px"
                        text={`${t('payments')}`}
                      />
                      <CardPayments payments={cardData?.payments} />
                    </div>
                  )}

                  {cardData?.preferences?.passes && (
                    <div className="row px-4 mb-4">
                      <GeneralText
                        primary={false}
                        color="black"
                        size="bold"
                        fontSize="13px"
                        text={`${t('events')}`}
                      />
                      <CardPasses items={cardData?.passes} />
                    </div>
                  )}

                  {cardData?.preferences?.nodies && (
                    <div className="row px-4 mb-4">
                      <GeneralText
                        primary={false}
                        color="black"
                        size="bold"
                        fontSize="13px"
                        text={`${t('nodies')}`}
                      />
                      <CardNodies items={cardData?.nodies} />
                    </div>
                  )}

                  {cardData?.preferences?.tasks && (
                    <div className="row px-4 mb-4">
                      {' '}
                      <GeneralText
                        primary={false}
                        color="black"
                        size="bold"
                        fontSize="13px"
                        text={`${t('logs')}`}
                      />
                      <CardTasks items={cardData?.tasks || []} />
                    </div>
                  )}

                  {cardData?.preferences?.storages && (
                    <div className="row px-4 mb-4">
                      {' '}
                      <GeneralText
                        primary={false}
                        color="black"
                        size="bold"
                        fontSize="13px"
                        text={`${t('data')}`}
                      />
                      <CardStorages items={cardData?.storages || []} />
                    </div>
                  )}

                  {cardData?.preferences?.files && (
                    <div className="row px-4 mb-4">
                      {' '}
                      <GeneralText
                        primary={false}
                        color="black"
                        size="bold"
                        fontSize="13px"
                        text={`${t('files')}`}
                      />
                      <CardFiles items={cardData?.files || []} />
                    </div>
                  )}
                  {(cardData?.businessData?.alternativeText ||
                    cardData?.businessData?.bottomText) && (
                    <div className="align-left px-4 mt-5">
                      <GeneralText
                        primary={false}
                        color="black"
                        size="bold"
                        fontSize="13px"
                        text={`${t('notes')}`}
                      />
                      <GeneralText
                        primary={false}
                        color="black"
                        markdown
                        fontSize="11px"
                        text={cardData?.businessData?.alternativeText || ''}
                      />
                      <GeneralText
                        primary={false}
                        color="black"
                        markdown
                        fontSize="11px"
                        text={cardData?.businessData?.bottomText || ''}
                        classNameComponent="mt-3"
                      />
                    </div>
                  )}
                  <Divider component="div" className="px-3" />
                  <div
                    className="mb-2 px-4 mt-5 align-left"
                    onClick={navigateHome}
                  >
                    {' '}
                    <div className="d-flex mb-2">
                      <img
                        src="/assets/v3/img/icon-node-grey.png"
                        width={67}
                        height={16}
                        className="hover mt-2"
                        alt="Node"
                        style={{
                          opacity: 0.6,
                        }}
                      />
                      <div>
                        <GeneralText
                          primary={false}
                          color="black"
                          fontSize="8px"
                          classNameComponent="grey-text hover px-3"
                          text={'Intelligence Node Canada™'}
                        />
                        <div
                          style={{
                            marginTop: '-6px',
                          }}
                        >
                          <GeneralText
                            primary={false}
                            color="black"
                            fontSize="8px"
                            classNameComponent="grey-text hover px-3"
                            text={
                              t('allRightsReserved') +
                              ' - ' +
                              new Date().getFullYear()
                            }
                          />{' '}
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <GeneralText
                        primary={false}
                        color="black"
                        fontSize="8px"
                        classNameComponent="grey-text"
                        text={t('bottom_invoice_text')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicInvoiceComponent;
