import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Divider, Typography, Grid, Skeleton } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { MoreVert } from '@mui/icons-material';
import { useWindowSize } from 'react-use';
import { motion } from 'framer-motion';
import Loading from '../general-components/Loading';

const Blocks = ({
  mode,
  backgroundColor,
  className,
  noPadding,
  isLoading,
  empty,
  noScroll,
  noBorder,
  emptyType,
  noStyle,
  blockType,
  noShadow,
  messagesRef,
  title,
  emptyMessage,
  noBtn,
  fullBG,
  onClickAdd,
  onClickMore,
  clickable,
  lastBottom,
  gridProps,
  heightPercentage,
  ...props
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { t } = useTranslation();
  const { width, height } = useWindowSize();

  const currentUser = useSelector((state) => state.core.user);
  const businessPreference = useSelector((state) => state.core.businessData);
  const activeUser = businessPreference?.employees?.find(
    (employee) => employee.id === currentUser?.uid
  );

  const skeletonVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const [calculatedHeightContent, setCalculatedHeightContent] =
    useState('auto');

  useEffect(() => {
    const availableHeight = height - 100;
    const calculatedHeightPrimary = (availableHeight * heightPercentage) / 100;
    setCalculatedHeightContent(calculatedHeightPrimary);
  }, [height, heightPercentage]);

  return (
    <ErrorBoundary>
      <Grid item {...gridProps}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            padding: noPadding ? '0px' : '20px 0px 20px 20px',
          }}
        >
          <div
            style={{
              backgroundColor:
                activeUser?.preferences?.blur === 0
                  ? isDarkMode
                    ? '#1a1a1a'
                    : '#FFF'
                  : isDarkMode
                  ? '#1a1a1a'
                  : 'rgba(255, 255, 255, 0.65)',
              boxShadow: noShadow
                ? ''
                : activeUser?.preferences?.blur === 0
                ? ''
                : ` 4px  4px 10px rgba(0, 0, 0, 0.035)`,
              border: noBorder ? '' : `1px solid rgba(255, 255, 255, 0.3)`,
              backdropFilter:
                activeUser?.preferences?.blur === 0 ? '' : 'blur(5.8px)',
              borderRadius: '10px',
              overflowY: 'auto',
              overflowX: 'hidden',
              cursor: clickable ? 'pointer' : 'default',
            }}
          >
            {isLoading && !blockType && <Loading type="circle" size="medium" />}
            {isLoading && blockType && (
              <>
                {blockType === 'list' && (
                  <motion.div
                    variants={skeletonVariants}
                    initial="hidden"
                    animate={isLoading ? 'show' : 'hidden'}
                  >
                    {isLoading &&
                      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                        <motion.div
                          variants={childVariants}
                          key={index}
                          className="mx-2 mt-2"
                        >
                          <Skeleton
                            animation="wave"
                            variant="rectangular"
                            width={'100%'}
                            height={45}
                          />
                        </motion.div>
                      ))}
                  </motion.div>
                )}
              </>
            )}
            <div>
              {title && (
                <div
                  className="middle-content"
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    minHeight: isTablet ? '20px' : '30px',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <Typography
                      sx={{ marginLeft: '10px' }}
                      fontSize="12px"
                      fontWeight={600}
                      variant="h6"
                    >
                      {title}
                    </Typography>
                    <div className="align-right">
                      {onClickAdd && (
                        <IconButton color="primary" onClick={onClickAdd}>
                          <AddIcon fontSize={isTablet ? '10px' : 'small'} />
                        </IconButton>
                      )}
                      {!noBtn && (
                        <IconButton color="primary" onClick={onClickMore}>
                          <MoreVert fontSize={isTablet ? '10px' : 'small'} />
                        </IconButton>
                      )}
                    </div>
                  </div>
                  <Divider component="div" />
                </div>
              )}

              {empty ? (
                <div
                  style={{
                    overflow: 'hidden',
                    padding: '1px',
                    height: calculatedHeightContent,
                    minHeight: calculatedHeightContent,
                    maxHeight: calculatedHeightContent,
                  }}
                  className={className + ' row'}
                >
                  <div
                    className={
                      isTablet ? 'align-center mt-2' : 'align-center mt-3'
                    }
                  >
                    <img
                      src={
                        emptyType === 'select'
                          ? `/assets/v3/img/empty-state-${theme.palette.mode}.png`
                          : `/assets/v3/img/no-result-${theme.palette.mode}.png`
                      }
                      width={isTablet ? 80 : 100}
                      height={isTablet ? 80 : 100}
                      alt="empty state"
                      className={isTablet ? 'mt-2' : 'mt-4'}
                    />
                    <div className="mb-2">
                      <Typography
                        variant="h6"
                        fontSize={isTablet ? '12px' : '14px'}
                        component="div"
                        textAlign={'center'}
                      >
                        {t('empty' + emptyType)}
                      </Typography>
                    </div>
                    <div className="mb-2">
                      <Typography
                        variant="body2"
                        fontSize={isTablet ? '9px' : '11px'}
                        component="div"
                        textAlign={'center'}
                      >
                        {emptyMessage || ''}
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    overflow: noScroll ? 'hidden' : 'scroll',
                    padding: noPadding ? '0px' : '8px',
                    height: calculatedHeightContent,
                    minHeight: calculatedHeightContent,
                    maxHeight: calculatedHeightContent,
                  }}
                >
                  {!isLoading && !empty && <>{props.children}</>}
                </div>
              )}
            </div>
          </div>
        </Paper>
      </Grid>
    </ErrorBoundary>
  );
};

export default Blocks;
