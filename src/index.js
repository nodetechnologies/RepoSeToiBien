import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LicenseInfo } from '@mui/x-license-pro';
import rootReducer from './redux/reducers-v2';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { configureStore } from '@reduxjs/toolkit';
import immutableStateInvariantMiddleware from 'redux-immutable-state-invariant';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

LicenseInfo.setLicenseKey(
  '7620687c0b5ee435e466a78918e53ac6Tz05ODk4OCxFPTE3NTkwNzM5NzgwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLFBWPVEzLTIwMjQsS1Y9Mg=='
);

const middlewares = [];

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(immutableStateInvariantMiddleware());
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middlewares),
});

const root = createRoot(document.getElementById('root'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="middle-content">
          <h1>Une erreur s'est produite. Veuillez réessayer.</h1>
        </div>
      );
    }
    return this.props.children;
  }
}

root.render(
  <ErrorBoundary>
    <Suspense fallback={<div className="middle-content">Chargement...</div>}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <App />
        </LocalizationProvider>
      </Provider>
    </Suspense>
  </ErrorBoundary>
);
