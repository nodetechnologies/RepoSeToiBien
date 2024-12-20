import React, { useState, useEffect, useRef } from 'react';
import ButtonMUI from '@mui/material/Button';
import * as Icons from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';

export const Button = ({
  size,
  label,
  onClick,
  type,
  delay,
  disabled,
  endIcon,
  onMouseDown,
  buttonSx,
  variant,
  startIcon,
  disableRipple,
  success,
  fullWidth,
}) => {
  const [loading, setLoading] = useState(false);
  const timer = useRef();
  const IconComponent = Icons[endIcon];
  const IconComponentStart = Icons[startIcon];

  const handleClick = async (e) => {
    if (!loading) {
      setLoading(true);
      await onClick(e);
    }
  };

  useEffect(() => {
    if (loading) {
      if (success) {
        setLoading(false);
      } else {
        timer.current = setTimeout(() => {
          setLoading(false);
        }, delay || 2000);
      }
    }
    return () => {
      clearTimeout(timer.current);
    };
  }, [loading, success]);

  return (
    <ButtonMUI
      fullWidth={fullWidth}
      disableElevation
      onMouseDown={onMouseDown}
      variant={variant || 'contained'}
      type={type}
      sx={{ ...buttonSx, height: '35px', borderRadius: '14px' }}
      disableTouchRipple={disableRipple}
      disableRipple={disableRipple}
      onClick={handleClick}
      size={size || 'medium'}
      disabled={disabled || loading}
      startIcon={IconComponentStart && <IconComponentStart />}
      endIcon={IconComponent && <IconComponent />}
      color={loading ? 'light' : 'secondary'}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : label}
    </ButtonMUI>
  );
};

export default React.memo(Button);
