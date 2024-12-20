import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  TextField,
  Button,
  Paper,
  Checkbox,
  FormControlLabel,
  LinearProgress,
} from '@mui/material';
import { auth, db } from '../../firebase';

const SignInRegister = ({ handleClose, fromWelcome, onCreation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //get email in query param
  const queryParams = new URLSearchParams(window.location.search);
  const emailParam = queryParams.get('email');

  const [email, setEmail] = useState(emailParam || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [reset, setReset] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [terms, setTerms] = useState(false);
  const { t } = useTranslation();
  const [registerError, setRegisterError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSelectAvatar, setShowSelectAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState(0);
  const [skinColor, setSkinColor] = useState(0);
  const [hairColor, setHairColor] = useState(0);
  const [hairStyle, setHairStyle] = useState(0);
  const steps = ['Gender', 'SkinColor', 'HairColor', 'HairStyle'];

  useEffect(() => {
    const passwordCriteria =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password && !passwordCriteria.test(password)) {
      setPasswordError(t('passwordMsg'));
      // Translate your error message
    } else {
      setPasswordError('');
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError(t('passwordsNotMatch'));
      // Translate your error message
    } else {
      setConfirmPasswordError('');
    }
  }, [password, confirmPassword]);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleAvatarSelection = async (avatar) => {
    const data = {
      photoURL:
        'https://storage.googleapis.com/avatars_node/' + avatar + '.png',
      displayName: firstName,
      lastName: lastName,
    };
    try {
      //update in firestore
      updateDoc(doc(db, 'users', auth.currentUser.uid), data);

      //update user Auth
      await updateProfile(auth.currentUser, data);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
    if (fromWelcome) {
      onCreation();
    } else {
      handleClose();
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setVerifiedEmail(false);
    setRegisterError('');

    try {
      if (terms === true && password === confirmPassword) {
        try {
          if (email && password) {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                const user = userCredential.user;
                return updateProfile(user, {
                  displayName: firstName,
                  lastName: lastName,
                }).then(() => {
                  // Display name set successfully, now sign in the user
                  return signInWithEmailAndPassword(auth, email, password);
                });
              })
              .then((userCredential) => {
                // Sign-in successful
                const user = userCredential.user;
                setShowSelectAvatar(true);
                setIsLoading(false);
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                setIsLoading(false);
              });
          }
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleNextStep = (selection) => {
    let newAvatarId = '';
    switch (currentStep) {
      case 0:
        setGender(selection);
        newAvatarId = `${selection}000`;
        break;
      case 1:
        setSkinColor(selection);
        newAvatarId = `${gender}${selection}00`;
        break;
      case 2:
        setHairColor(selection);
        newAvatarId = `${gender}${skinColor}${selection}0`;
        break;
      case 3:
        setHairStyle(selection);
        newAvatarId = `${gender}${skinColor}${hairColor}${selection}`;
        break;
      default:
        break;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step: handle avatar selection
      handleAvatarSelection(newAvatarId);
    }
  };

  const renderSelectionOptions = () => {
    // Define options for each step
    const options = [
      [
        { label: '', value: 0 },
        { label: '', value: 1 },
      ],
      [
        { label: '', value: 0 },
        { label: '', value: 1 },
        { label: '', value: 2 },
      ],
      [
        { label: '', value: 0 },
        { label: '', value: 1 },
        { label: '', value: 2 },
        { label: '', value: 3 },
        { label: '', value: 4 },
        { label: '', value: 5 },
      ],
      [
        { label: '', value: 0 },
        { label: '', value: 1 },
        { label: '', value: 2 },
        { label: '', value: 3 },
        { label: '', value: 4 },
        { label: '', value: 5 },
      ],
    ];

    const currentAvatarId = `${gender}${skinColor}${hairColor}${hairStyle}`;

    return options[currentStep].map((option) => (
      <Button key={option.value} onClick={() => handleNextStep(option.value)}>
        <img
          src={`https://storage.googleapis.com/avatars_node/${
            currentAvatarId.slice(0, currentStep) +
            option.value +
            '0'.repeat(3 - currentStep)
          }.png`}
          alt={`${steps[currentStep]}`}
          width="65px"
        />
      </Button>
    ));
  };

  return (
    <Paper elevation={0} sx={{ width: '480px', marginTop: '40px' }}>
      {reset ? (
        <>{/* <ResetPassword /> */}</>
      ) : (
        <div>
          <Typography variant="h6" gutterBottom>
            {t('registerSignUp')}
          </Typography>
          {showSelectAvatar ? (
            <>
              <div>
                <Typography>{t(`selectAvatar`)}</Typography>
                <Box>{renderSelectionOptions()}</Box>
              </div>
            </>
          ) : (
            <>
              <TextField
                label={t('firstName')}
                variant="outlined"
                fullWidth
                margin="normal"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label={t('lastName')}
                variant="outlined"
                fullWidth
                margin="normal"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />

              <TextField
                label={t('email')}
                variant="outlined"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                error={!!passwordError}
                helperText={passwordError}
                label={t('password')}
                variant="outlined"
                fullWidth
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                label={t('confirmPassword')}
                variant="outlined"
                fullWidth
                margin="normal"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                  />
                }
                label={
                  <>
                    {t('termsAndConditions')}{' '}
                    <a
                      href="/informations/mentions-legales"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'underline' }}
                    >
                      {t('readHere')}
                    </a>
                  </>
                }
              />

              {isLoading === true && <LinearProgress />}
              <div className="alertText fs-12 mt-2">{registerError || ''}</div>

              <Button
                variant="contained"
                fullWidth
                disabled={
                  !terms ||
                  !password ||
                  !confirmPassword ||
                  !firstName ||
                  !lastName ||
                  !email ||
                  isLoading
                }
                sx={{ mt: 2 }}
                onClick={handleRegister}
              >
                {t('register')}
              </Button>
            </>
          )}
        </div>
      )}
    </Paper>
  );
};

export default SignInRegister;
