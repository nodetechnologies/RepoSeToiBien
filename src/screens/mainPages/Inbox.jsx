import React, { useEffect, useState } from 'react';

// utils
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../../firebase';
import * as Icons from '@mui/icons-material';
import { ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as sidebarActions from '../../redux/actions/sidebar-actions';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import moment from 'moment';

// components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Blocks from '../../stories/layout-components/Block';
import GeneralText from '../../stories/general-components/GeneralText';
import AgendaSidebar from '../../sidebars/AgendaSidebar';

const Inbox = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const [weatherData, setWeatherData] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [slots, setSlots] = useState([]);
  const apiKey = process.env.REACT_APP_WHEATHER_API_KEY;

  const navigate = useNavigate();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const currentUser = useSelector((state) => state.core.user);
  const businessPreference = useSelector((state) => state.core.businessData);
  const notifs = useSelector((state) => state.core.notifs);
  const employees = businessPreference?.employees;

  const findEmployeeName = (id) => {
    const employee = employees?.find((emp) => emp.uid === id);
    return employee?.displayName || employee?.publicDisplay?.name || '';
  };

  const dependencyMatch = (path) => {
    if (!path) return '';
    const pathArray = path?.split('/');
    const lastPath = pathArray[pathArray?.length - 1];
    return lastPath;
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (latitude !== null && longitude !== null) {
        try {
          // Fetch the weather data if it doesn't exist in the local storage
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${apiKey}&units=metric&lang=fr`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();

          // Store the fetched weather data in the local storage
          localStorage.setItem('weatherData', JSON.stringify(data));

          setWeatherData(data);
        } catch (error) {}
      }
    };
    fetchData();
  }, [latitude, longitude]);

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'Clear':
        return (
          <img
            src="/assets/v2/img/weather-8.png"
            width={50}
            height={50}
            alt="meteo"
          />
        );
      case 'Clouds':
        return (
          <img
            src="/assets/v2/img/weather-8-2.png"
            width={50}
            height={50}
            alt="meteo"
          />
        );
      case 'Rain':
        return (
          <img
            src="/assets/v2/img/weather-5.png"
            width={50}
            height={50}
            alt="meteo"
          />
        );
      case 'Snow':
        return (
          <img
            src="/assets/v2/img/weather-6.png"
            width={50}
            height={50}
            alt="meteo"
          />
        );
      default:
        return (
          <img
            src="/assets/v2/img/weather-7.png"
            width={50}
            height={50}
            alt="meteo"
          />
        );
    }
  };

  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return t('goodMorning');
    } else if (currentHour >= 12 && currentHour < 18) {
      return t('goodAfternoon');
    } else {
      return t('goodEvening');
    }
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {}
        );
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (currentUser?.uid) {
      setData(notifs?.notifs);
    }
  }, [notifs, currentUser?.uid]);

  const handleNavigation = async (path) => {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      if (response.ok) {
        navigate(path);
      } else {
        console.error('URL not reachable:', path);
      }
    } catch (error) {
      console.error('Failed to fetch URL:', path, error);
    }
  };

  const updateOnClick = async (notifId, notif) => {
    try {
      if (notif?.value === 'channel') {
        localStorage.setItem('channel', true);
        dispatch(
          sidebarActions.entityChannelSidebar({
            show: true,
            mainChannelId: 'main',
            mainChannel: 'main',
            businessDocId: businessPreference?.id,
          })
        );
      } else if (notif?.documentPath) {
        handleNavigation(notif?.documentPath);
      }
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `users/notifications`,
        body: {
          notifIds: [notifId],
          type: 'clicked',
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const updateOnSeen = async () => {
      try {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `users/notifications`,
          body: {
            notifIds: data?.map((notif) => notif?.id),
            type: 'viewed',
          },
        });
      } catch (error) {
        console.error(error);
      }
    };
    const notifsNotViewed = data && data?.filter((notif) => !notif?.isViewed);
    if (notifsNotViewed?.length > 0) {
      updateOnSeen();
    }
  }, [data, t]);

  const typeResolver = (type) => {
    switch (type) {
      case 'employees':
        return t('mentionnedYou');
      case 'assignedOn':
        return t('assignedOn');
      case 'lateElement':
        return t('lateElement');
      case 'late':
        return t('late');
      default:
        return t('default');
    }
  };

  const msgResolver = (type, notif) => {
    switch (type) {
      case 'employees':
        return t('mentionedYouIn') + ' ' + t(notif?.value);
      case 'assignedOn':
        return (
          t(notif?.type + 'Msg') +
          ' ' +
          t(dependencyMatch(notif?.dependencyPath)) +
          ' ' +
          t('inNotif') +
          ' ' +
          t(notif?.dependencyName || '')
        );
      case 'lateElement':
        return (
          t('youLateElement') +
          ' ' +
          (notif?.dependencyName
            ? notif?.dependencyName
            : dependencyMatch(notif?.path))
        );
      case 'late':
        return (
          t('youLateElement') +
          ' ' +
          (notif?.dependencyName
            ? notif?.dependencyName
            : dependencyMatch(notif?.path))
        );
      default:
        return t('default');
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      const q = query(
        collection(db, 'news'),
        orderBy('timeStamp', 'desc'),
        limit(10)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const news = [];
        querySnapshot?.forEach((doc) => {
          news.push({
            ...doc.data(),
            id: doc.id,
            targetId: currentUser?.uid,
          });
        });
        setNewsList(news);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser?.uid]);

  return (
    <MainLayoutV2 pageTitle={t('myToDo')}>
      <div className="d-flex">
        <div className="col-4">
          <Blocks noScroll height={1} heightPercentage={27} noBorder>
            <div className="row">
              <div className="col-7">
                <GeneralText
                  text={getGreetingMessage()}
                  fontSize="16px"
                  size="bold"
                  classNameComponent={isTablet ? 'mx-3 mt-3' : 'mx-3 mt-4'}
                  primary={true}
                />
                <div style={{ height: '40px', maxHeight: '40px' }}>
                  <svg width="200" height="140" viewBox="0 0 105 70">
                    <defs>
                      <linearGradient id="Gradient" x1="0" x2="1" y1="0" y2="0">
                        <stop
                          offset="0%"
                          stopColor={businessPreference?.mainColor}
                        />
                        <stop
                          offset="100%"
                          stopColor={businessPreference?.secColor}
                        />
                      </linearGradient>
                    </defs>
                    <text
                      x="6"
                      y="13"
                      fill="url(#Gradient)"
                      fontSize="60"
                      fontWeight="bold"
                    >
                      {currentUser?.displayName}
                    </text>
                  </svg>
                </div>
                <GeneralText
                  text={moment().format('dddd Do MMMM YYYY')}
                  fontSize={isTablet ? '11px' : '12px'}
                  size="medium"
                  classNameComponent={isTablet ? 'mx-3 mt-2' : 'mx-3 mt-4'}
                  primary={true}
                />
              </div>
              <div className={isTablet ? 'col-5 mt-2' : 'col-5 mt-4'}>
                {weatherData && (
                  <>
                    {getWeatherIcon(weatherData.current.weather[0].main)}
                    <GeneralText
                      text={weatherData?.current?.temp?.toFixed(0) + '°C'}
                      fontSize="2.3rem"
                      size="bold"
                      primary={true}
                    />
                    {!isTablet && (
                      <div>
                        <GeneralText
                          text={
                            t('weWaitWhe') +
                            ' ' +
                            weatherData.current.weather[0].description
                          }
                          fontSize="0.9rem"
                          size="regular"
                          primary={true}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Blocks>
          <div>
            <Blocks
              height={1}
              noBorder
              heightPercentage={62}
              title={t('notifications')}
            >
              <div>
                {data &&
                  data?.map((noti) => {
                    return (
                      <ListItem
                        key={noti?.id}
                        divider
                        button
                        onClick={() => {
                          updateOnClick(noti?.id, noti);
                        }}
                      >
                        <div>
                          <div className="d-flex middle-content">
                            <div>
                              <svg
                                preserveAspectRatio="xMidYMid meet"
                                style={{ width: '0.5vh', height: '0.5vh' }}
                              ></svg>
                            </div>
                            <div className="d-flex flex-column">
                              <div className="d-flex">
                                {noti?.isClicked ? (
                                  ''
                                ) : (
                                  <div
                                    style={{
                                      width: '10px',
                                      height: '10px',
                                      backgroundColor:
                                        businessPreference?.mainColor,
                                      borderRadius: '50%',
                                      margin: '4px',
                                    }}
                                  />
                                )}
                                <GeneralText
                                  text={
                                    findEmployeeName(noti?.ownerId) +
                                    ' ' +
                                    typeResolver(noti?.type)
                                  }
                                  fontSize="12px"
                                  size="medium"
                                  primary={true}
                                />
                              </div>
                              <GeneralText
                                text={msgResolver(noti?.type, noti)}
                                fontSize="11px"
                                classNameComponent="greyText mt-2"
                                size="regular"
                                primary={true}
                              />
                              <GeneralText
                                text={moment
                                  .unix(
                                    noti?.timeStamp?.seconds ||
                                      noti?.timeStamp?.seconds
                                  )
                                  .fromNow()}
                                fontSize="10px"
                                classNameComponent="greyText"
                                size="regular"
                                primary={true}
                              />
                            </div>
                          </div>
                        </div>
                      </ListItem>
                    );
                  })}
              </div>
            </Blocks>
          </div>
        </div>
        <div className="col-4">
          <Blocks noBorder heightPercentage={94} title={t('tasks')}>
            {businessPreference?.id && (
              <AgendaSidebar slots={slots} setSlots={setSlots} />
            )}
          </Blocks>
        </div>

        <div className="col-4">
          <Blocks
            height={3}
            noBorder
            heightPercentage={41}
            empty={newsList?.length === 0}
            emptyType={'empty'}
            title={t('news')}
          >
            {newsList?.map((news) => {
              const IconComponent = Icons[news?.icon] || Icons.Error;
              return (
                <ListItem
                  key={news?.id}
                  divider
                  onClick={() => {
                    updateOnClick(news?.id, news);
                  }}
                >
                  <IconComponent />

                  <ListItemText
                    sx={{
                      width: '77%',
                      marginLeft: '16px',
                    }}
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                    primary={news?.['title_' + currentLangCode]}
                    secondary={news?.['desc_' + currentLangCode]}
                    secondaryTypographyProps={{
                      fontSize: '0.8rem',
                      fontWeight: 300,
                      color: 'grey',
                    }}
                  />
                  <ListItemText
                    sx={{
                      width: '18%',
                      textAlign: 'right',
                    }}
                    primaryTypographyProps={{
                      fontSize: '0.7rem',
                      fontWeight: 300,
                    }}
                    primary={moment
                      .unix(
                        news?.timeStamp?.seconds || news?.timeStamp?.seconds
                      )
                      .fromNow()}
                    secondary={news?.version || '-'}
                    secondaryTypographyProps={{
                      fontSize: '0.6rem',
                      fontWeight: 300,
                      color: 'grey',
                    }}
                  />
                </ListItem>
              );
            })}
          </Blocks>
          <div>
            <Blocks
              height={3}
              noBorder
              heightPercentage={44}
              title={t('toBeDone')}
            ></Blocks>
          </div>
        </div>
      </div>
    </MainLayoutV2>
  );
};

export default Inbox;
