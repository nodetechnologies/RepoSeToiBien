// Libraries
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import { signOut } from 'firebase/auth';

// Utilities
import animationData from '../../lotties/error';
import { auth } from '../../firebase';

// Components
import GeneralText from '../../stories/general-components/GeneralText';
import Button from '../../stories/general-components/Button';

class ErrorBoundaryInt extends Component {
  state = {
    hasError: false,
    errorInfo: null,
    error: null,
    showErrorDetails: false,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      this.setState((prevState) => ({
        showErrorDetails: !prevState.showErrorDetails,
      }));
    }
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error, errorInfo: error.stack };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  handleLogout = async (event) => {
    event.preventDefault();
    try {
      await signOut(auth);
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      localStorage.removeItem('history');
      localStorage.removeItem('activeLocation');
      localStorage.removeItem('initialCardFacets');
      localStorage.removeItem('lastPath');
      localStorage.removeItem('firebaseId');
      localStorage.removeItem('passIds');
      localStorage.removeItem('deletedCardIds');
      localStorage.removeItem('revisionMode');
      localStorage.removeItem('modeFixed');
      localStorage.removeItem('currentCardId');
      localStorage.removeItem('currentCardTimestamp');
      localStorage.removeItem('modeFixed');
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Logout failed');
    }
  };

  render() {
    const { t, fromPage } = this.props; // Add fromPage prop
    const { hasError, error, errorInfo, showErrorDetails } = this.state;

    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    if (hasError && error) {
      return (
        <div className="row align-c mt-3">
          <div className="align-c">
            <Lottie options={defaultOptions} height={80} width={80} />
          </div>
          <GeneralText
            fontSize="18px"
            size="bold"
            primary={true}
            text={fromPage ? t(`errorBoundaryFromPage`) : t(`errorBoundary`)}
          />
          <div className="mt-2">
            <GeneralText
              fontSize="10px"
              size="regular"
              primary={true}
              text={
                fromPage ? t(`errorBoundaryMsgFromPage`) : t(`errorBoundaryMsg`)
              }
            />
          </div>
          <div className="col-1 mt-4">
            <Button
              label={t('findHome')}
              size="small"
              buttonSx={{ fontSize: '10px', lineHeight: '11px' }}
              onClick={() => {
                if (this.props.navigateToHome) {
                  this.props.navigateToHome();
                } else {
                  window.location.reload();
                }
              }}
            />
          </div>
          <div className="col-1 mt-3">
            <Button
              label={t('signOut')}
              size="lg"
              variant="text"
              i
              onClick={this.handleLogout}
            />
          </div>
          {showErrorDetails && (
            <div className="mt-4">
              <div>
                <GeneralText
                  fontSize="10px"
                  size="medium"
                  primary={true}
                  text={error.toString()}
                />
              </div>
              <div className="mt-2">
                <GeneralText
                  fontSize="8px"
                  size="regular"
                  primary={true}
                  text={errorInfo.toString()}
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundaryInt);
