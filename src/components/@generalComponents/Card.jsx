// Libraries
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Divider,
  Dialog,
  Tooltip,
  IconButton,
  ButtonBase,
  Box,
} from '@mui/material';
import { LocalOffer, SellOutlined } from '@mui/icons-material';
import Confetti from 'react-confetti';

// Utilities
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';

// Components
import ButtonCircle from '../../stories/general-components/ButtonCircle';
import GeneralText from '../../stories/general-components/GeneralText';
import TagSelector from '../../stories/general-components/TagSelector';
import Loading from '../../stories/general-components/Loading';
import Blocks from '../../stories/layout-components/Block';

const Card = ({
  item,
  activeModule,
  cardWidth,
  color,
  showConfetti,
  activeIndex,
  handleCards,
}) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const navigate = useNavigate();
  const { structureId } = useParams();
  const theme = useTheme();
  const [employee, setEmployee] = useState(
    item?.assignedToDetails?.name || item?.assignedToName || ''
  );
  const [tag, setTag] = useState(item?.tags);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDarkMode = theme.palette.mode === 'dark';
  const deletedElements = sessionStorage.getItem('deletedElements');
  const isDeleted =
    deletedElements?.includes(item?.id || item?.dependencyDetails?.id) || false;

  const cardModel = activeModule?.list?.preferences?.cardModel;

  const [showTags, setShowTags] = useState(false);
  const timeDiffInMinutes = moment
    .unix(item?.endDate?._seconds || item?.endDate?.seconds)
    .diff(
      moment.unix(item?.startDate?._seconds || item?.startDate?.seconds),
      'minutes'
    );
  const hours = Math.floor(timeDiffInMinutes / 60);
  const minutes = timeDiffInMinutes % 60;
  const timeText = `${hours || '- '}h${minutes !== 0 ? minutes || '- ' : ''}`;
  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const badgeTimeResolver = (selection) => {
    const fieldMapping = {
      relativeTargetDate: item?.targetDate,
      relativeTimeStamp: item?.timeStamp,
      relativeLastUpdate: item?.lastUpdate,
      relativeStartDate: item?.startDate,
      relativeEndDate: item?.endDate,
      targetDate: item?.targetDate,
      timeStamp: item?.timeStamp,
      lastUpdate: item?.lastUpdate,
      startDate: item?.startDate,
      endDate: item?.endDate,
      startDateTime: item?.startDate,
      endDateTime: item?.endDate,
      targetTime: item?.targetTime,
      updatedTime: item?.lastUpdate,
      startTime: item?.realStartDate,
      endTime: item?.realEndDate,
      duration: moment
        .unix(item?.endDate?._seconds || item?.endDate?.seconds)
        .diff(
          moment.unix(item?.startDate?._seconds || item?.startDate?.seconds),
          'minutes'
        ),
      durationReal: moment
        .unix(item?.realEndDate?._seconds || item?.realEndDate?.seconds)
        .diff(
          moment.unix(
            item?.realStartDate?._seconds || item?.realStartDate?.seconds
          ),
          'minutes'
        ),
    };

    const selectedField = fieldMapping[selection];

    if (!selectedField) {
      return null;
    }

    const timestamp = selectedField._seconds || selectedField.seconds;

    if (!timestamp) {
      return null;
    }

    switch (selection) {
      case 'relativeTargetDate':
      case 'relativeTimeStamp':
      case 'relativeLastUpdate':
      case 'relativeStartDate':
      case 'relativeEndDate':
        return moment.unix(timestamp).fromNow();

      case 'targetDate':
      case 'timeStamp':
      case 'lastUpdate':
      case 'startDate':
      case 'endDate':
        return moment.unix(timestamp).format('DD MMM YYYY');
      case 'targetTime':
      case 'updatedTime':
      case 'realStartTime':
      case 'realEndTime':
      case 'startDateTime':
      case 'endDateTime':
        return moment.unix(timestamp).format('HH:mm');

      case 'duration':
      case 'durationReal':
        return selectedField;

      default:
        return null;
    }
  };

  const currentStatus = useSelector((state) => state.core.status);

  const activeStructure = businessStructure?.structures?.find(
    (structure) => structure.id === structureId
  );

  const tagsField = activeStructure?.fields?.find(
    (field) => field.value === 'tags'
  );

  const employees = businessPreference?.employees;

  useEffect(() => {
    setTag(item?.tags);
  }, [item]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleChangeTags = async (event, chips) => {
    setTag(chips);
    let formatedPath = item?.documentPath.split('/');
    formatedPath = formatedPath.filter((part) => part !== item?.id).join('/');
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'tags-kanban',
          type: 'pulse',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: item?.id,
          elementPath: formatedPath,
          key: 'tags',
          value: chips,
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'tags-kanban',
          type: 'pulse',
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavElement = () => {
    const dependencyStructure = businessStructure?.structures?.find(
      (structure) =>
        structure.id === item?.dependencyDetails?.structureIdentifiant
    );

    navigate(
      `/app/element/${
        dependencyStructure?.collectionField || activeStructure?.collectionField
      }/${item?.dependencyDetails?.structureIdentifiant || item?.structureId}/${
        item?.dependencyDetails?.id || item?.id
      }?tab=0`
    );
  };

  const handleEmployeeSelection = async (name, uid) => {
    let formatedPath = item?.documentPath.split('/');
    formatedPath = formatedPath.filter((part) => part !== item?.id).join('/');
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'employee-kanban',
          type: 'pulse',
        })
      );
      closeDialog();
      setEmployee(name);
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: item?.id,
          elementPath: formatedPath,
          key: 'assignedToId',
          value: 'users/' + uid,
        },
      });
      handleCards(item?.id, 'assignedToId', name);
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'employee-kanban',
          type: 'pulse',
        })
      );
    } catch (error) {
      console.error('Error updating employee');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  if (item?.dummy === 'dummy')
    return (
      <div className="cards border move-here align-c">{t('moveHere')}</div>
    );
  return (
    <div
      style={{
        width: `${cardWidth - 10}px`,
        padding: '4px',
        position: 'relative',
        height: 'auto',
        marginTop: '-20px',
        overflow: 'visible',
      }}
      key={item?.id}
    >
      {isDeleted && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            textAlign: 'center',
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            color: '#000000',
            fontWeight: 600,
            fontSize: '12px',
            pointerEvents: 'none',
          }}
        >
          {t('deletionInProgress') + '...'}
        </Box>
      )}
      {showConfetti === item?.id && (
        <div style={{ position: 'absolute' }}>
          <Confetti
            run={true}
            recycle={false}
            colors={[
              businessPreference?.mainColor,
              businessPreference?.secColor,
            ]}
            gravity={0.3}
          />
        </div>
      )}
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <div style={{ width: '390px', padding: '15px' }}>
          {employees?.map((employee) => (
            <Button
              key={employee?.uid}
              variant="outlined"
              color="primary"
              sx={{ width: '370px', marginBottom: '10px' }}
              onClick={() =>
                handleEmployeeSelection(
                  employee?.publicDisplay?.name || employee?.displayName,
                  employee?.uid,
                  employee?.avatar
                )
              }
            >
              <div className="row middle-content">
                <div className="col-2 align-left">
                  <img src={employee?.avatar} width={25} />{' '}
                </div>
                <div className="col-10 align-right">
                  {employee?.publicDisplay?.name || employee?.displayName}
                  <div style={{ fontSize: '9px', fontWeight: 400 }}>
                    {t(employee?.role)}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Dialog>

      <Blocks noScroll heightPercentage="auto">
        <div style={{ position: 'relative' }}>
          <div>
            <div className="row justify-content-between middle-content">
              <div className="col-10">
                <GeneralText
                  fontSize={item?.values?.[0]?.size || '12px'}
                  size={item?.values?.[0]?.weight || 'medium'}
                  text={
                    item?.values?.[0]?.transformedValue ??
                    item?.values?.[0]?.value ??
                    t('noName')
                  }
                  type={item?.values?.[0]?.typeValue || 'text'}
                  color={item?.values?.[0]?.valueColor}
                  label={item?.values?.[0]?.['label_' + currentLang]}
                  keyStructure={item?.values?.[0]?.structureValue}
                  primary={
                    item?.values?.[0]?.valueColor === 'primary' ? true : false
                  }
                />
                <div
                  className="mt-1"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    display: 'block',
                    wordBreak: 'break-word',
                    lineHeight: '0.85em',
                    maxHeight: '1.7em',
                  }}
                >
                  <GeneralText
                    fontSize="11px"
                    size="regular"
                    type={item?.values?.[0]?.sub?.typeValue || 'text'}
                    text={
                      item?.values?.[0]?.sub?.transformedValue ||
                      item?.values?.[0]?.sub?.value ||
                      '-'
                    }
                    primary={true}
                    keyStructure={item?.values?.[0]?.sub?.structureValue}
                  />
                </div>
              </div>

              <div className="col-2 ml-2 d-flex">
                <div className="col-12 d-flex middle-content align-right">
                  {tag?.length > 0 ? (
                    <Tooltip title={tag?.join(', ')}>
                      <span>
                        <IconButton
                          size="sm"
                          onClick={() => setShowTags((prevState) => !prevState)}
                        >
                          <LocalOffer htmlColor={color} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : (
                    <IconButton
                      size="sm"
                      onClick={() => setShowTags((prevState) => !prevState)}
                    >
                      <SellOutlined htmlColor={color} />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex mt-3 justify-content-between middle-content">
              <div className="col-7">
                <GeneralText
                  fontSize={item?.values?.[1]?.size || '12px'}
                  size={item?.values?.[1]?.weight || 'medium'}
                  text={
                    item?.values?.[1]?.transformedValue ??
                    item?.values?.[1]?.value ??
                    t('noName')
                  }
                  label={item?.values?.[1]?.['label_' + currentLang]}
                  type={item?.values?.[1]?.typeValue || 'text'}
                  keyStructure={item?.values?.[1]?.structureValue}
                  structureId={structureId}
                  color={item?.values?.[1]?.valueColor}
                  primary={
                    item?.values?.[1]?.valueColor === 'primary' ? true : false
                  }
                />{' '}
                <div
                  className="mt-1"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word',
                    lineHeight: '0.85em',
                    maxHeight: '1.7em',
                  }}
                >
                  <GeneralText
                    fontSize="10px"
                    size="regular"
                    structureId={structureId}
                    type={item?.values?.[1]?.sub?.typeValue || 'text'}
                    text={
                      item?.values?.[1]?.sub?.transformedValue ||
                      item?.values?.[1]?.sub?.value ||
                      '-'
                    }
                    primary={true}
                    keyStructure={item?.values?.[1]?.sub?.structureValue}
                  />
                </div>
              </div>

              <div className="col-5">
                <ButtonBase
                  onClick={handleNavElement}
                  style={{
                    borderRadius: '10px',
                    height: '30px',
                    width: '100%',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                  sx={{
                    backgroundColor: color,
                    '&:hover': {
                      backgroundColor: color + '80',
                    },
                  }}
                >
                  <Tooltip
                    title={t(
                      activeModule?.list?.tabs?.[activeIndex]?.statuses?.[
                        item?.status
                      ]
                    )}
                  >
                    <div className="align-c hover">
                      <GeneralText
                        fontSize="10px"
                        size="bold"
                        text={
                          badgeTimeResolver(
                            activeModule?.list?.tabs?.[activeIndex]?.statuses?.[
                              item?.status
                            ]
                          ) || t('open')
                        }
                        primary={false}
                        classNameComponent="hover"
                      />
                    </div>
                  </Tooltip>
                </ButtonBase>
              </div>
            </div>
          </div>

          <div className="mt-2">
            {cardModel === 'extend' && (
              <>
                <Divider component="div" />
                <div className="justify-content-between d-flex mt-2 ">
                  <div
                    onClick={openDialog}
                    className="col-5 d-flex middle-content hover align-left"
                    style={{ marginLeft: '-6px' }}
                  >
                    {item?.assignedToDetails?.avatar ? (
                      <img
                        style={{
                          marginLeft: '4px',
                        }}
                        src={item?.assignedToDetails?.avatar}
                        width={22}
                        height={22}
                        alt={item?.assignedToDetails?.name}
                      />
                    ) : (
                      <ButtonCircle
                        primary={false}
                        size="small"
                        icon="AssignmentIndOutlined"
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    )}
                    {currentStatus?.status === 'loading' &&
                    currentStatus?.position === 'employee-kanban' ? (
                      <div>
                        <Loading type="skeleton" size="small" />
                      </div>
                    ) : (
                      <div className="px-1">
                        <GeneralText
                          fontSize="10px"
                          size="medium"
                          text={employee || t('toBeAssigned')}
                          primary={true}
                        />
                      </div>
                    )}
                  </div>{' '}
                  {item?.startDate && (
                    <div className="col-2 d-flex middle-content align-left">
                      <ButtonCircle
                        primary={false}
                        size="small"
                        icon="TimerOutlined"
                        color={isDarkMode ? 'white' : 'black'}
                      />
                      <GeneralText
                        fontSize="10px"
                        size="regular"
                        text={timeText}
                        primary={true}
                      />
                    </div>
                  )}
                  {item?.locationName && (
                    <div className="col-4 d-flex middle-content">
                      <ButtonCircle
                        primary={false}
                        size="small"
                        icon="LocationSearching"
                        color={isDarkMode ? 'white' : 'black'}
                      />
                      <GeneralText
                        fontSize="10px"
                        size="regular"
                        text={item?.locationName}
                        primary={true}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        {showTags && (
          <div className="mt-2">
            <TagSelector
              fullWidth
              label={t('tags')}
              primary={true}
              onChange={handleChangeTags}
              field={tagsField}
              value={tag}
            />
          </div>
        )}
      </Blocks>
    </div>
  );
};

export default Card;
