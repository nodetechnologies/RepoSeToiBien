import React from 'react';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Import the arrow icon
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Btn = ({ variant, text, onClick }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Button
      disableElevation
      sx={{
        width: '300px',
        borderRadius: '50px',
        display: 'flex',
        fontSize: '14px',
        fontWeight: 500,
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'none',
      }}
      variant="contained"
      color="primary"
      onClick={onClick}
    >
      {text}
      <ArrowForwardIcon sx={{ marginLeft: 1 }} />
    </Button>
  );
};

export default Btn;
