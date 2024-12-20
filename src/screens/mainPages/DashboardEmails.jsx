// Utilities
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Tooltip,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  collectionGroup,
} from 'firebase/firestore';
import { db } from '../../firebase';
//components
import Block from '../../stories/layout-components/Block';
import moment from 'moment';
import { Chip, List, ListItem, ListItemText } from '@mui/material';
import GeneralText from '../../stories/general-components/GeneralText';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { Warning } from '@mui/icons-material';
import Blocks from '../../stories/layout-components/Block';

const DashboardEmails = () => {
  // Initialize hooks and states
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [barChartData, setBarChartData] = useState([]);

  const [cardPasses, setCardPasses] = useState([]);
  const [lists, setLists] = useState({});
  const [totalHours, setTotalHours] = useState(0);
  const [totalHoursReal, setTotalHoursReal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(moment().format('Do'));
  const [events, setEvents] = useState([]);
  const [nodies, setNodies] = useState([]);

  const date = moment().format('YYYY-MM-DD');
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [totalActions, setTotalActions] = useState(0);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [contacts, setContacts] = useState([]);

  const businessPreference = useSelector((state) => state.core.businessData);
  const mainColor = businessPreference?.mainColor;

  useEffect(() => {
    if (businessPreference?.id) {
      const unsubscribe = fetchCardPasses(date);
      return () => unsubscribe();
    }
  }, [date, businessPreference?.id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFetchData = async () => {
    try {
      const listsData = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreMulti/board`,
        body: {
          type: 'operations',
        },
      });
      setLists(listsData?.lists);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  useEffect(() => {
    const formattedEvents =
      lists?.todaysPasses?.map((event) => {
        return {
          ...event,
          title: event?.name || '',
          startDate: event?.startDate,
          endDate: event?.endDate,
        };
      }) || [];
    const formattedNodies =
      lists?.todaysNodies?.map((nody) => {
        return {
          ...nody,
          title: nody?.name || '',
          startDate: nody?.targetDate,
          endDate: nody?.targetDate,
        };
      }) || [];
    const mergedEvents = [...formattedEvents, ...formattedNodies];
    setEvents(mergedEvents);

    setNodies(lists?.nodies);

    const totalActions = lists?.grids?.length + lists?.nodeCards?.length;
    setTotalActions(totalActions);

    const totalIncomes =
      lists?.totalIncomes?.length > 0 &&
      lists?.totalIncomes?.reduce((acc, income) => acc + income?.incomes, 0);

    setTotalIncomes(totalIncomes || 0);
  }, [lists]);

  const fetchCardPasses = (dateString) => {
    const businessRef = doc(db, 'businessesOnNode', businessPreference?.id);

    const q = query(
      collectionGroup(db, 'connections'),
      where('ownerId', '==', businessRef)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const passes = [];
        querySnapshot.forEach((doc) => {
          passes.push({
            ...doc.data(),
            id: doc.id,
            ownerId: businessPreference?.id,
            targetId: doc.data().targetId?.id,
            businessId: '',
            structureId: doc.data().structureId?.id,
            dependencyId: doc.data().dependencyId?.id,
            targetProfileId: doc.data().targetProfileId?.id,
          });
        });
        setContacts(passes);
      },
      (error) => {
        console.error('Error getting real-time contacts: ', error);
      }
    );

    return unsubscribe;
  };

  const navCard = (event) => {
    navigate(
      `/app/element/cardsuninvoiced/${event?.card?.structureId}/${event?.card?.id}`
    );
  };

  const processEventsForRadarChart = (events) => {
    const today = moment().startOf('day');
    const nextWeek = moment().add(6, 'days').endOf('day');

    // Filter events for the next 7 days including today
    events = lists?.passes?.filter((event) => {
      const startDate = moment.unix(
        event?.startDate?.seconds || event?.startDate?._seconds
      );
      const endDate = event.endDate
        ? moment.unix(event?.endDate?.seconds || event?.endDate?._seconds)
        : null;
      return (
        startDate.isBetween(today, nextWeek, 'day', '[]') ||
        (endDate && endDate.isBetween(today, nextWeek, 'day', '[]'))
      );
    });

    // Initialize dayCounts with all days of the week for the next 7 days
    const dayCounts = {};
    for (let i = 0; i < 7; i++) {
      const dayKey = moment().add(i, 'days').format('ddd');
      dayCounts[dayKey] = 0;
    }

    // Increment counts for days with events
    events?.forEach((event) => {
      const day = moment
        .unix(event?.startDate?.seconds || event?.startDate?._seconds)
        .format('ddd');
      dayCounts[day] += 1;
    });

    // Transform dayCounts into an array suitable for the radar chart
    return Object.keys(dayCounts).map((day) => ({
      day,
      count: dayCounts[day],
    }));
  };

  useEffect(() => {
    const radarChartData = processEventsForRadarChart(lists?.passes);
    setBarChartData(radarChartData);
  }, [events]);

  const findTodaysEvents = (events) => {
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');
    return events?.filter((event) => {
      const startDate = moment(event?.startDate?.toDate());
      return startDate.isBetween(todayStart, todayEnd);
    });
  };

  //calculate total of all events number of hours with start/endDate
  const calculateTotalHours = (events) => {
    let totalHours = 0;
    events?.forEach((event) => {
      const startDate = moment.unix(
        event?.startDate?.seconds || event?.startDate?._seconds
      );
      const endDate = event?.endDate
        ? moment.unix(event?.endDate?.seconds || event?.endDate?._seconds)
        : null;
      const duration = endDate ? endDate.diff(startDate, 'hours', true) : 1;

      totalHours += duration;
    });

    setTotalHours(totalHours?.toFixed(2));
  };

  const calculateTotalHoursRealTime = (events) => {
    let totalHoursReal = 0;
    events?.forEach((event) => {
      const startDate = moment.unix(
        event?.realStartDate?.seconds || event?.realStartDate?._seconds
      );

      const endDate = event?.realEndDate
        ? moment.unix(
            event?.realEndDate?.seconds || event?.realEndDate?._seconds
          )
        : null;
      const duration = endDate ? endDate.diff(startDate, 'hours', true) : 0;

      totalHoursReal += duration;
    });

    setTotalHoursReal(totalHoursReal?.toFixed(2));
  };

  useEffect(() => {
    const todaysEvents = findTodaysEvents(cardPasses);
    calculateTotalHours(todaysEvents);
    calculateTotalHoursRealTime(todaysEvents);
  }, [cardPasses]);

  return (
    <div className="d-flex mt-4">
      <div className="col-4 align-center">
        <Block noBorder noScroll noPadding heightPercentage={10} height={5}>
          <div
            className="middle-content"
            style={{
              padding: '25px',
            }}
          >
            <div>
              <GeneralText
                text={totalActions?.toString()}
                fontSize="24px"
                size="bold"
                primary={true}
              />
            </div>
            <div>
              <GeneralText
                text={t('totalEmails30days')}
                fontSize="12px"
                size="medium"
                primary={true}
              />
            </div>
          </div>
        </Block>

        <div className="mt-4">
          <Block noBorder noScroll noPadding heightPercentage={13} height={5}>
            <div
              className="middle-content"
              style={{
                padding: '25px',
              }}
            >
              <div className="mt-1">
                <GeneralText
                  text={totalHoursReal?.toString() + ' ' + t('clikedRate')}
                  fontSize="24px"
                  size="bold"
                  primary={true}
                />
              </div>
              <div className="align-c d-flex middle-content ">
                <GeneralText
                  text={totalHoursReal?.toString() + ' ' + t('openedRate')}
                  fontSize="16px"
                  size="bold"
                  primary={true}
                  classNameComponent="greyText"
                />

                <Chip
                  label={
                    ((100 * totalHoursReal) / totalHours || 0)?.toFixed(1) + '%'
                  }
                  size="small"
                  style={{
                    backgroundColor: mainColor,
                    color: '#fff',
                    marginLeft: '5px',
                    height: '18px',
                    '& .MuiChipLabel': {
                      fontSize: '10px',
                    },
                  }}
                ></Chip>
              </div>
              <div>
                <GeneralText
                  text={t('rates')}
                  fontSize="12px"
                  size="medium"
                  primary={true}
                />
              </div>
            </div>
          </Block>
        </div>
        <div className="mt-4">
          <Block
            title={t('byDay')}
            noBorder
            noScroll
            noPadding
            heightPercentage={41}
            height={4}
          >
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart outerRadius={110} data={barChartData}>
                <PolarGrid />
                <PolarAngleAxis color="#f9f9f9" dataKey="day" />
                <PolarRadiusAxis
                  color="#f9f9f9"
                  angle={30}
                  domain={[0, 'auto']}
                />
                <Radar
                  name={t('events')}
                  dataKey="count"
                  stroke={mainColor}
                  fill={mainColor}
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Block>
        </div>
        <div className="mt-4">
          <Block noBorder noScroll noPadding heightPercentage={12} height={5}>
            <div
              className="middle-content"
              style={{
                padding: '25px',
              }}
            >
              <div>
                <GeneralText
                  text={contacts?.length?.toString()}
                  fontSize="24px"
                  size="bold"
                  primary={true}
                />
              </div>
              <div>
                <GeneralText
                  text={t('totalActiveContacts')}
                  fontSize="12px"
                  size="medium"
                  primary={true}
                />
              </div>
            </div>
          </Block>
        </div>
      </div>
      <div className="col-4 align-center px-4">
        <Block
          title={t('lastSentEmails')}
          noBorder
          noScroll
          noPadding
          empty={ongoingEvents?.length === 0}
          emptyType={'empty'}
          height={3}
          heightPercentage={35}
        >
          <div className="p-3"></div>
        </Block>

        <div className="mt-4">
          <Block
            title={t('contactsBycategory')}
            noBorder
            noPadding
            heightPercentage={42}
            empty={nodies?.length === 0}
            emptyType={'empty'}
          >
            <List>
              {nodies?.map((nody, index) => (
                <ListItem dense divider>
                  <ListItemText
                    sx={{ width: '70%' }}
                    primary={
                      <GeneralText
                        text={nody?.name}
                        fontSize="12px"
                        size="medium"
                        primary={true}
                      />
                    }
                  />
                  <ListItemText
                    sx={{ width: '20%' }}
                    primary={
                      <GeneralText
                        text={nody?.targetDate}
                        type="date"
                        fontSize="11px"
                        size="regular"
                        primary={true}
                      />
                    }
                  />
                  {nody?.targetDate &&
                    moment
                      .unix(
                        nody?.targetDate?.seconds || nody?.targetDate?._seconds
                      )
                      .isBefore(moment()) && (
                      <ListItemText
                        sx={{ width: '10%', textAlign: 'right' }}
                        primary={
                          <Warning
                            style={{ color: 'red' }}
                            fontSize="small"
                            className="mt-1"
                          />
                        }
                      />
                    )}
                </ListItem>
              ))}
            </List>
          </Block>
        </div>
      </div>
      <div className="col-4 ">
        <Block
          title={t('schedule')}
          noPadding
          noBorder
          height={2}
          heightPercentage={52}
        >
          <div className="d-flex align-c mt-2"></div>
          <div className="mt-3 px-3">
            <Blocks
              noBorder
              noPadding
              backgroundColor="#FFFFFF00"
              noShadow
              height={1}
              heightPercentage={34}
              empty={
                events?.filter((event) => {
                  const startDate = moment.unix(
                    event?.startDate?.seconds || event?.startDate?._seconds
                  );

                  return startDate.format('DD') === selectedDate;
                })?.length === 0
              }
              emptyType="empty"
            >
              <List>
                {events
                  ?.filter((event) => {
                    const startDate = moment.unix(
                      event?.startDate?.seconds || event?.startDate?._seconds
                    );

                    return startDate.format('DD') === selectedDate;
                  })
                  ?.map((event, index) => (
                    <ListItem
                      key={index}
                      dense
                      button
                      divider
                      onClick={() => {
                        navCard(event);
                      }}
                    >
                      <ListItemText
                        primary={
                          <GeneralText
                            text={event?.name}
                            fontSize="12px"
                            size="medium"
                            primary={true}
                          />
                        }
                      />
                      <ListItemText
                        primary={
                          <GeneralText
                            text={event?.startDate}
                            type="date"
                            fontSize="11px"
                            size="regular"
                            primary={true}
                          />
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            </Blocks>
          </div>
        </Block>
        <div className="mt-4">
          <Block
            title={'-'}
            noPadding
            noBorder
            empty={lists?.nodeCards?.length === 0}
            emptyType={'empty'}
            height={2}
            heightPercentage={25}
          >
            <List></List>
          </Block>
        </div>
      </div>
    </div>
  );
};
export default DashboardEmails;
