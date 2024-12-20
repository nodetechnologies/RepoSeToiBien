import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { db } from '../../firebase';
import { getDocs, collection } from 'firebase/firestore';

// Define action types
export const FETCH_BUSINESS_DATA_BEGIN = 'FETCH_BUSINESS_DATA_BEGIN';
export const FETCH_BUSINESS_DATA_SUCCESS = 'FETCH_BUSINESS_DATA_SUCCESS';
export const FETCH_STRUCTURE_DATA_SUCCESS = 'FETCH_STRUCTURE_DATA_SUCCESS';
export const FETCH_BUSINESS_DATA_FAILURE = 'FETCH_BUSINESS_DATA_FAILURE';
export const SET_USER_AUTHENTICATION_STATUS = 'SET_USER_AUTHENTICATION_STATUS';
export const SET_CURRENT_USER_FIREBASE = 'SET_CURRENT_USER_FIREBASE';
export const FETCH_SUBLOCATIONS_BEGIN = 'FETCH_SUBLOCATIONS_BEGIN';
export const FETCH_SUBLOCATIONS_SUCCESS = 'FETCH_SUBLOCATIONS_SUCCESS';
export const FETCH_SUBLOCATIONS_FAILURE = 'FETCH_SUBLOCATIONS_FAILURE';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_TOAST_MESSAGE = 'SET_TOAST_MESSAGE';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_BUSINESSES_BEGIN = 'FETCH_BUSINESSES_BEGIN';
export const FETCH_BUSINESSES_SUCCESS = 'FETCH_BUSINESSES_SUCCESS';
export const FETCH_BUSINESSES_FAILURE = 'FETCH_BUSINESSES_FAILURE';
export const UPDATE_CURRENT_USER_BUSINESS = 'UPDATE_CURRENT_USER_BUSINESS';
export const SET_CURRENT_FORM = 'SET_CURRENT_FORM';
export const GENERAL_DATA = 'GENERAL_DATA';
export const ACTIVE_MENU = 'ACTIVE_MENU';
export const NOTIFS_COUNT = 'NOTIFS_COUNT';
export const MESSAGE = 'MESSAGE';
export const REFRESH_DATA = 'REFRESH_DATA';
export const SET_CURRENT_SECTION = 'SET_CURRENT_SECTION';
export const SET_EMPLOYEES = 'SET_EMPLOYEES';
export const SET_WORK_SESSIONS = 'SET_WORK_SESSIONS';
export const SET_ON_CALL = 'SET_ON_CALL';
export const SET_GENERAL_STATUS = 'SET_GENERAL_STATUS';
export const SET_ROOM = 'SET_ROOM';
export const SET_PAGE_LOADED = 'SET_PAGE_LOADED';

export const clearBusinessData = () => {
  return {
    type: FETCH_BUSINESS_DATA_SUCCESS,
    payload: {},
  };
};

// Action Creators
export const fetchBusinessData =
  (businessId, t, lang, publicDetails) => async (dispatch) => {
    dispatch({ type: FETCH_BUSINESS_DATA_BEGIN });
    if (!publicDetails) {
      const businessToken = sessionStorage.getItem('businessToken');
      try {
        if (!businessToken) {
          return;
        }
        const response = await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `business/general`,
          body: {
            lang: lang || 'fr',
          },
        });
        sessionStorage.removeItem('deletedElements');
        if (response?.mainColor !== undefined) {
          localStorage.setItem('mainColor', response?.mainColor);
          localStorage.setItem('secColor', response?.secColor);
        }
        localStorage.setItem('businessName', response?.name);
        dispatch({
          type: FETCH_BUSINESS_DATA_SUCCESS,
          payload: {
            ...response?.businessData,
            menu: response?.menu,
            devMode: false,
          },
        });
        dispatch({
          type: FETCH_STRUCTURE_DATA_SUCCESS,
          payload: response?.structure,
        });
        dispatch(setActiveMenu(response?.activeMenu || []));
      } catch (error) {
        dispatch({
          type: FETCH_BUSINESS_DATA_FAILURE,
          payload: { error },
        });
      }
    } else {
      if (publicDetails?.mainColor !== undefined) {
        localStorage.setItem('mainColor', publicDetails?.mainColor);
        localStorage.setItem('secColor', publicDetails?.secColor);
      }
      localStorage.setItem('businessName', publicDetails?.name);
      dispatch({
        type: FETCH_BUSINESS_DATA_SUCCESS,
        payload: {
          mainColor: publicDetails?.mainColor,
          secColor: publicDetails?.secColor,
          name: publicDetails?.name,
          menu: [],
          devMode: publicDetails?.devMode,
        },
      });
    }
  };

const getCurrentBusiness = (businesses, activeBusinessId) => {
  const activeBusiness = businesses?.find(
    (business) => business?.businessId === activeBusinessId
  );

  return activeBusiness;
};

// Current User Logged In
export const setCurrentUser =
  (currentUserFirebase, businessId) => async (dispatch) => {
    try {
      if (currentUserFirebase?.uid) {
        const dataBusinesses = sessionStorage.getItem('businesses');
        const formatted = JSON.parse(dataBusinesses);
        const activeBusiness = getCurrentBusiness(formatted, businessId);
        const userData = {
          uid: currentUserFirebase.uid,
          email: currentUserFirebase.email,
          displayName: currentUserFirebase.displayName,
          photoURL: currentUserFirebase.photoURL,
          accessToken: currentUserFirebase.accessToken,
          activeBusiness: activeBusiness,
          businesses: formatted,
        };

        dispatch({
          type: FETCH_USER_SUCCESS,
          payload: userData,
        });
      }
    } catch (error) {
      console.error('Error setting current user');
    }
  };

export const pageLoaded = (status) => {
  return (dispatch) => {
    dispatch({
      type: SET_PAGE_LOADED,
      payload: status,
    });
  };
};

// Locations Data
export const fetchSubLocations = (locationPath) => async (dispatch) => {
  dispatch({ type: FETCH_SUBLOCATIONS_BEGIN });

  try {
    const businessFirebaseID = localStorage.getItem('businessId');
    // Define the path to the sublocations collection
    const subLocationsRef = collection(
      db,
      `businessesOnNode/${businessFirebaseID}/locations/${locationPath}/sublocations`
    );

    // Fetch the documents from the collection
    const snapshot = await getDocs(subLocationsRef);

    // Map through the documents and format them
    const subLocations = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Dispatch the success action with the sublocations data
    dispatch({
      type: FETCH_SUBLOCATIONS_SUCCESS,
      payload: subLocations,
    });
  } catch (error) {
    // Dispatch the failure action if there's an error
    dispatch({
      type: FETCH_SUBLOCATIONS_FAILURE,
      payload: { error },
    });
  }
};

// Categories
export const setCategories = (categories) => {
  return {
    type: SET_CATEGORIES,
    payload: categories,
  };
};

// auth status
export const setUserAuthenticationStatus = (isAuthenticated) => {
  return {
    type: SET_USER_AUTHENTICATION_STATUS,
    payload: isAuthenticated,
  };
};

export const setCurrentForm = (currentForm) => {
  return (dispatch) => {
    dispatch({
      type: SET_CURRENT_FORM,
      payload: currentForm,
    });
  };
};

export const setGeneralData = (generalData) => {
  return (dispatch) => {
    dispatch({
      type: GENERAL_DATA,
      payload: generalData,
    });
  };
};

export const setActiveMenu = (activeMenu) => {
  return (dispatch) => {
    dispatch({
      type: ACTIVE_MENU,
      payload: activeMenu,
    });
  };
};

export const setWorkSessions = (nodes) => {
  return (dispatch) => {
    dispatch({
      type: SET_WORK_SESSIONS,
      payload: nodes,
    });
  };
};

export const setNotifsCount = (notifsCount) => {
  return (dispatch) => {
    dispatch({
      type: NOTIFS_COUNT,
      payload: notifsCount,
    });
  };
};

export const setMessage = (message) => {
  return (dispatch) => {
    dispatch({
      type: MESSAGE,
      payload: message,
    });
  };
};

export const setRefresh = (payload) => {
  return (dispatch) => {
    dispatch({
      type: REFRESH_DATA,
      payload: payload,
    });
  };
};

export const setGeneralStatus = (object) => {
  return (dispatch) => {
    dispatch({
      type: SET_GENERAL_STATUS,
      payload: object,
    });
  };
};

export const setCurrentSection = (section) => {
  return (dispatch) => {
    localStorage.setItem('section', section);
    dispatch({
      type: 'SET_CURRENT_SECTION',
      payload: section,
    });
  };
};

export const setEmployees = (employees) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_EMPLOYEES',
      payload: employees,
    });
  };
};

export const setOnCall = (onCall) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_ON_CALL',
      payload: onCall,
    });
  };
};

export const setRoom = (room) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_ROOM',
      payload: room,
    });
  };
};
