import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';
import softwareList from '../../../utils/softwaresList';
import { TextField, InputAdornment, FormControl } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';

const HeaderSection = ({ handleSearch, isDarkMode, inputSearchValue }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  return (
    <div>
      <div className="row" style={{ minHeight: '250px', paddingTop: '75px' }}>
        <div className="col-12 col-md-6 mt-3 d-flex flex-column justify-content-between">
          <div className="mb-5">
            <div className="mt-3">
              <Typo
                variant="h1"
                text={
                  websiteData?.integrations?.headerTitle || t('headerTitle')
                }
              />
            </div>
          </div>
          <FormControl
            sx={{
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF',
              borderRadius: '30px',
              minWidth: '100%',
              padding: '8px',
            }}
            fullWidth
          >
            <TextField
              value={inputSearchValue}
              onChange={handleSearch}
              placeholder={t('search')}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined
                      sx={{
                        color: isDarkMode ? '#FFF' : '#000',
                        fontSize: '21px',
                        marginLeft: '5px',
                      }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  padding: '8px',
                  color: isDarkMode ? '#FFF' : '#696969',
                  '&::placeholder': {
                    color: isDarkMode ? '#FFF' : '#696969',
                  },
                },
              }}
              sx={{
                borderRadius: '30px',
                height: '45px',
                fontSize: '13px',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF',
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#FFF' : '#696969',
                },
              }}
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
