import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import Button from '../../../../stories/general-components/Button';

const Facets = ({
  activeModule,
  businessPreference,
  setSelectedFacet,
  selectedFacet,
  activeStructure,
  moduleName,
  setRefresh,
}) => {
  const { t, i18n } = useTranslation();
  const [facetsData, setFacetsData] = useState([]);
  const currentLangCode = i18n.language;

  const handleFacetChange = (key, value) => {
    if (selectedFacet?.key === key && selectedFacet?.value === value) {
      setSelectedFacet({});
    } else {
      setSelectedFacet({ key, value });
    }
  };

  const employees = businessPreference?.employees;
  const locations = businessPreference?.locations;
  const categories = businessPreference?.categories;
  const tags = businessPreference?.tags;
  const prefixes = businessPreference?.prefixes;
  const articlesTypes = [
    {
      name: 'generic',
      id: 0,
    },
    {
      name: 'regular',
      id: 1,
    },
  ];

  //find status field
  const statuses = activeStructure?.fields?.find(
    (field) => field?.typeData === 'status'
  )?.selections;

  //get facets section title
  function getLabel(key) {
    const fields = activeStructure?.fields;
    const field = fields?.find((field) => field?.value === key);
    return field ? field[`name_${currentLangCode}`] : t(key);
  }

  const [visibleCount, setVisibleCount] = useState({});

  function listResolver(
    employees,
    locations,
    categories,
    statuses,
    prefixes,
    tags,
    articlesTypes
  ) {
    switch (moduleName) {
      case 'contacts':
        return {
          targetPrefix: prefixes,
          tags: tags,
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      case 'services':
        return {
          categoryName: categories,
          tags: tags,
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      case 'articles':
        return {
          categoryName: categories,
          tags: tags,
          articleType: articlesTypes,
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      case 'storages':
        return { tags: tags };
      case 'cardsinvoiced':
        return {
          assignedToId: employees,
          status: statuses,
          tags: tags,
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      case 'cardsexpense':
        return {
          assignedToId: employees,
          status: statuses,
          tags: tags,
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      case 'cardsuninvoiced':
        return {
          assignedToId: employees,
          status: statuses,
          tags: tags,
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      case 'profiles':
        return {
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      case 'nodies':
        return {
          assignedToId: employees,
          status: statuses,
          tags: tags,
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      case 'tasks':
        return {
          tags: tags,
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      case 'grids':
        return {
          tags: tags,
          status: statuses,
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      case 'passes':
        return {
          assignedToId: employees,
          status: statuses,
          locationName: locations,
          tags: tags,
          isFeatured: [
            {
              name: t('isFeatured'),
              id: true,
            },
          ],
        };
      default:
        return null;
    }
  }

  useEffect(() => {
    const list = listResolver(
      employees,
      locations,
      categories,
      statuses,
      prefixes,
      tags,
      articlesTypes
    );
    setFacetsData(list);

    // Initialize visibleCount based on the keys from the resolved list
    const initialVisibleCount = {};
    list &&
      Object?.keys(list)?.forEach((key) => {
        initialVisibleCount[key] = 12;
      });
    setVisibleCount(initialVisibleCount);
  }, [activeModule]);

  const showMoreFacets = (key) => {
    setVisibleCount((prev) => ({
      ...prev,
      [key]: (prev[key] || 12) + 12,
    }));
  };

  return (
    <PerfectScrollbar>
      <div className="p-3">
        {facetsData &&
          Object?.entries(facetsData)?.map(([key, values]) => {
            const limitedValues = values?.slice(0, visibleCount[key] || 12);

            const formattedValue = limitedValues?.map((value) => {
              return {
                name:
                  value?.name ||
                  value?.displayName ||
                  value?.publicDisplay?.name ||
                  value?.label ||
                  value,
                value:
                  key === 'categoryName'
                    ? value?.name
                    : key === 'locationName'
                    ? value?.name
                    : key === 'status'
                    ? value?.value
                    : key === 'articleType'
                    ? value?.id
                    : value?.id || value?.uid || value,
              };
            });

            return (
              <div key={key} className="mb-3">
                <Typography fontSize="13px" fontWeight={600} variant="h6">
                  {getLabel(key)}
                </Typography>
                {formattedValue?.map((value, index) => (
                  <div key={key + index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFacet?.value === value?.value}
                          onChange={() => handleFacetChange(key, value?.value)}
                          size="small"
                          sx={{
                            padding: '6px',
                            marginLeft: '5px',
                          }}
                        />
                      }
                      label={`${value?.name}`}
                      sx={{
                        width: '100%',
                        '.MuiFormControlLabel-label': {
                          margin: '0px',
                          width: '100%',
                          display: 'flex',
                          fontSize: '12px',
                        },
                      }}
                    />
                    <Divider component="div" />
                  </div>
                ))}
                {values?.length > (visibleCount[key] || 12) && (
                  <Button
                    variant="text"
                    size="small"
                    label={t('showMore')}
                    onClick={() => showMoreFacets(key)}
                    sx={{ mt: 2 }}
                  />
                )}
              </div>
            );
          })}
      </div>
    </PerfectScrollbar>
  );
};

export default Facets;
