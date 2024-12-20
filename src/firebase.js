import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getRemoteConfig } from 'firebase/remote-config';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getPerformance } from 'firebase/performance';
import { getMessaging, getToken } from 'firebase/messaging';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';

const firebaseConfig = {
  apiKey: 'AIzaSyBOkqKi581AWyrn5cYd87Y6NY8IthkMJ5Y',
  authDomain: 'usenode.com',
  projectId: 'node-canada',
  databaseURL: 'https://node-canada-default-rtdb.firebaseio.com',
  storageBucket: 'node-canada.appspot.com',
  messagingSenderId: '902440780506',
  appId: '1:902440780506:web:8fc5ad6ff21d4e28b85be3',
  measurementId: 'G-11BXNL5DQH',
};

// firebase.js
export const app = initializeApp(firebaseConfig);
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    '6LenRE8pAAAAAP-t_x4RCYgOKfprwWjzhmpqz3Au'
  ),
  isTokenAutoRefreshEnabled: true,
});
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const auth = getAuth(app);
export const perf = getPerformance(app);
export const signIn = signInWithEmailAndPassword;
export const remoteConfig = getRemoteConfig(app);
