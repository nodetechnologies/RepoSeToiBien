// src/contexts/ThemeContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Theme from '../themeOptions'; // Import your theme configuration function

export const ThemeContext = createContext({});

export const useThemeCont = () => useContext(ThemeContext);

export const CustomThemeProvider = ({
  children,
  mode: initialMode,
  businessMainColor,
  businessSecColor,
}) => {
  const [mode, setMode] = useState(initialMode || 'light');

  // Toggle theme mode between light and dark
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

  // Update primary color dynamically
  const updatePrimaryColor = (color) => {
    if (color !== undefined) {
      localStorage.setItem('mainColor', color);
    }
  };

  const theme = useMemo(
    () =>
      createTheme(
        Theme({
          businessMainColor: businessMainColor,
          businessSecColor: businessSecColor,
          mode,
        })
      ),
    [businessMainColor, mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, updatePrimaryColor }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
