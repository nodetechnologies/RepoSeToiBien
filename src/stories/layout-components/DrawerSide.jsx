import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  Button,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import {
  Close,
  Delete,
  Edit,
  Print,
  Person,
  QrCode,
  OpenInNew,
  SaveOutlined,
  CheckCircle,
  CheckCircleOutline,
} from '@mui/icons-material';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import StickerLabel from '../../components/@generalComponents/Storage/StickerLabel';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';
import Loading from '../general-components/Loading';

const DrawerSide = ({
  title,
  children,
  width,
  subtitle,
  position,
  handleDrawerClose,
  isDrawerOpen,
  toEdit,
  setToEdit,
  elementName,
  elementIden,
  noAction,
  lastUpdate,
  elementPath,
  handleSave,
  size,
  isCreation,
  item,
  structure,
  handleRemove,
  isLoading,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { elementId } = useParams();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const printRef = useRef();
  const [printQr, setPrintQr] = useState(false);

  const useStyles = makeStyles({
    paper: {
      background: theme.palette.mode === 'dark' ? '#696969' : '#ffffff',
      color: theme.palette.mode === 'dark' ? '#ffffff' : '#000',
      marginTop: '20px',
      borderRadius: '10px',
      overflowX: 'hidden',
      marginLeft: position === 'right' ? '0px' : '80px',
      marginRight: position === 'right' ? '80px' : '0px',
      transform: isDrawerOpen ? 'translateY(0)' : `translateY(80%)`,
      transition: theme.transitions.create('transform', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      height: size === 'small' ? '40vh' : '88vh',
      maxHeight: '100%',
      position: 'fixed',
      bottom: 0,
      zIndex: 1000,
      width: '35%',
      left: position === 'right' ? 'auto' : 0,
      right: position === 'right' ? 0 : 'auto',
      minWidth: width ? width : '650px',
    },
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 998,
      display: isDrawerOpen ? 'block' : 'none',
    },
    closeBtn: {
      position: 'absolute',
      right: theme.spacing(2),
      top: theme.spacing(2),
      color: theme.palette.grey[500],
    },
  });

  const classes = useStyles();

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessStructures = businessStructure?.structures;

  const firstContactsStructure = businessStructures?.find(
    (s) => s?.collectionField === 'contacts'
  );

  const currentUser = useSelector((state) => state.core.user);

  // Function to handle print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const navigateBack = () => {
    const history = localStorage.getItem('history')
      ? JSON.parse(localStorage.getItem('history'))
      : [];
    const lastElementMinusOne = history[history?.length - 2];
    navigate(lastElementMinusOne?.url || lastElementMinusOne?.pathname);
  };

  const handleDelete = async () => {
    let formattedPath = '';

    try {
      dispatch(setGeneralStatus({ status: 'loading' }));
      if (structure?.collectionField === 'contacts') {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: 'deleteUser',
          showLoading: true,
          errorToast: t('makesureUserDelete'),
          body: {
            userId: elementIden,
          },
        });
      } else {
        if (elementPath) {
          const parts = elementPath?.split('/');
          parts.pop();
          formattedPath = parts.join('/');
        }
        if (formattedPath) {
          await nodeAxiosFirebase({
            t,
            method: 'DELETE',
            url: 'coreSeqV2',
            errorToast: t('makesureElementsDelete'),
            showLoading: true,
            body: {
              elementPath: formattedPath,
              elementId: elementIden,
            },
          });
          const deletedElements =
            JSON.parse(sessionStorage.getItem('deletedElements')) || [];

          if (deletedElements.length >= 10) {
            deletedElements.shift();
          }

          deletedElements.push(elementIden);

          sessionStorage.setItem(
            'deletedElements',
            JSON.stringify(deletedElements)
          );
        }
      }
      if (
        location?.pathname?.startsWith('/app/element') &&
        elementId === item?.id
      ) {
        navigateBack();
      }
      dispatch(setGeneralStatus({ status: 'success' }));
    } catch (error) {
      console.error('Error fetching data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
    if (handleRemove) {
      handleRemove();
    }
    setConfirmDelete(false);
    handleDrawerClose();
  };

  const handleDeleteConfirm = () => {
    setConfirmDelete(true);
  };

  const handleQr = () => {
    setPrintQr(true);
  };

  const handleEdit = () => {
    setToEdit(true);
  };

  const navigateTarget = () => {
    navigate(
      `/app/element/contacts/${firstContactsStructure?.id}/${item?.targetId}${item?.ownerId}`
    );
    handleDrawerClose();
  };

  const openElement = () => {
    if (
      structure?.collectionField === 'cardsinvoiced' ||
      structure?.collectionField === 'cardsuninvoiced' ||
      structure?.collectionField === 'cardsexpense'
    ) {
      navigate(
        `/app/element/${structure?.collectionField}/${structure?.id}/${elementIden}`
      );
    } else {
      navigate(
        `/app/element/${structure?.collectionField}/${structure?.id}/${elementIden}`
      );
    }
    handleDrawerClose();
  };

  const handleIsDone = async () => {
    let formattedPath = elementPath?.split(elementIden)[0];
    try {
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: elementIden,
          elementPath: formattedPath,
          key: 'isDone',
          value: true,
        },
      });
      handleSave('isDone', true);
    } catch (error) {
      console.error('Error set tags');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const formatTitle = (title) => {
    if (
      typeof title === 'undefined' ||
      title === undefined ||
      title === 'undefined undefined'
    ) {
      return '';
    }

    if (typeof title === 'object') {
      if (title?.seconds) {
        return moment.unix(title?.seconds || moment().unix()).fromNow();
      } else if (title?._seconds) {
        return moment.unix(title?._seconds || moment().unix()).fromNow();
      }
    } else {
      return title || '';
    }
  };

  return (
    <>
      {isDrawerOpen && (
        <div className={classes.backdrop} onClick={handleDrawerClose}></div>
      )}
      <Drawer
        anchor="bottom"
        classes={{ paper: classes.paper }}
        style={{
          zIndex: 1000,
        }}
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <ErrorBoundary>
          <div style={{ width: '100%' }}>
            <div className="align-right">
              <IconButton
                className={classes.closeBtn}
                onClick={handleDrawerClose}
              >
                <Close />
              </IconButton>
            </div>
            {isLoading ? (
              <Loading type="logo" size="small" />
            ) : (
              <Box
                sx={{
                  width: width ? width : '650px',
                  paddingTop: '30px',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  height: size === 'small' ? '35vh' : '85vh',
                }}
                className="align-left"
              >
                <div style={{ width: '100%' }}>
                  <Typography fontWeight={600} fontSize="15px">
                    {formatTitle(title)}
                  </Typography>
                  <Typography fontWeight={500} fontSize="12px">
                    {subtitle || ''}
                  </Typography>
                  {!noAction && (
                    <div>
                      <div className="align-right d-flex mt-3 mx-3">
                        <Typography
                          variant="body2"
                          color="grey"
                          fontWeight={300}
                          fontSize="10px"
                        >
                          {(lastUpdate?.seconds || lastUpdate?._seconds) &&
                            moment
                              .unix(
                                lastUpdate?.seconds ||
                                  lastUpdate?._seconds ||
                                  lastUpdate / 1000 ||
                                  null
                              )
                              .fromNow()}
                        </Typography>
                      </div>
                      <div className="mt-4">
                        <Divider component="div" />

                        <div className="d-flex middle-content">
                          <div className="col-8">
                            {elementName?.toString().trim() !==
                              title?.toString().trim() && (
                              <Typography fontWeight={400} fontSize="14px">
                                {elementName}
                              </Typography>
                            )}
                          </div>
                          <div className="col-4 d-flex align-right">
                            {handleSave && (
                              <Tooltip title={t('save')}>
                                <span>
                                  <IconButton onClick={handleSave}>
                                    <SaveOutlined />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            )}

                            {!isCreation && (
                              <>
                                {elementId !== item?.id && item?.id && (
                                  <Tooltip title={t('open')}>
                                    <span>
                                      <IconButton onClick={openElement}>
                                        <OpenInNew />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                )}

                                {!isCreation &&
                                  (structure?.collectionField === 'storages' ||
                                    structure?.collectionField === 'logs' ||
                                    structure?.collectionField === 'passes' ||
                                    structure?.collectionField ===
                                      'articles') && (
                                    <>
                                      {elementIden && (
                                        <Tooltip title={t('label')}>
                                          <span>
                                            <IconButton onClick={handleQr}>
                                              <QrCode />
                                            </IconButton>
                                          </span>
                                        </Tooltip>
                                      )}{' '}
                                    </>
                                  )}
                                {!isCreation &&
                                  (structure?.collectionField === 'nodies' ||
                                    structure?.collectionField === 'tasks') && (
                                    <>
                                      {elementIden && (
                                        <Tooltip title={t('isDone')}>
                                          <span>
                                            <IconButton onClick={handleIsDone}>
                                              <CheckCircleOutline />
                                            </IconButton>
                                          </span>
                                        </Tooltip>
                                      )}{' '}
                                    </>
                                  )}
                                {!isCreation && (
                                  <>
                                    {elementIden && (
                                      <Tooltip title={t('print')}>
                                        <span>
                                          <IconButton onClick={handlePrint}>
                                            <Print />
                                          </IconButton>
                                        </span>
                                      </Tooltip>
                                    )}
                                  </>
                                )}
                                {!isCreation && (
                                  <>
                                    {item?.id && (
                                      <Tooltip title={t('targetDetails')}>
                                        <span>
                                          <IconButton onClick={navigateTarget}>
                                            <Person />
                                          </IconButton>
                                        </span>
                                      </Tooltip>
                                    )}
                                  </>
                                )}
                                {!isCreation && (
                                  <>
                                    {!toEdit && elementIden && (
                                      <Tooltip title={t('edit')}>
                                        <span>
                                          <IconButton onClick={handleEdit}>
                                            <Edit />
                                          </IconButton>
                                        </span>
                                      </Tooltip>
                                    )}
                                  </>
                                )}
                                {!isCreation && (
                                  <Tooltip title={t('delete')}>
                                    {(currentUser?.activeBusiness?.role ===
                                      'SUPER-ADMIN' ||
                                      currentUser?.activeBusiness?.role ===
                                        'ADMIN') && (
                                      <span>
                                        <IconButton
                                          onClick={handleDeleteConfirm}
                                        >
                                          <Delete />
                                        </IconButton>
                                      </span>
                                    )}
                                  </Tooltip>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        <Divider component="div" />
                      </div>
                      {confirmDelete && (
                        <Box sx={{ marginTop: '35px' }}>
                          <div className="align-c">
                            <Typography fontWeight={500} fontSize="14px">
                              {t('confirmDeleteMsg')}
                            </Typography>
                          </div>
                          <div className="d-flex align-c mt-3">
                            <Button
                              variant="outlined"
                              color="error"
                              disableElevation
                              size="small"
                              onClick={handleDelete}
                              sx={{ marginRight: '10px' }}
                            >
                              {t('delete')}
                            </Button>
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() => setConfirmDelete(false)}
                            >
                              {t('cancel')}
                            </Button>
                          </div>
                        </Box>
                      )}
                      {printQr && (
                        <>
                          <div className="row align-c mt-4" ref={printRef}>
                            <StickerLabel
                              itemId={item?.id}
                              name={item?.name}
                              targetName={
                                item?.targetName || item?.targetDetails?.name
                              }
                              dependencyName={
                                item?.dependencyName ||
                                item?.dependencyDetails?.name
                              }
                              attribute1={item?.attribute1}
                              attribute2={item?.attribute2}
                              attribute3={item?.attribute3}
                            />
                          </div>
                          <div className="mt-4 d-flex align-c">
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={handlePrint}
                              sx={{ marginRight: '15px' }}
                            >
                              {t('print')}
                            </Button>
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() => setPrintQr(false)}
                              sx={{ marginRight: '15px' }}
                            >
                              {t('close')}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {!confirmDelete && !printQr && (
                  <Box
                    ref={printRef}
                    sx={{
                      marginTop: '15px',
                      overflowY: 'scroll',
                    }}
                  >
                    {children}
                  </Box>
                )}
              </Box>
            )}
          </div>
        </ErrorBoundary>
      </Drawer>
    </>
  );
};

export default DrawerSide;
