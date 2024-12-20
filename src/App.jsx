import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Intercom from '@intercom/messenger-js-sdk';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { CustomThemeProvider } from './contexts/ThemeContext';
import ReactMarkdown from 'react-markdown';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import 'moment/locale/fr';

import { onAuthStateChanged } from 'firebase/auth';
import { I18nextProvider } from 'react-i18next';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearBusinessData,
  fetchBusinessData,
  setCurrentUser,
  setEmployees,
  setNotifsCount,
  setUserAuthenticationStatus,
  setWorkSessions,
} from './redux/actions-v2/coreAction';
import Lottie from 'react-lottie';
import Login from './screens/signin/Login';
import loadingAnimation from './lotties/loading.json';
import { auth, db } from './firebase';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import ResetPassword from './screens/website/ResetPassword';
import SelectBusiness from './screens/signin/SelectBusiness.jsx';
import { fetchDataSuccess } from './redux/actions-v2/listAction.js';

import initI18n from './i18n';
import ForgotPassword from './screens/signin/ForgotPassword.jsx';

initI18n();

const App = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentURL = window.location.href;
  const currentPath = window.location.pathname;

  const currentLangCode = i18n.language;
  const businessFirebaseId = localStorage.getItem('businessId');
  const businessPreference = useSelector((state) => state.core.businessData);
  const mode = localStorage.getItem('mode') || 'light';
  const storedMainColor = localStorage.getItem('mainColor') || '#1604DD';
  const storedSecColor = localStorage.getItem('secColor') || '#000000';
  const storedBusinessName = localStorage.getItem('businessName') || '';
  const businessMainColor = businessPreference?.mainColor || '#265BC2';
  const businessSecColor = businessPreference?.secColor || '#12088A';

  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.core.user);
  const [planCode, setPlanCode] = useState('');
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUserAuthenticationStatus(true));
        dispatch(setCurrentUser(user, businessFirebaseId));
        localStorage.setItem('userId', user.uid);
        const userRef = doc(db, 'users', user?.uid);
      } else {
        dispatch(setUserAuthenticationStatus(false));
        dispatch(setCurrentUser(null, ''));
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [businessPreference?.id, currentUser?.uid]);

  const setMomentLocale = () => {
    const userLang = i18n.language || 'en';
    if (userLang === 'fr') {
      moment.locale('fr');
    } else {
      moment.locale('en');
    }
  };

  useEffect(() => {
    setMomentLocale();
  }, [i18n.language]);

  useEffect(() => {
    if (
      currentUser?.uid &&
      businessFirebaseId &&
      currentUser?.activeBusiness?.intercomHash
    ) {
      Intercom({
        app_id: 'iy97tcg7',
        user_id: currentUser?.uid,
        name: currentUser?.displayName,
        email: currentUser?.email,
        user_hash: currentUser?.activeBusiness?.intercomHash,
      });
    } else if (!currentPath?.startsWith('/structure-public')) {
      Intercom({
        app_id: 'iy97tcg7',
      });
    }
  }, [currentUser?.uid, businessFirebaseId]);

  useEffect(() => {
    if (currentUser?.uid && businessFirebaseId) {
      const targetRef = doc(db, 'users', currentUser?.uid);

      const q = query(
        collection(db, 'notifications'),
        where('targetId', '==', targetRef),
        where('filter', '==', businessFirebaseId),
        orderBy('timeStamp', 'desc'),
        limit(50)
      );

      let unsubscribeNotif = onSnapshot(
        q,
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            targetId: currentUser?.uid,
            ownerId: doc.data().ownerId.id,
          }));
          dispatch(
            setNotifsCount({
              notifs: data,
            })
          );
        },
        (error) => {
          console.error(error);
        }
      );

      return () => unsubscribeNotif();
    }
  }, [currentUser?.uid, businessFirebaseId]);

  useEffect(() => {
    const script = document.getElementById('pinc.helper');
    if (script && businessPreference?.id) {
      script.dataset.userId = businessPreference?.id;
    }
    setPlanCode(businessPreference?.planCode);
    setIsDev(businessPreference?.isDev);
  }, [businessPreference?.id]);

  useEffect(() => {
    let unsubscribeUpdates;
    const audio = new Audio('/assets/audio/notif.wav');
    if (businessPreference?.id && currentUser.uid) {
      const channelConfigRef = doc(
        db,
        'businessesOnNode',
        businessPreference?.id,
        'channels',
        'updates'
      );

      unsubscribeUpdates = onSnapshot(channelConfigRef, (snapshot) => {
        if (snapshot.exists) {
          const updates = snapshot?.data();

          dispatch(setWorkSessions(updates?.nodes || []));

          const maptoarray = Object.entries(updates?.employees || {})?.map(
            ([id, value]) => ({
              id,
              ...value,
            })
          );

          dispatch(
            setEmployees({
              employees: maptoarray || [],
            })
          );

          dispatch(fetchDataSuccess(maptoarray || [], 'employees'));

          //find the nodes (under updates?.nodes)
          const unseenNodes = updates?.nodes?.filter(
            (node) => !node?.seenLast?.includes(currentUser?.uid)
          );

          if (unseenNodes?.length > 0) {
            const idsMessages = unseenNodes?.map((node) => node?.lastMessageId);
            const prevIdsMessages = JSON.parse(
              sessionStorage.getItem('unseenMessages')
            );
            if (prevIdsMessages) {
              const allIdsMessages = [...prevIdsMessages, ...idsMessages];
              sessionStorage.setItem(
                'unseenMessages',
                JSON.stringify(allIdsMessages)
              );
            } else {
              sessionStorage.setItem(
                'unseenMessages',
                JSON.stringify(idsMessages)
              );
            }

            //remove Nodes messages that prevIdsMessages is into unseenNodes
            const unalreadyNotifsSent = unseenNodes?.filter(
              (node) => !prevIdsMessages?.includes(node?.id)
            );

            const filtredNotif = unalreadyNotifsSent?.filter(
              (notif) => notif?.lastMessageId
            );
            if (filtredNotif?.length > 0) {
              audio?.play();
              filtredNotif?.forEach((node) => {
                toast(
                  <>
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                      children={`${node?.lastAuthor}: ${node?.lastMessage}`}
                    />
                  </>
                );
              });

              //add new Ids into the list in session storage
              const mergedNotifsMessageId = [
                ...new Set([...prevIdsMessages, ...idsMessages]),
              ];

              sessionStorage.setItem(
                'unseenMessages',
                JSON.stringify(mergedNotifsMessageId)
              );
            }
          }

          if (
            updates?.internalVersion > businessPreference?.internalVersion &&
            currentUser?.uid
          ) {
            dispatch(
              fetchBusinessData(businessPreference?.id, t, currentLangCode)
            );
          }
        }
      });
    }
    return () => {
      if (unsubscribeUpdates) {
        unsubscribeUpdates();
      }
    };
  }, [businessPreference?.id, currentUser?.uid]);

  useEffect(() => {
    if (businessFirebaseId && currentUser?.uid) {
      if (businessFirebaseId !== businessPreference?.id && currentUser?.uid) {
        dispatch(fetchBusinessData(businessFirebaseId, t, currentLangCode));
      }
    } else {
      dispatch(clearBusinessData());
    }
  }, [businessPreference?.id, currentUser?.uid]);

  //if current path is / I would like to dispatch the business data
  useEffect(() => {
    if (
      currentURL === 'https://usenode.com/' ||
      currentURL === 'https://beta.usenode.com/' ||
      currentURL === 'http://localhost:3000/'
    ) {
      //remove businessId in localstorage
      localStorage.removeItem('businessId');

      dispatch(
        fetchBusinessData(null, t, currentLangCode, {
          mainColor: storedMainColor,
          secColor: storedSecColor,
          name: storedBusinessName,
        })
      );
    }
  }, [currentURL]);

  if (loading) {
    return (
      <div>
        <Backdrop open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <CustomThemeProvider
        mode={mode}
        businessMainColor={businessMainColor}
        businessSecColor={businessSecColor}
      >
        <BrowserRouter>
          <Suspense
            fallback={
              <div>
                <div className="loader">
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: loadingAnimation,
                    }}
                    height={180}
                    width={180}
                  />
                </div>
              </div>
            }
          >
            {planCode === 'billing' && (
              <div
                onClick={() => {
                  setPlanCode('');
                }}
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  zIndex: 99999,
                  fontWeight: 400,
                  fontSize: '13px',
                  padding: '6px',
                  color: 'white',
                  textAlign: 'center',
                  top: 12,
                  left: '50%',
                  backgroundColor: 'red',
                  width: '100%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {t('billingIssuePlan')}
              </div>
            )}

            {isDev && currentPath?.startsWith('/app') && (
              <div
                onClick={() => {
                  setIsDev(false);
                }}
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  zIndex: 99999,
                  fontWeight: 400,
                  fontSize: '13px',
                  padding: '6px',
                  color: 'white',
                  textAlign: 'center',
                  top: 12,
                  left: '50%',
                  backgroundColor: 'black',
                  width: '100%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {t('devMode')}
              </div>
            )}
            <Routes>
              <Route path="/signin" element={<Login />} />
              <Route path="/select-business" element={<SelectBusiness />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/*" element={<PublicRoutes />} />
              <Route path="/app/*" element={<PrivateRoutes />} />
            </Routes>
          </Suspense>
        </BrowserRouter>

        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={mode === 'dark' ? 'dark' : 'light'}
        />
      </CustomThemeProvider>
    </I18nextProvider>
  );
};

export default App;
