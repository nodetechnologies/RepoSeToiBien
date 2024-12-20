import axios from 'axios';
import { auth } from '../firebase';

export const BASEURL =
  'https://northamerica-northeast1-node-canada.cloudfunctions.net/';

const nodeAxiosPublic = async ({
  method,
  url,
  body,
  noAuth,
  headers,
  reduxDispatcher,
  loadingMessage,
  successMessage,
  errorMessage,
}) => {
  try {
    let idToken;
    let response;

    if (noAuth) {
      // If no authentication is needed or user is not authenticated, make a simple request
      response = await axios({
        method,
        url: url?.startsWith('http') ? url : `${BASEURL}${url}`,
        data: body,
      });
    } else {
      // If authentication is needed and user is authenticated, get the token and make a request
      const user = auth.currentUser;
      if (user) {
        idToken = await user.getIdToken();
      } else {
        throw new Error('User not authenticated');
      }

      if (idToken) {
        response = await axios({
          method,
          url: url?.startsWith('http') ? url : `${BASEURL}${url}`,
          data: body,
          headers: headers,
        });
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching data');

    return { errorData: error };
  }
};

export default nodeAxiosPublic;
