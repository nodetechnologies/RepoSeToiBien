import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';
import { useTranslation } from 'react-i18next';
import { Container, Divider } from '@mui/material';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router';
import { db } from '../../firebase';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import GeneralText from '../../stories/general-components/GeneralText';
import Chip from '@mui/material/Chip';
import Button from '../../stories/general-components/Button';
import ButtonCircle from '../../stories/general-components/ButtonCircle';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

const SupportContent = ({ internal }) => {
  const { t } = useTranslation();
  const { contentId } = useParams();
  const [supportData, setSupportData] = useState(null);
  const [contentData, setContentData] = useState([]);
  const currentLan = localStorage.getItem('i18nextLng');
  const [loadAgain, setLoadAgain] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'support', contentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSupportData(docSnap.data());
          // Fetch subcollection "content" for the document
          const subCollectionRef = collection(docRef, 'content');
          const querySnapshot = await getDocs(subCollectionRef);
          const contentItems = [];
          querySnapshot.forEach((subDoc) => {
            contentItems.push({ id: subDoc.id, ...subDoc.data() });
          });
          setContentData(contentItems);
        } else {
          // Handle the case where the document does not exist
        }
      } catch (error) {
        // Handle the error
        console.error('Error fetching document: ', error);
      }
    };

    fetchData();
    setLoadAgain(false);
  }, [contentId, loadAgain]);

  const sortedContentData =
    contentData && contentData?.sort((a, b) => a.order - b.order);

  const formattedDate = moment
    .unix(supportData?.lastUpdate?.seconds || supportData?.lastUpdate?._seconds)
    .format('D MMMM YYYY');

  const HelpData = () => {
    return (
      <Container>
        <div
          className="mt-5"
          style={{
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <div style={{ maxWidth: '900px' }}>
            <GeneralText
              text={
                (currentLan === 'fr'
                  ? supportData?.translatedTitle?.fr
                  : supportData?.translatedTitle?.en) || supportData?.title
              }
              fontSize="25px"
              markdown
              size="bold"
              primary={true}
            />
          </div>
          <div style={{ maxWidth: '800px' }}>
            <GeneralText
              text={
                (currentLan === 'fr'
                  ? supportData?.translatedDescription?.fr
                  : supportData?.translatedDescription?.en) ||
                supportData?.description
              }
              fontSize="18px"
              markdown
              size="medium"
              primary={true}
            />
            <GeneralText
              text={t('lastUpdate') + ' ' + formattedDate}
              fontSize="12px"
              size="medium"
              markdown
              primary={true}
              classNameComponent="grey-text mt-3"
              onClick={() => setLoadAgain(true)}
            />
          </div>
        </div>
        <div className="row">
          {!isMobile && (
            <div className="col-2 mt-5 mb-5">
              {(currentLan === 'fr'
                ? supportData?.tags
                : supportData?.tagsEn
              )?.map((item, index) => {
                return (
                  <div
                    className="d-flex align-items-center mt-2 hover"
                    key={index}
                  >
                    <Chip label={item} variant="outlined" />
                  </div>
                );
              })}
            </div>
          )}
          <div className="col-md-10 col-12 align-left mt-4 mb-5">
            {sortedContentData?.map((section) => {
              return (
                <div key={section.id}>
                  <div className="d-flex align-items-start mt-5 middle-content mb-4">
                    <div className="flex-grow-1">
                      <GeneralText
                        text={
                          (currentLan === 'fr'
                            ? section?.translatedName?.fr
                            : section?.translatedName?.en) || section?.name
                        }
                        fontSize="16px"
                        markdown
                        size="bold"
                        primary={true}
                        classNameComponent="mb-2"
                      />
                      <div
                        style={{
                          backgroundColor: '#1501F3',
                          width: '28px',
                          height: '4px',
                          marginBottom: '15px',
                        }}
                      ></div>
                      <GeneralText
                        text={
                          (currentLan === 'fr'
                            ? section?.translated?.fr
                            : section?.translated?.en) || section?.content
                        }
                        fontSize="13px"
                        size="regular"
                        primary={true}
                        markdown
                      />{' '}
                      {section?.content && (
                        <div className="mt-3 mb-1">
                          <GeneralText
                            text={
                              (currentLan === 'fr'
                                ? section?.translatedSecBlock?.fr
                                : section?.translatedSecBlock?.en) ||
                              section?.secBlock
                            }
                            fontSize="13px"
                            size="regular"
                            primary={true}
                            markdown
                          />{' '}
                        </div>
                      )}
                      {section?.procedure && (
                        <div
                          style={{
                            borderRadius: '10px',
                            border: '0.7px solid #001752',
                            backgroundColor: '#00175210',
                          }}
                          className="mt-4 p-3 align-items-center"
                        >
                          <div className="mt-1 mb-3 d-flex middle-content">
                            <LiveHelpOutlinedIcon />
                            <GeneralText
                              text={t('howToDo')}
                              fontSize="15px"
                              size="bold"
                              markdown
                              primary={true}
                              classNameComponent="px-2"
                            />{' '}
                          </div>
                          <GeneralText
                            text={
                              (currentLan === 'fr'
                                ? section?.translatedProcedure?.fr
                                : section?.translatedProcedure?.en) ||
                              section?.procedure
                            }
                            fontSize="13px"
                            size="regular"
                            primary={true}
                            markdown
                            classNameComponent="px-4"
                          />
                        </div>
                      )}
                      {section?.quote && (
                        <div
                          style={{
                            backgroundColor: '#f7f7f7',
                            borderRadius: '5px',
                          }}
                          className="mt-4 p-3 align-items-center"
                        >
                          <div className="mt-1 mb-3 d-flex middle-content">
                            <KeyboardArrowRightOutlinedIcon />
                            <GeneralText
                              text={t('example')}
                              fontSize="15px"
                              size="bold"
                              markdown
                              primary={true}
                              classNameComponent="px-2"
                            />{' '}
                          </div>
                          <GeneralText
                            text={section?.quote}
                            fontSize="13px"
                            size="regular"
                            primary={true}
                            markdown
                            classNameComponent="px-4"
                          />
                        </div>
                      )}
                      {section?.buttonLink && (
                        <div className="mt-4">
                          <Button
                            label={t('btnLink')}
                            size="small"
                            buttonSx={{
                              borderRadius: '5px',
                              marginLeft: '35px',
                            }}
                            primary={true}
                            onClick={() =>
                              window.open(section?.buttonLink, '_blank')
                            }
                          />
                        </div>
                      )}
                    </div>
                    {section?.icon && (
                      <>
                        <Divider
                          orientation="vertical"
                          flexItem
                          component="div"
                          style={{ marginRight: '20px', marginLeft: '20px' }}
                        />
                        <div className="d-flex flex-column mt-5">
                          <ButtonCircle
                            icon={section?.icon}
                            size="small"
                            primary={false}
                            color="black"
                          />
                          <GeneralText
                            text={t('findThisIcon')}
                            fontSize="9px"
                            size="regular"
                            markdown
                            primary={true}
                            classNameComponent="align-right"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <Divider
                    sx={{
                      borderWidth: '1px',
                      marginBottom: '5px',
                      borderColor: '#f2f2f2',
                    }}
                    component="div"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    );
  };

  return (
    <div>
      {internal ? (
        <HelpData />
      ) : (
        <div>
          <WebsiteLayout>
            <HelpData />
          </WebsiteLayout>
        </div>
      )}
    </div>
  );
};

export default SupportContent;
