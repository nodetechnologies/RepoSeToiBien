import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';
import softwareList from '../../../utils/softwaresList';
import { Input, Paper, TextField } from '@material-ui/core';
import { Checkbox, FormControl, InputAdornment } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';

const ListSection = ({ handleSearch, isDarkMode, inputSearchValue }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const [selectedCategories, setSelectedCategories] = useState([]);

  const websiteData = useSelector((state) => state.website.data);

  const filteredSoftwareList =
    selectedCategories?.length > 0
      ? softwareList?.filter((software) => {
          return selectedCategories.includes(software?.category);
        })
      : softwareList?.filter((software) => {
          return software.name
            .toLowerCase()
            .includes(inputSearchValue.toLowerCase());
        });

  const categories = [
    'marketing',
    'operations',
    'productivity',
    'hr',
    'finances',
  ];

  return (
    <div>
      <div className="mt-5 row">
        <div className="col-md-3 col-12">
          <Typo
            variant="h3"
            text={
              websiteData?.integrations?.categoriesTitle || t('categoriesTitle')
            }
          />
          <div>
            {categories.map((category, index) => (
              <div
                key={index}
                className="mt-3 d-flex middle-content"
                onClick={() => {
                  if (selectedCategories.includes(category)) {
                    setSelectedCategories(
                      selectedCategories.filter((cat) => cat !== category)
                    );
                    handleSearch({ target: { value: '' } });
                  } else {
                    setSelectedCategories([...selectedCategories, category]);
                    handleSearch({ target: { value: '' } });
                  }
                }}
              >
                <Checkbox
                  color="primary"
                  checked={selectedCategories.includes(category)}
                  sx={{ padding: '0px', marginRight: '5px' }}
                />

                <Typo variant="p" text={t(category)} className="hover" />
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-9 col-12">
          <div className="row">
            {filteredSoftwareList?.map((software, index) => (
              <div key={index} className="col-md-3 col-6 mt-3 align-c">
                <Paper
                  elevation={0}
                  style={{
                    backgroundColor: isDarkMode ? '#333' : '#FFF',
                    padding: '20px',
                    borderRadius: '10px',
                  }}
                >
                  <img
                    src={software?.logo}
                    height={'45px'}
                    alt={software?.name}
                  />
                  <Typo variant="p" text={software?.name} className="mt-2" />
                </Paper>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListSection;
