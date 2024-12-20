import React, { useEffect, useState } from 'react';
import {
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';

//utilities
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import chroma from 'chroma-js';

import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import {
  Skeleton,
  Typography,
  IconButton,
  MenuItem,
  Menu,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';
import Loading from '../../stories/general-components/Loading';
import ElementDetailsContent from '../mainPages/ElementDetailsContent';
import GeneralText from '../../stories/general-components/GeneralText';

const PublicElementDetails = ({ setData, reload, setReload }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { search } = useLocation();

  const { structureId, elementId, moduleName, businessId } = useParams();
  const accessToken = new URLSearchParams(search).get('accessToken');
  const accessCode = new URLSearchParams(search).get('accessCode');

  const [searchParams] = useSearchParams();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(true);
  const [pageOpen, setPageOpen] = useState(false);
  const [accTabs, setAccTabs] = useState([]);
  const [accTabsPublic, setAccTabsPublic] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [errorDoc, setErrorDoc] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const currentlangCode = i18n.language;
  const activeIndex = parseInt(searchParams.get('tab')) || 0;
  const editBlockModal = useSelector(
    (state) => state.modalReducer.modalEditBlock
  );

  const handleDropdownToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const businessStructures = businessStructure?.structures;
  const structure = businessStructures?.find((s) => s.id === structureId);

  const singleElement = useSelector(
    (state) => state.element.singleElementDetails
  );

  const currentStatus = useSelector((state) => state.core.status);

  const [layoutPublic, setLayoutPublic] = useState(structure?.tabsPublic || []);
  const softwareVersion = process.env.REACT_APP_VERSION;

  const getDocument = async () => {
    try {
      setIsLoading(pageOpen ? false : true);
      let elementPath = null;
      if (moduleName === 'contacts') {
        const targetId = elementId?.split(businessId)[0];
        elementPath = `users/${targetId}/connections/${elementId}`;
      } else if (
        moduleName === 'cardsinvoiced' ||
        moduleName === 'cardsuninvoiced' ||
        moduleName === 'cardsexpense'
      ) {
        elementPath = `cards/${elementId}`;
      } else {
        elementPath = `${moduleName}/${elementId}`;
      }
      const pageData = await nodeAxiosFirebase({
        t,
        method: 'POST',
        noAuth: true,
        url: `public/single`,
        errorToast: t('errorLoadingDocument'),
        body: {
          documentPath: elementPath,
          accessCode: accessCode || accessToken,
          businessId: businessId,
          structureId: structureId,
          lang: currentlangCode,
          document: {
            id: elementId,
          },
          height: window.innerHeight,
          device: 'desktop',
          eventData: {},
        },
      });
      setData({
        name: pageData?.[0]?.blocks?.[0]?.mainElement?.name,
        mainColor: pageData?.[0]?.businessDetails?.mainColor,
        secColor: pageData?.[0]?.businessDetails?.secColor,
        businessName: pageData?.[0]?.businessDetails?.name,
        headerText: pageData?.[0]?.blocks?.[0]?.bottomText,
        phone: pageData?.[0]?.blocks?.[0]?.phone,
        address: pageData?.[0]?.blocks?.[0]?.address,
        email: pageData?.[0]?.blocks?.[0]?.email,
      });
      localStorage.setItem(
        'mainColor',
        pageData?.[0]?.businessDetails?.mainColor
      );
      localStorage.setItem(
        'secColor',
        pageData?.[0]?.businessDetails?.secColor
      );
      setAccTabsPublic(pageData || []);
      setIsLoading(false);
      setPageOpen(true);
      setReload(false);
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'edit-block' + editBlockModal?.layout?.i,
          type: 'skeleton',
        })
      );
    } catch (error) {
      setErrorDoc(true);
      console.error(error);
    }
  };

  useEffect(() => {
    if (elementId && structureId && elementId) {
      let updatedBlockLayout = accTabs[activeIndex];
      updatedBlockLayout?.blocks?.forEach((block) => {
        if (block.match === 'id:id') {
          const correspondingData = block?.data;

          correspondingData.forEach((dataItem) => {
            dataItem.value = singleElement[dataItem.structureValue];
          });
        }
      });
      setAccTabs([
        ...accTabs.slice(0, activeIndex),
        updatedBlockLayout,
        ...accTabs.slice(activeIndex + 1),
      ]);
    }
  }, [singleElement?.lastUpdate]);

  const handleAction = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `public/element`,
        noAuth: true,
        body: {
          field: 'status',
          value: parseInt(1),
          elementId: elementId,
          accessCode: accessCode || accessToken,
        },
      });
      let redirectURL = `https://usenode.com/doc/moEZdGEs0ImtMzmwgkoT/cardsuninvoiced/lTk5BpWztIOXvymzCERd/${elementId}?accessCode=${
        accessToken || accessCode
      }&shared=true`;

      setTimeout(() => {
        getDocument();
      }, 1000);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  useEffect(() => {
    if (singleElement?.status !== 1 && businessId === 'moEZdGEs0ImtMzmwgkoT') {
      handleAction();
    }
  }, [singleElement?.status]);

  useEffect(() => {
    if (elementId && structureId && elementId) {
      if (reload === true) {
        setIsLoading(true);
        setTimeout(() => {
          getDocument();
        }, 1000);
      } else {
        getDocument();
      }
    }
  }, [singleElement, elementId, structure, reload]);

  const layoutInitPublic = accTabsPublic[activeIndex]?.blocks || [];
  const mainColor = accTabsPublic?.[0]?.businessDetails?.mainColor || '#000000';
  const secColor = accTabsPublic?.[0]?.businessDetails?.secColor || '#ff0000';

  useEffect(() => {
    if (layoutInitPublic?.length > 0) {
      setLayoutPublic(layoutInitPublic);
    }
  }, [layoutInitPublic]);

  const tabsPublic =
    (accTabsPublic?.length > 0 &&
      accTabsPublic?.map((tab, index) => ({
        label: tab?.name || 'tab' + index,
        value: index,
      }))) ||
    [];

  const handleTabClick = (index) => {
    if (index !== activeIndex) {
      navigate(
        `/doc/${businessId}/${moduleName}/${structureId}/${elementId}?accessCode=${
          accessCode || accessToken
        }&shared=true&tab=${index}`
      );
    }
  };

  const ultraLightColor = chroma(secColor).alpha(0.06).css();

  return (
    <div>
      {currentStatus?.position === 'deletesub-element' &&
        currentStatus?.status === 'loading' && <Loading type="backdrop" />}
      {elementId && isLoading === false ? (
        <div
          style={{
            position: 'relative',
            backgroundColor: ultraLightColor || '#f5f5f5',
          }}
        >
          <div
            style={{
              paddingRight: '20px',
              paddingLeft: '20px',
              borderRadius: '18px',
              textAlign: 'left',
            }}
            className={isMobile ? 'row' : 'd-flex'}
          >
            {isMobile ? (
              <div className="col-md-2 col-12 align-c">
                <div className="d-flex middle-content align-c">
                  <IconButton onClick={handleDropdownToggle}>
                    <MenuIcon />
                  </IconButton>
                  <div>Menu</div>
                </div>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleDropdownToggle}
                >
                  {tabsPublic?.map((tab, index) => (
                    <MenuItem key={index} onClick={() => handleTabClick(index)}>
                      {tab?.label || `Tab ${index}`}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            ) : (
              <div
                style={{
                  borderRadius: '18px',
                  marginTop: '20px',
                  background: '#FFFFFF',
                }}
                className="col-md-2 col-12"
              >
                <div className="align-c mt-5">
                  <div className="d-flex middle-content align-c">
                    <MenuIcon sx={{ fontSize: '15px' }} />
                    <GeneralText
                      text={'Menu'}
                      fontSize="15px"
                      classNameComponent="mt-1 px-2"
                      size="bold"
                      primary={true}
                    />
                  </div>
                  <div
                    style={{
                      height: '73vh',
                      overflowY: 'scroll',
                      overflowX: 'hidden',
                      position: 'relative',
                      marginRight: '-5px',
                    }}
                  >
                    {tabsPublic?.map((tab, index) => (
                      <div key={index} className="d-flex align-left px-4 mt-3">
                        <div
                          className="d-flex align-c hover"
                          onClick={() => handleTabClick(index)}
                        >
                          <GeneralText
                            text={tab?.label || ''}
                            fontSize="14px"
                            size={
                              activeIndex?.toString() === index?.toString()
                                ? 'bold'
                                : 'medium'
                            }
                            primary={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    position: 'relative',
                    marginTop: '12px',
                    paddingBottom: '10vh',
                    paddingLeft: '20px',
                  }}
                >
                  {' '}
                  <div>
                    <img
                      src="/assets/v3/img/icon-node-grey.png"
                      width={70}
                      height={14}
                      className="hover mt-1 mb-1"
                      alt="Node Logo"
                      style={{
                        opacity: 0.6,
                      }}
                    />
                  </div>
                  <div>
                    <Typography
                      variant="caption"
                      fontSize={'10px'}
                      color="#00000085"
                      lineHeight="1"
                      display="block"
                      fontWeight={600}
                      gutterBottom
                    >
                      {'Intelligence Node Canada™'}
                    </Typography>
                    <Typography
                      variant="caption"
                      fontSize={'7px'}
                      color="#00000085"
                      lineHeight="1"
                      display="block"
                      gutterBottom
                    >
                      Version {softwareVersion} - Tous droits réservés.
                    </Typography>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-10 col-12">
              <ElementDetailsContent
                elementData={{
                  id: elementId,
                }}
                displayBorder={accTabsPublic?.[activeIndex]?.displayBorder}
                editMode={editMode}
                currentElementId={elementId}
                elementId={elementId}
                layoutPublic={layoutPublic}
                publicMode={true}
                fromList={true}
                activeIndex={activeIndex}
                refreshDoc={getDocument}
              />{' '}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex p-3">
          <div className="col-4">
            <Skeleton
              variant="rect"
              width="100%"
              height={'35vh'}
              sx={{ borderRadius: '12px' }}
            />
            <div className="mt-2">
              <Skeleton
                variant="rect"
                width="100%"
                height={'47vh'}
                sx={{ borderRadius: '12px' }}
              />
            </div>
          </div>
          <div className="col-5" style={{ paddingLeft: '10px' }}>
            <Skeleton
              variant="rect"
              width="100%"
              height={'40vh'}
              sx={{ borderRadius: '12px' }}
            />
            <div className="mt-2">
              <Skeleton
                variant="rect"
                width="100%"
                height={'42vh'}
                sx={{ borderRadius: '12px' }}
              />
            </div>
          </div>
          <div className="col-3" style={{ paddingLeft: '10px' }}>
            <Skeleton
              variant="rect"
              width="100%"
              height={'15vh'}
              sx={{ borderRadius: '12px' }}
            />{' '}
            <div className="mt-2">
              <Skeleton
                variant="rect"
                width="100%"
                height={'67vh'}
                sx={{ borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicElementDetails;
