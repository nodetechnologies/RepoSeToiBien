import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Lottie from 'react-lottie';
import loadingAnimation from '../../lotties/nodeLoading.json';
import { Backdrop, Skeleton } from '@mui/material';

function Loading({ type, size }) {
  const resolver = (size) => {
    switch (size) {
      case 'x-small':
        return 30;
      case 'small':
        return 100;
      case 'medium':
        return 200;
      case 'large':
        return 300;
      default:
        return 100;
    }
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {type === 'circle' ? (
        <CircularProgress
          color="primary"
          size={size === 'small' ? 20 : size === 'medium' ? 50 : 70}
        />
      ) : type === 'skeleton' ? (
        <Skeleton
          variant="rectangular"
          height={
            size === 'small' ? '20px' : size === 'medium' ? '50px' : '70px'
          }
          width={
            size === 'small' ? '50px' : size === 'medium' ? '1000px' : '170px'
          }
        />
      ) : type === 'logo' ? (
        <Lottie
          options={lottieOptions}
          height={resolver(size)}
          width={resolver(size)}
        />
      ) : type === 'backdrop' ? (
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Lottie
          options={lottieOptions}
          height={resolver(size)}
          width={resolver(size)}
        />
      )}
    </Box>
  );
}
export default Loading;
