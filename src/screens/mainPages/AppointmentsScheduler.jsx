import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  useParams,
  useLocation,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import moment from 'moment';
import * as drawerActions from '../../redux/actions-v2/drawer-actions';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';
import { Box, Menu, MenuItem } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import { toast } from 'react-toastify';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import Blocks from '../../stories/layout-components/Block';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import Loading from '../../stories/general-components/Loading';

const AppointmentScheduler = ({
  params,
  activeModule,
  list,
  isTablet,
  handleDisplaySide,
  refreshData,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { structureId } = useParams();
  const calendarRef = useRef(null);
  const location = useLocation();
  const locationPath = location.pathname;
  const [searchParams, setSearchParams] = useSearchParams();
  const [eventsData, setEventsData] = useState([]);
  const [passes, setCardPasses] = useState([]);
  const [currentView, setCurrentView] = useState('day');
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const currentStatus = useSelector((state) => state.core.status);
  const structures = useSelector((state) => state.core.businessStructure);
  const structure = structures?.structures?.find((s) => s.id === structureId);
  const localStorageStart = localStorage.getItem(activeModule?.id + 'start');
  const localStorageEnd = localStorage.getItem(activeModule?.id + 'end');
  const startTimeStamp = searchParams.get('start')
    ? parseInt(searchParams.get('start'))
    : null;

  const displayView =
    activeModule?.list?.preferences?.customizations?.viewType || 'resources';
  const deletedElements = sessionStorage.getItem('deletedElements');

  useEffect(() => {
    setCardPasses(list);
  }, [list]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  const handleViewChange = (view) => {
    const newView = view.type;
    setCurrentView(newView);

    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams);
      params.set('view', newView);
      return params;
    });
  };

  const handleRightClick = (
    eventId,
    eventName,
    documentPath,
    structureId,
    documentData,
    startDate,
    endDate,
    e
  ) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      setContextMenu({
        position: { x: e.pageX, y: e.pageY },
        eventId,
        eventName,
        startDate,
        endDate,
        documentPath,
        structureId,
        documentData,
      });
    }
  };

  const handleMenuClose = () => {
    setContextMenu(null);
  };

  const handleMenuSelect = (eventId, action, eventPath, startDate, endDate) => {
    const extendedValuesEvent = passes?.find((event) => event.id === eventId);
    if (action === 'move') {
      toast.info(t('moveEventDetails'));
      setSelectedElement({
        eventId: eventId,
        path: eventPath,
        startDate: startDate,
        endDate: endDate,
      });
    }
    if (action === 'openNew') {
      const collectionMatch = structures?.structures?.find(
        (s) =>
          s.id === extendedValuesEvent?.dependencyDetails?.structureIdentifiant
      );
      const collectionField =
        collectionMatch?.collectionField || 'cardsuninvoiced';
      if (
        collectionField &&
        extendedValuesEvent?.dependencyDetails?.structureIdentifiant &&
        extendedValuesEvent?.dependencyDetails?.id
      ) {
        navigate(
          `/app/element/${collectionField}/${extendedValuesEvent?.dependencyDetails?.structureIdentifiant}/${extendedValuesEvent?.dependencyDetails?.id}`
        );
      }
    }
    if (action === 'quickView') {
      if (extendedValuesEvent?.dependencyDetails) {
        handleDisplaySide({
          id: extendedValuesEvent?.dependencyDetails?.id,
          name: extendedValuesEvent?.dependencyDetails?.name,
          documentPath: 'cards/' + extendedValuesEvent?.dependencyDetails?.id,
          structureId:
            extendedValuesEvent?.dependencyDetails?.structureIdentifiant,
        });
      }
    }
    setContextMenu(null);
  };

  //moves calendar to custom date
  useEffect(() => {
    if (calendarRef?.current) {
      calendarRef?.current
        ?.getApi()
        ?.gotoDate(
          moment
            .unix(startTimeStamp || localStorageStart || Date.now() / 1000)
            .format('YYYY-MM-DD')
        );
    }
  }, [params?.startTimeStamp, list, activeModule]);

  const resources =
    displayView === 'resources'
      ? businessPreference?.locations
          ?.filter((location) => location?.isActive)
          ?.map((subLocation) => {
            return {
              id: subLocation?.id,
              title: subLocation?.name,
              order: subLocation?.order,
            };
          })
      : businessPreference?.employees?.map((employee, index) => {
          return {
            id: employee?.id,
            title: employee?.publicDisplay?.name || employee?.displayName,
            order: index,
          };
        });

  useEffect(() => {
    if (passes) {
      const mappedEvents = passes?.map((event) => {
        const start = new Date(
          (event?.startDate?.seconds || event?.startDate?._seconds) * 1000
        );
        const end = new Date(
          (event?.endDate?.seconds || event?.endDate?._seconds) * 1000
        );

        const fieldsStructure = businessStructure?.structures?.find(
          (s) => s.id === event?.structureId
        )?.fields;

        const statusField = fieldsStructure?.find(
          (field) => field?.typeData === 'status'
        );

        const color = statusField?.selections?.find(
          (selection) => selection?.value === event?.status
        )?.color;

        return {
          ...event,
          id: event.id,
          title: event.name || '-',
          start: start,
          end: end,
          color: color || '#696969',
          elementId: event?.dependencyId,
          documentPath: event?.documentPath,
          structureId: event?.structureId,
          card: event?.dependencyId || event?.dependencyDetails?.id || {},
          resourceId:
            displayView === 'resources'
              ? event.locationId
              : event?.assignedToId,
          depStructureId: event?.dependencyDetails?.structureIdentifiant,
          targetProfileName:
            (event?.targetProfileAttributes?.attribute1 ||
              event?.targetProfileDetails?.attribute1 ||
              '') +
            ' ' +
            (event?.targetProfileAttributes?.attribute2 ||
              event?.targetProfileDetails?.attribute2 ||
              '') +
            ' ' +
            (event?.targetProfileAttributes?.attribute3 ||
              event?.targetProfileDetails?.attribute3 ||
              ''),
          locationName: event?.locationName || '',
          subTitle: event?.targetName || '',
          status: event?.status || 0,
        };
      });
      setEventsData(mappedEvents);
    }
  }, [passes]);

  // Function to update Firestore document
  const updateEventInFirestore = async (
    eventId,
    newStart,
    newEnd,
    resourceId,
    path
  ) => {
    try {
      let formatedPath = path.split('/');
      let itemId = formatedPath[formatedPath.length - 1];
      formatedPath = formatedPath.filter((part) => part !== itemId).join('/');

      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'calendar-scheduler',
          type: currentStatus?.type,
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: itemId,
          elementPath: formatedPath,
          key: 'datesPass',
          value: {
            startDate: newStart,
            endDate: newEnd,
          },
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: itemId,
          elementPath: formatedPath,
          key: 'locationIdentifiant',
          value: resourceId,
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'calendar-scheduler',
          type: currentStatus?.type,
        })
      );
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleEventDrop = (info) => {
    // Extract the necessary information from the event object
    const eventId = info.event.id;
    const newStart = info.event.start;
    const path = info.event.extendedProps?.documentPath;
    const newEnd =
      info.event.end || new Date(info.event.start.getTime() + 60 * 60 * 1000);
    const resourceId = info.event._def?.resourceIds[0];

    // Call the function to update Firestore
    updateEventInFirestore(eventId, newStart, newEnd, resourceId, path);
  };

  const handleEventResize = (info) => {
    const eventId = info.event.id;
    const newStart = info.event?.start;
    const path = info.event.extendedProps?.documentPath;
    const newEnd =
      info.event.end || new Date(info.event?.start?.getTime() + 60 * 60 * 1000);
    const resourceId = info.event._def?.resourceIds[0];

    // Call the function to update Firestore
    updateEventInFirestore(eventId, newStart, newEnd, resourceId, path);
  };

  //called when an event is clicked
  const onEventClick = (info) => {
    const extendedValues = info?.event?._def?.extendedProps;

    const collectionMatch = structures?.structures?.find(
      (s) => s.id === extendedValues?.depStructureId
    );
    const collectionField =
      collectionMatch?.collectionField || 'cardsuninvoiced';
    if (
      collectionField &&
      extendedValues?.depStructureId &&
      extendedValues?.card
    ) {
      navigate(
        `/app/element/${collectionField}/${extendedValues?.depStructureId}/${extendedValues?.card}`
      );
    }
  };

  const renderEventContent = (eventInfo) => {
    const isDeleted =
      deletedElements?.includes(
        eventInfo.event.extendedProps?.id ||
          eventInfo.event.extendedProps?.dependencyDetails?.id
      ) || false;
    return (
      <div style={{ position: 'relative' }}>
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
              borderRadius: '5px',
              fontSize: '11px',
              pointerEvents: 'none',
            }}
          >
            {t('deletionInProgress') + '...'}
          </Box>
        )}
        <div>
          {moment(eventInfo.event?.start).format('HH:mm')} -
          {moment(eventInfo.event?.end).format('HH:mm')}
        </div>
        <div style={{ fontWeight: 500, fontSize: '0.8em' }}>
          {eventInfo.event.title +
            ' - ' +
            eventInfo.event.extendedProps?.targetProfileName ||
            eventInfo.event.extendedProps?.targetProfileAttributes ||
            ''}
        </div>
        {eventInfo.event.extendedProps.subTitle && (
          <div style={{ fontSize: '0.7em' }}>
            {eventInfo.event.extendedProps.subTitle}
          </div>
        )}
      </div>
    );
  };

  const handleClose = () => {
    dispatch(drawerActions.createAppointment({ isDrawerOpen: false }));
  };

  const onDateSelected = async (info) => {
    const startTime = info?.date;

    const selectedElementDuration = moment(selectedElement?.endDate).diff(
      moment(selectedElement?.startDate),
      'minutes'
    );
    const endTime = moment(info?.date)
      .add(selectedElementDuration, 'm')
      .toDate();

    if (selectedElement) {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'move-event',
          type: 'backdrop',
        })
      );

      await updateEventInFirestore(
        selectedElement?.eventId,
        startTime,
        endTime,
        info?.resource?.id,
        selectedElement?.path
      );

      setSelectedElement(null);
      refreshData();
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'move-event',
          type: 'backdrop',
        })
      );
    } else {
      const endTime = moment(info?.date).add(60, 'm').toDate();
      if (locationPath?.startsWith('/app/operations/grids')) return;

      dispatch(
        drawerActions.createAppointment({
          isDrawerOpen: true,
          selectedDate: {
            startTime: startTime,
            endTime: endTime,
          },
          defaultLocationId: info?.resource?.id,
          handleDrawerClose: handleClose,
        })
      );
    }
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ position: 'relative' }}
    >
      {currentStatus?.type === 'backdrop' &&
        currentStatus?.status === 'loading' && (
          <Loading type={currentStatus?.type} />
        )}
      <Blocks height={1} heightPercentage={100} noBorder>
        <FullCalendar
          ref={calendarRef}
          locale={frLocale}
          initialView={
            activeModule?.list?.preferences?.initialView ||
            'resourceTimelineDay'
          }
          viewDidMount={({ view }) => handleViewChange(view)}
          displayEventEnd={true}
          resources={resources}
          headerToolbar={{
            left: '',
            center: 'title',
            right:
              activeModule?.list?.preferences?.views ||
              'resourceTimelineDay,timeGridWeek',
          }}
          editable={true}
          height={isTablet ? '72vh' : '77vh'}
          aspectRatio="1.5"
          selectable={true}
          nowIndicator={true}
          startTime={structure?.element?.preferences?.startTime || '06:00:00'}
          slotDuration={
            activeModule?.list?.preferences?.slotDuration || '00:15:00'
          }
          resourceOrder={'order' || 'idx'}
          endTime={structure?.element?.preferences?.endTime || '23:00:00'}
          resourceAreaWidth={'13%'}
          eventDrop={handleEventDrop}
          eventContent={renderEventContent}
          eventResize={handleEventResize}
          eventClick={onEventClick}
          dateClick={onDateSelected}
          plugins={[
            resourceTimelinePlugin,
            interactionPlugin,
            timeGridPlugin,
            resourceTimeGridPlugin,
            listPlugin,
            dayGridPlugin,
          ]}
          events={eventsData}
          eventDidMount={(arg) => {
            arg.el.addEventListener('contextmenu', (e) => {
              handleRightClick(
                arg.event.id,
                arg.event.title,
                arg.event.extendedProps?.documentPath,
                arg.event.extendedProps?.structureId,
                arg.event.extendedProps,
                arg.event.start,
                arg.event.end,
                e
              );
            });
          }}
        />
        {contextMenu && (
          <Menu
            open={contextMenu !== null}
            onClose={handleMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? {
                    top: contextMenu.position?.y,
                    left: contextMenu.position?.x,
                  }
                : undefined
            }
          >
            <MenuItem
              onClick={() => {
                handleMenuSelect(contextMenu?.eventId, 'copyId');
                try {
                  window.focus();
                  window.navigator.clipboard
                    .writeText(contextMenu?.eventId)
                    .then(() => {
                      toast.info(t('copied'));
                    })
                    .catch((err) => {
                      console.error('Clipboard copy failed:', err);
                      toast.error(t('clipboardError'));
                    });
                } catch (error) {
                  console.error('Clipboard operation failed:', error);
                  toast.error(t('clipboardError'));
                }
              }}
            >
              {t('copyId')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuSelect(contextMenu?.eventId, 'copyName');
                try {
                  window.focus();
                  window.navigator.clipboard
                    .writeText(contextMenu?.eventName)
                    .then(() => {
                      toast.info(t('copied'));
                    })
                    .catch((err) => {
                      console.error('Clipboard copy failed:', err);
                      toast.error(t('clipboardError'));
                    });
                } catch (error) {
                  console.error('Clipboard operation failed:', error);
                  toast.error(t('clipboardError'));
                }
              }}
            >
              {t('copyName')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuSelect(contextMenu?.eventId, 'quickView');
              }}
            >
              {t('quickView')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuSelect(contextMenu?.eventId, 'openNew');
              }}
            >
              {t('openNewTab')}
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleMenuSelect(
                  contextMenu?.eventId,
                  'move',
                  contextMenu?.documentPath,
                  contextMenu?.startDate,
                  contextMenu?.endDate
                );
              }}
            >
              {t('move')}
            </MenuItem>
          </Menu>
        )}
      </Blocks>
    </div>
  );
};

export default AppointmentScheduler;
