// Libraries
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Icons from '@mui/icons-material';
import { Grid, Button } from '@mui/material';

// Components
import TextField from '../../stories/general-components/TextField';
import DrawerSide from '../../stories/layout-components/DrawerSide';

const IconSelector = ({ handleCloseIcon, isOpen, handleClose }) => {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');

  function debounce(func, wait) {
    let timeout;

    const debounced = function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };

    debounced.cancel = function () {
      clearTimeout(timeout);
    };

    return debounced;
  }

  const debouncedSetQuery = debounce((nextValue) => setQuery(nextValue), 500);

  useEffect(() => {
    return () => debouncedSetQuery.cancel();
  }, [debouncedSetQuery]);

  // Handle search input change
  const handleSearchChange = (event) => {
    const { value } = event.target;
    debouncedSetQuery(value);
  };

  const handleUpdateIcon = async (iconName) => {
    if (iconName) {
      handleCloseIcon(iconName);
    } else {
      handleClose();
    }

    setQuery('');
  };

  const filteredIcons = Object.keys(Icons)
    ?.filter(
      (key) =>
        key.toLowerCase().includes(query.toLowerCase()) &&
        key.includes('Outlined')
    )
    ?.map((iconName) => {
      const IconComponent = Icons[iconName];
      return (
        <Grid
          item
          xs={2}
          key={iconName}
          style={{ textAlign: 'center', margin: '10px' }}
        >
          <Button onClick={() => handleUpdateIcon(iconName)}>
            <IconComponent sx={{ fontSize: 35 }} />
          </Button>
        </Grid>
      );
    });

  return (
    <DrawerSide
      isDrawerOpen={isOpen}
      handleDrawerClose={handleUpdateIcon}
      noAction
    >
      <div>
        <TextField
          fullWidth
          label={t('search')}
          variant="outlined"
          defaultValue={query}
          onChange={handleSearchChange}
          style={{ marginBottom: '20px' }}
        />
        <Grid container spacing={2}>
          {filteredIcons}
        </Grid>
      </div>
    </DrawerSide>
  );
};

export default IconSelector;
