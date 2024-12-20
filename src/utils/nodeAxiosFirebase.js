import axios from 'axios';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { createBrowserHistory } from 'history';

export const BASEURL =
  'https://northamerica-northeast1-node-canada.cloudfunctions.net/';

function redirectSigninFirebase() {
  const history = createBrowserHistory();

  auth.signOut();
  localStorage.removeItem('businessToken');
  history.push('/signin');
}

const nodeAxiosFirebase = async ({
  method = 'POST',
  url,
  body,
  noAuth,
  errorToast,
  showLoading,
  headers,
  options,
  t,
}) => {
  let toastId = null;
  const currentPath = window.location.pathname;
  let user;
  try {
    let idToken;
    let response;

    if (noAuth) {
      // Simple request without authentication
      response = await axios({
        method,
        url: url?.startsWith('http') ? url : `${BASEURL}${url}`,
        data: body,
        headers: headers
          ? headers
          : {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST,OPTIONS',
            },
        ...options,
      });
    } else {
      // Request with Firebase authentication
      user = auth.currentUser;
      if (user) {
        idToken = await user.getIdToken();
      }
      if (idToken) {
        response = await axios({
          method,
          url: url?.startsWith('http') ? url : `${BASEURL}${url}`,
          data: body,
          headers: headers
            ? headers
            : {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
                Authorization: `Bearer ${idToken}`,
                businesstoken: sessionStorage.getItem('businessToken'),
              },
          ...options,
        });
      }
    }

    // Replace the loading toast with a success message
    if (showLoading && toastId !== null) {
      toast.update(toastId, {
        render: t('success'),
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
      });
    }

    return response.data;
  } catch (error) {
    if (currentPath?.startsWith('/app')) {
      if (error?.response?.data?.intCode?.endsWith('GEUA003')) {
        redirectSigninFirebase();
      }
      return { errorData: error };
    }
  }
};

export default nodeAxiosFirebase;
