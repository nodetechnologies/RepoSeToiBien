import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import {
  onSnapshot,
  collection,
  updateDoc,
  addDoc,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react'; // Updated import
import PublicLayout from '../../layouts/PublicLayout';
import {
  Avatar,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ComputerOutlined,
  EmailOutlined,
  OpenInNewOutlined,
  SaveAltOutlined,
} from '@mui/icons-material';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const PublicProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId, businessId } = useParams();

  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    note: '',
  });

  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    position: 'Software Developer',
  });

  const [businessData, setBusinessData] = useState({
    name: 'Business Name',
    mainColor: '#000000',
    secColor: '#000000',
  });

  useEffect(() => {
    if (!businessId || !userId) {
      console.error('businessId or userId is undefined or empty');
      return;
    }

    const profileRef = doc(
      db,
      'businessesOnNode',
      businessId,
      'employees',
      userId
    );

    const unsubscribe = onSnapshot(
      profileRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          console.error('User document does not exist');
          return;
        }

        const docData = docSnapshot.data();
        setUserData({
          name: docData?.publicDisplay?.name || '',
          email: docData?.publicDisplay?.email || '',
          position: docData?.publicDisplay?.title || '',
          avatar: docData?.avatar || '',
          linkedin: docData?.publicDisplay?.linkedin || '',
          phone: docData?.publicDisplay?.phone || '',
        });
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );

    return () => unsubscribe();
  }, [userId, businessId]);

  useEffect(() => {
    if (!businessId) {
      console.error('businessId is undefined or empty');
      return;
    }

    const businessRef = doc(db, 'businessesOnNode', businessId);

    const unsubscribe = onSnapshot(
      businessRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          console.error('Business document does not exist');
          return;
        }

        const docData = docSnapshot.data();
        setBusinessData({
          name: docData?.name || '',
          phone: docData?.phone || '',
          email: docData?.email || '',
          website: docData?.website || '',
          mainColor: docData?.mainColor || '',
          secColor: docData?.secColor || '',
        });
      },
      (error) => {
        console.error('Error fetching business data:', error);
      }
    );
    return () => unsubscribe();
  }, [businessId]);

  const profileUrl = window.location.href;

  const saveVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
N:${userData?.name};;;
FN:${userData?.name}
ORG:${businessData?.name}
TITLE:${userData?.position}
TEL;TYPE=CELL:${userData?.phone}
EMAIL:${userData?.email}
URL:${userData?.linkedin}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile.vcf';

    a.click();

    URL.revokeObjectURL(url);
  };

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        url: `https://us-central1-integry-app.cloudfunctions.net/webhook_entry/call/eac6a1ec-b23b-4968-a6e6-4e2f3eb2f4e9/int/5473b65d-8f33-4702-af52-cde110b7acd7/step/b07fa9f0-1ea8-41e7-84e3-e258d775237d`,
        body: {
          name: formData?.name || '',
          businessName: formData?.businessName || '',
          email: formData?.email || '',
          phone: formData?.phone || '',
          note: formData?.note || '',
        },
      });
      setFormData({
        name: '',
        phone: '',
        businessName: '',
        email: '',
        note: '',
      });
      handleDialogClose();
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  return (
    <PublicLayout>
      <div>
        <Helmet>
          <title>{t('profile')}</title>
        </Helmet>
        <div
          className="align-c mt-5"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              zIndex: 0,
              backgroundColor: businessData?.mainColor + '07',
              opacity: 0.07,
            }}
          >
            <img
              width={1000}
              height={1000}
              src={`https://storage.googleapis.com/node-business-logos/${businessId}.png`}
              alt="Business Logo"
            />
          </div>
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              width: '100%',
              height: '190%',
              backgroundColor: businessData?.mainColor,
            }}
          />

          <div
            style={{
              textAlign: 'center',
              position: 'relative',
              maxWidth: '400px',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              marginTop: '120px',
              flexDirection: 'column',
              width: '100%',
              zIndex: 2,
              backgroundColor: '#FFF',
              boxShadow: '0px 10px 10px 0px #00000055',
              borderRadius: '20px',
              padding: '20px',
            }}
          >
            <div
              style={{
                zIndex: 2,
                alignContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <QRCodeCanvas value={profileUrl} /> {/* Updated component */}
              <div style={{ marginTop: '-20px', width: '70px' }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    boxShadow: '0px 0px 10px 0px #00000020',
                    border: `2px solid ${businessData?.mainColor}`,
                    backgroundColor: '#FFF',
                    position: 'relative',
                    zIndex: 2,
                  }}
                  src={userData?.avatar}
                  alt={userData?.name}
                />
              </div>
              <div className="mt-1">
                <Typography
                  variant="body1"
                  style={{ fontSize: '25px', fontWeight: 'bold' }}
                >
                  {userData?.name}
                </Typography>
              </div>
              <div className="mb-1">
                <Typography
                  variant="body1"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {userData?.lastName}
                </Typography>
              </div>
              <div className="mb-1 mt-3">
                <Typography variant="body1" style={{ fontSize: '12px' }}>
                  {userData?.position}
                </Typography>
              </div>
              <div style={{ width: '100%' }} className="mb-4 row mt-4">
                <div className="col-5"></div>
                <div className="col-2">
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: '#FFF',
                    }}
                    src={`https://storage.googleapis.com/node-business-logos/${businessId}.png`}
                    alt={userData?.name}
                  />
                </div>
                <div className="col-5"></div>
                <Typography
                  variant="body1"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  {businessData?.name}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ fontSize: '13px', fontWeight: 400 }}
                >
                  {businessData?.phone}
                </Typography>
              </div>
              <div>
                <Button
                  endIcon={<OpenInNewOutlined fontSize="small" />}
                  onClick={() => {
                    window.open(`${userData?.linkedin}`, '_blank');
                  }}
                  size="small"
                  sx={{
                    fontSize: '13px',
                    color: businessData?.mainColor,
                  }}
                >
                  {t('linkedin')}
                </Button>
              </div>
              <div>
                <Button
                  endIcon={<SaveAltOutlined fontSize="10px" />}
                  onClick={() => {
                    saveVCard();
                  }}
                  size="small"
                  sx={{
                    fontSize: '13px',
                    color: businessData?.mainColor,
                  }}
                >
                  {t('saveContact')}
                </Button>
              </div>
              <div>
                <Button
                  endIcon={<ComputerOutlined fontSize="10px" />}
                  onClick={() => {
                    window.open(`${businessData?.website}`, '_blank');
                  }}
                  size="small"
                  sx={{
                    fontSize: '13px',
                    color: businessData?.mainColor,
                  }}
                >
                  {t('website')}
                </Button>
              </div>
              <div>
                <Button
                  onClick={handleDialogOpen}
                  endIcon={<EmailOutlined fontSize="10px" />}
                  size="small"
                  sx={{
                    fontSize: '13px',
                    color: businessData?.mainColor,
                  }}
                >
                  {t('getInTouch')}
                </Button>
              </div>
              <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{t('contact')}</DialogTitle>
                <DialogContent>
                  <TextField
                    label={t('name')}
                    name="name"
                    value={formData?.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={t('businessName')}
                    name="businessName"
                    value={formData?.businessName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={t('email')}
                    name="email"
                    value={formData?.email}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={t('phone')}
                    name="phone"
                    value={formData?.phone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={t('message')}
                    name="note"
                    value={formData?.note}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                    multiline
                    rows={3}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose}>{t('cancel')}</Button>
                  <Button onClick={handleSubmit}>{t('submit')}</Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PublicProfile;
