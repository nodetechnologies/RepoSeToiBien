import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import GeneralText from '../stories/general-components/GeneralText';
import moment from 'moment';
import animationData from '../lotties/eco-node.json';
import animationDataTree from '../lotties/tree.json';
import { motion } from 'framer-motion';
import { Paper } from '@mui/material';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import { Canvas, useFrame } from '@react-three/fiber';
import Lottie from 'react-lottie';
import { RoundedBox, Sphere } from '@react-three/drei';
import { useNavigate } from 'react-router';

const AuthLayout = ({ children, userName }) => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const actualWeather = JSON.parse(localStorage.getItem('weatherData')) || {};
  const [weatherData, setWeatherData] = useState(actualWeather);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [currentTime, setCurrentTime] = useState(moment());
  const colorStored = localStorage.getItem('mainColor');
  const secColorStored = localStorage.getItem('secColor');
  const [mainColor, setMainColor] = useState(colorStored || '#200EF0');
  const [secColor, setSecColor] = useState(secColorStored || '#200EF090');
  const [gem, setGem] = useState(false);
  const apiKey = process.env.REACT_APP_WHEATHER_API_KEY;
  const navigate = useNavigate();
  const [geminiSuggestion, setGeminiSuggestion] = useState('');
  const softwareVersion = process.env.REACT_APP_VERSION;

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDarkMode = theme.palette.mode === 'dark';

  const businessId = localStorage.getItem('businessId');

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: false,
    },
  };

  const defaultOptionsTree = {
    loop: true,
    autoplay: true,
    animationData: animationDataTree,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: false,
    },
  };

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const MovingSphere = () => {
    const sphereRef = React.useRef();

    useFrame(() => {
      if (sphereRef.current) {
        sphereRef.current.position.x = (mousePosition.x - 20) * 0.05;
        sphereRef.current.position.y = mousePosition.y * 0.1;
        sphereRef.current.rotation.x = mousePosition.x * 0.0005;
        sphereRef.current.rotation.y = mousePosition.y * 0.0005;
      }
    });

    return (
      <Sphere
        ref={sphereRef}
        args={[0.8, 32, 32]}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial attach="material" color={mainColor} />
      </Sphere>
    );
  };

  const MovingBox = () => {
    const boxRef = React.useRef();

    useFrame(() => {
      if (boxRef.current) {
        boxRef.current.position.x = (mousePosition.x + 20) * 0.05;
        boxRef.current.position.y = (mousePosition.y + 15) * 0.1;
        boxRef.current.rotation.y = mousePosition.y + 0.00005;
        boxRef.current.rotation.x = mousePosition.x + 0.000005;
      }
    });

    return (
      <RoundedBox
        ref={boxRef}
        args={[0.85, 0.85, 0.85]}
        radius={0.15}
        smoothness={4}
        position={[3, 2, -2]}
      >
        <meshStandardMaterial
          attach="material"
          color={secColor}
          emissive={secColor}
          emissiveIntensity={0.5}
        />
      </RoundedBox>
    );
  };

  useEffect(() => {
    if (colorStored !== undefined && colorStored !== null) {
      setMainColor(colorStored || '#200EF0');
      setSecColor(secColorStored || '#200EF090');
    }

    if (businessId && businessId !== null) {
      const fetchData = async () => {
        try {
          // Make the API call
          const response = await nodeAxiosFirebase({
            t,
            noAuth: true,
            method: 'POST',
            url: `business-publicInfos?businessId=${businessId}`,
          });

          if (
            response?.mainColor !== undefined &&
            response?.mainColor !== null
          ) {
            setMainColor(response?.mainColor);
            setSecColor(response?.secColor);
            if (response?.mainColor !== undefined) {
              localStorage.setItem('mainColor', response?.mainColor);
              localStorage.setItem('secColor', response?.secColor);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [businessId]);

  useEffect(() => {
    setGeminiSuggestion('');
    const fetchData = async () => {
      if (latitude !== null && longitude !== null) {
        try {
          const storedWeatherData = localStorage.getItem('weatherData');
          if (storedWeatherData) {
            setWeatherData(JSON.parse(storedWeatherData));
            return;
          }

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${apiKey}&units=metric&lang=fr`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          localStorage.setItem('weatherData', JSON.stringify(data));

          setWeatherData(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [latitude, longitude, apiKey]);

  useEffect(() => {
    if (!gem) {
      const fetchData = async () => {
        try {
          const gemimniSuggestions = await nodeAxiosFirebase({
            t,
            noAuth: true,
            method: 'POST',
            url: `geminiSuggestions`,
            body: {
              data:
                currentLangCode === 'en'
                  ? 'user login to the platform'
                  : 'utilisateur se connecte à la plateforme',
              language: currentLangCode,
            },
          });

          setGeminiSuggestion(gemimniSuggestions?.generatedContent);
        } catch (error) {
          console.error(error);
        }
        setGem(true);
      };
      fetchData();
    }
  }, [gem]);

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

  const imageContainerStyle = {
    borderRadius: '30px',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: isMobile ? '4vh' : '8vh',
  };

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
        position: 'absolute',
        top: 0,
        left: 0,
        paddingTop: isTablet ? '' : '3.3%',
        height: '100vh',
        width: '100vw',
        overflow: isMobile ? 'auto' : 'hidden',
      }}
    >
      <div
        style={{
          width: '90%',
          height: '1000px',
          marginTop: '-580px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${mainColor}16, ${mainColor}10)`,
          filter: 'blur(45px)',
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
          animation: 'slowMove 7s infinite linear',
        }}
      >
        {' '}
      </div>
      <style jsx>{`
        @keyframes slowMove {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(190px);
          }
          70% {
            transform: translateY(400px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
      <div style={imageContainerStyle}>
        <div
          style={{
            position: 'absolute',
            zIndex: 2,
          }}
          className="row"
        >
          <Canvas
            camera={{ position: [0, 2, 5], fov: 65 }}
            style={{
              position: 'fixed',
              top: 0,
              marginTop: '-10vh',
              marginRight: '-30vh',
              right: 0,
            }}
          >
            <ambientLight intensity={1.2} />
            <pointLight position={[5, 5, 5]} intensity={1.0} color="white" />
            <directionalLight
              position={[3, 3, 3]}
              intensity={0.8}
              color="white"
            />
            <spotLight
              position={[10, 10, 10]}
              intensity={1.5}
              angle={0.3}
              penumbra={0.5}
              color="white"
            />

            <MovingSphere />
            <MovingBox />
          </Canvas>
          {!isMobile && (
            <div className="mt-3">
              <div id="draggable" className="col-5" style={{ height: '100px' }}>
                {weatherData && (
                  <>
                    {weatherData?.current?.weather?.[0]?.main &&
                      getWeatherIcon(weatherData?.current?.weather?.[0]?.main)}
                    <GeneralText
                      text={weatherData?.current?.temp?.toFixed(0) + '°C'}
                      fontSize="2.5rem"
                      size="bold"
                      primary={true}
                    />
                    <div style={{ marginTop: '-4px' }}>
                      <GeneralText
                        text={
                          t('weWaitWhe') +
                          ' ' +
                          weatherData?.current?.weather?.[0]?.description
                        }
                        fontSize="0.9rem"
                        size="regular"
                        primary={true}
                      />
                    </div>
                  </>
                )}
              </div>
              <div style={{ marginTop: '2.7vh' }}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <GeneralText
                    text={geminiSuggestion || getGreetingMessage()}
                    fontSize="1.4rem"
                    size="medium"
                    primary={true}
                  />
                </motion.div>
                <div
                  style={{
                    marginTop: '-5px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <GeneralText
                    text={userName || currentTime.format('HH:mm')}
                    fontSize="6rem"
                    size="bold"
                    color={mainColor || '#200EF0'}
                    primary={true}
                  />
                </div>
              </div>
            </div>
          )}
          <div style={{ zIndex: 0 }}>
            <div
              style={{
                position: 'absolute',
                zIndex: 0,
                right: 0,
                bottom: 0,
                marginBottom: '300px',
                marginRight: 225,
                width: '220px',
              }}
            >
              <GeneralText
                text={t('didYouKnowLogin')}
                fontSize="0.95rem"
                size="bold"
                primary={true}
              />

              <GeneralText
                text={t('ecoServer')}
                fontSize="0.8rem"
                size="regular"
                primary={true}
                classNameComponent="mt-1"
              />
            </div>
            <div
              style={{
                position: 'absolute',
                zIndex: 0,
                right: 0,
                bottom: 0,
                marginBottom: '-400px',
                marginRight: 115,
              }}
            >
              <Lottie options={defaultOptions} height={1200} width={1200} />
            </div>
            <div
              style={{
                position: 'absolute',
                zIndex: 0,
                right: 0,
                bottom: 0,
                marginBottom: '-120px',
                marginRight: 255,
              }}
            >
              <Lottie options={defaultOptionsTree} height={300} width={300} />
            </div>
            <div
              style={{
                position: 'absolute',
                zIndex: 0,
                right: 0,
                bottom: 0,
                marginBottom: '-70px',
                marginRight: 235,
              }}
            >
              <Lottie options={defaultOptionsTree} height={100} width={100} />
            </div>
          </div>

          <div
            style={{
              boxShadow: isDarkMode
                ? '0px 0px 7px 0px #FFFFFF21'
                : '0px 0px 7px 0px #00000021',
              padding: '2px',
              borderRadius: '10px',
              marginTop: '3.5%',
              maxWidth: '448px',
              height: '100%',
              zIndex: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                backgroundColor: isDarkMode ? '#00000099' : '#FFFFFF99',
                borderRadius: '13px',
                maxHeight: '330px',
                height: '330px',
                maxWidth: '448px',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: isDarkMode ? '#FFFFFF30' : '#FFFFFF99',
                  borderRadius: '13px',
                  maxHeight: '330px',
                  overflow: 'auto',
                  padding: '20px',
                  height: '330px',
                }}
              >
                {children}
              </Paper>
            </Paper>
          </div>
        </div>
      </div>
      <div style={{ zIndex: 999 }}>
        <footer>
          <div
            className="row"
            style={{
              position: 'fixed',
              bottom: 0,
              width: '100%',
              zIndex: 999,
              textAlign: 'center',
              padding: '10px',
              backgroundColor: isDarkMode
                ? 'rgba(0, 0, 0, 0.9)'
                : 'rgba(255, 255, 255, 0.6)',
            }}
          >
            <div className="col-9 d-flex px-5">
              <GeneralText
                text={t('backwebsite')}
                fontSize="0.8rem"
                size="regular"
                primary={true}
                classNameComponent="px-5 hover"
                onClick={() => navigate('/')}
              />{' '}
              <GeneralText
                text={t('privacyPolicy')}
                fontSize="0.8rem"
                size="regular"
                primary={true}
                classNameComponent="px-5 hover"
                onClick={() => navigate('/informations/mentions-legales')}
              />
              <GeneralText
                text={'Version ' + softwareVersion || ''}
                fontSize="0.8rem"
                size="regular"
                primary={true}
                classNameComponent="px-5 hover"
              />
            </div>
            <div className="col-3 align-right">
              {' '}
              <GeneralText
                text={'Intelligence Node Canada'}
                fontSize="0.8rem"
                size="regular"
                primary={true}
                classNameComponent="px-5"
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
