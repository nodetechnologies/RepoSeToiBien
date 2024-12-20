import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { motion } from 'framer-motion';
import * as Icons from '@mui/icons-material';
import chroma from 'chroma-js';
import { useSelector } from 'react-redux';
import { Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Modules = ({
  businessModules,
  isTablet,
  activeModule,
  isDarkMode,
  businessPreference,
  handleEditModule,
  currentSectionState,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { segmentId } = useParams();
  const location = useLocation();
  const pageLoaded = useSelector((state) => state.core.pageLoaded);
  const activeSegment = activeModule?.segments?.find((s) => s.id === segmentId);
  const currentUser = useSelector((state) => state.core.user);

  const RestrictedModule = ({ children }) => {
    if (
      currentSectionState === 'SETTINGS' ||
      currentSectionState === 'TOOLS' ||
      currentSectionState === 'MYNODE' ||
      currentSectionState === 'NODE'
    ) {
      return null;
    }
    return children;
  };

  const handleClickSegment = (finalSettingsUrl, segment) => {
    const url = finalSettingsUrl + '/' + segment.id;
    navigate(url);
  };

  const currentUserPerm = currentUser?.activeBusiness?.role;

  const filtredModules =
    businessModules?.length > 0 &&
    businessModules?.filter((module) => {
      if (
        (currentUserPerm === 'EMPLOYEE' || currentUserPerm === 'VIEWER') &&
        (module?.url.startsWith('/operations/contacts') ||
          module?.url.startsWith('/operations/services') ||
          module?.url.startsWith('/operations/articles') ||
          module?.url.startsWith('/operations/storages') ||
          module?.url.startsWith('/operations/tasks') ||
          module?.url.startsWith('/operations/items') ||
          module?.url.startsWith('/operations/profiles') ||
          module?.url.startsWith('/operations/payments') ||
          module?.url.startsWith('/finances/items') ||
          module?.url.startsWith('/finances/payments') ||
          module?.url.startsWith('/mynode') ||
          module?.url.startsWith('/settings'))
      ) {
        return false;
      }
      return true;
    });

  return (
    <>
      {filtredModules?.length > 0 &&
        filtredModules?.map((module, index) => {
          const IconComponent = Icons[module.icon] || Icons.Error;
          const finalSettingsUrl = '/app' + (module?.url || '/links/' + index);

          // Animation settings
          const animationProps = {
            initial:
              pageLoaded == true
                ? { opacity: 1, y: 0 }
                : { opacity: 0, x: -20 },
            animate:
              pageLoaded == true ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 },
            transition:
              pageLoaded == true ? {} : { delay: index * 0.2, duration: 0.5 },
          };

          return (
            <motion.div
              key={module.id + index + 'module' + module?.link}
              style={{
                paddingTop: '0.15rem',
                paddingBottom: '0.15rem',
              }}
              {...animationProps}
            >
              <div
                style={{
                  borderRadius: '10px 0px 0px 10px',
                  backgroundColor:
                    activeModule?.id === module?.id ||
                    '/app' + module?.url === location?.pathname
                      ? businessPreference?.mainColor + '15'
                      : 'transparent',
                  transition: 'background-color 0.3s, color 0.3s',
                }}
                className="module-container"
              >
                <div
                  style={{
                    padding: '6px',
                  }}
                  className={` ${
                    isTablet ? 'd-flex align-c' : 'd-flex'
                  } hover align-c`}
                >
                  <div
                    onClick={() => navigate(finalSettingsUrl)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      height: '100%',
                    }}
                  >
                    <Tooltip title={t(module.name)}>
                      <IconComponent
                        htmlColor={isDarkMode ? '#FFF' : '#000'}
                        sx={{
                          paddingRight: isTablet ? '1px' : '3px',
                          fontSize: '23px',
                        }}
                      />
                    </Tooltip>
                  </div>
                  {!isTablet && (
                    <div
                      style={{ marginTop: '2px' }}
                      className="row d-flex parent-element justify-content-between px-3"
                    >
                      <div className="col-10 align-left ">
                        <Typography
                          onClick={() => navigate(finalSettingsUrl)}
                          fontWeight={
                            activeModule?.id === module?.id ||
                            '/app' + module?.url === location?.pathname
                              ? 600
                              : 500
                          }
                          fontSize="14px"
                          sx={{
                            '&:hover': {
                              fontWeight: 700,
                            },
                          }}
                          color={isDarkMode ? '#FFF' : '#000'}
                          variant="body2"
                        >
                          {module?.name}
                        </Typography>
                        {!isTablet && (
                          <>
                            {module?.segments &&
                              module?.segments?.length > 0 && (
                                <div>
                                  {module?.segments?.map((segment, index) => (
                                    <div
                                      key={index + 'segment'}
                                      className="align-left"
                                      onClick={() =>
                                        handleClickSegment(
                                          finalSettingsUrl,
                                          segment
                                        )
                                      }
                                    >
                                      <div className="d-flex middle-content">
                                        {activeSegment?.id === segment?.id && (
                                          <Icons.FilterListOutlined
                                            fontSize="10px"
                                            sx={{
                                              marginRight: '5px',
                                              marginLeft: '-20px',
                                              marginTop: '-1px',
                                            }}
                                          />
                                        )}
                                        <Typography
                                          fontWeight={
                                            activeSegment?.id === segment?.id
                                              ? 500
                                              : 400
                                          }
                                          fontSize="10px"
                                          className="hover"
                                          sx={{
                                            '&:hover': {
                                              fontWeight: 500,
                                            },
                                          }}
                                          color={
                                            isDarkMode
                                              ? '#FFFFFF95'
                                              : '#00000095'
                                          }
                                          variant="body2"
                                        >
                                          {segment?.name}
                                        </Typography>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </>
                        )}
                      </div>

                      <RestrictedModule>
                        <div
                          onClick={() => handleEditModule(module)}
                          className="col-2 align-right settings-icon-container"
                        >
                          <Icons.TuneOutlined
                            fontSize="10px"
                            htmlColor="lightgray"
                            sx={{
                              marginTop: '3px',
                              '&:hover': {
                                color: isDarkMode
                                  ? '#FFF'
                                  : `${businessPreference?.mainColor}`,
                              },
                            }}
                          />
                        </div>
                      </RestrictedModule>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      <style>
        {`
        .module-container:hover {
          background-color: ${businessPreference?.mainColor + '15'} !important;
        }

        .module-container:hover .MuiSvgIcon-root,
        .module-container:hover .MuiTypography-root {
          color: ${
            isDarkMode ? '#FFF' : `${businessPreference?.mainColor}`
          } !important;
        }
      `}
      </style>
    </>
  );
};

export default Modules;
