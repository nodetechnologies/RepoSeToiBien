import { createTheme } from '@mui/material/styles';
import chroma from 'chroma-js';

const Theme = ({ businessMainColor, businessSecColor, mode, currentUser }) => {
  const validatedColor =
    businessMainColor && chroma.valid(currentUser ? businessMainColor : '#000')
      ? businessMainColor
      : '#1604DD';
  const secondaryColor =
    businessSecColor && chroma.valid(currentUser ? businessSecColor : '#000')
      ? businessSecColor
      : '#1604DD';

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: validatedColor || '#1604DD',
        light: chroma(validatedColor).brighten(3.4).hex(),
        dark: chroma(validatedColor).darken(1).hex(),
        contrastText: '#FFF',
      },
      secondary: {
        main: secondaryColor || '#1604DD',
        contrastText: '#FFF',
      },
      error: {
        main: '#E72B57',
        dark: '#E72B57',
        light: '#E72B57',
        contrastText: '#E72B57',
      },
      success: {
        main: '#BDDC11',
        light: '#BDDC11',
        contrastText: '#668713',
      },
      info: {
        main: '#001752',
        light: '#a3aed0',
      },
      light: {
        main: `${chroma(validatedColor).darken(2).hex()}10`,
      },
      white: {
        main: `#FFF`,
      },
      black: {
        main: `#000`,
        contrastText: '#000',
      },
      divider: 'rgba(168,168,168,0.12)',
      warning: {
        main: '#edbe02',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 700,
        md: 1423,
        lg: 1880,
        xl: 2320,
      },
    },
    typography: {
      fontFamily: "'Montserrat', sans-serif",
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.95)',
      secondary: 'rgba(0, 0, 0, 0.84)',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#333' : '#fff',
            color: mode === 'dark' ? '#fff' : '#333',
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#333' : '#fff',
            color: mode === 'dark' ? '#fff' : '#333',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#333' : '#fff',
            color: mode === 'dark' ? '#fff' : '#333',
            borderRadius: '10px !important',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#333' : '#fff',
            color: mode === 'dark' ? '#fff' : '#333',
          },
        },
      },
    },
  });

  return theme;
};

export default Theme;
