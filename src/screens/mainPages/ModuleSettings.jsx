import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

import Checkbox from '../../stories/general-components/Checkbox';
import { FormControl, InputLabel } from '@mui/material';
import TextField from '../../stories/general-components/TextField';
import Select from '../../stories/general-components/Select';

const ModuleSettings = ({
  preferences,
  pageModel,
  formData,
  setFormData,
  statuses,
  collection,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const currentLangCode = i18n.language;

  const isDarkmode = theme.palette.mode === 'dark';

  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  return (
    <div style={{ width: '96%' }}>
      {(pageModel === 'kanban' ||
        pageModel === 'listA' ||
        pageModel === 'listF' ||
        pageModel === 'list') && (
        <div>
          <Checkbox
            label={t('displayTotal')}
            value={formData?.displayTotal}
            onBlur={(e) =>
              setFormData({ ...formData, displayTotal: e.target.checked })
            }
          />
        </div>
      )}
      {pageModel === 'kanban' && (
        <div>
          <div>
            <Checkbox
              label={t('displaySearch')}
              value={formData?.displaySearch}
              onBlur={(e) =>
                setFormData({ ...formData, displaySearch: e.target.checked })
              }
            />
          </div>
        </div>
      )}

      <div>
        <Checkbox
          label={t('displayRefresh')}
          value={formData?.displayRefresh}
          onBlur={(e) =>
            setFormData({ ...formData, displayRefresh: e.target.checked })
          }
        />
      </div>
      <div>
        <Checkbox
          label={t('displayQuickView')}
          value={formData?.displayQuickView}
          onBlur={(e) =>
            setFormData({ ...formData, displayQuickView: e.target.checked })
          }
        />
      </div>
      {(pageModel === 'calendar' || pageModel === 'kanban') && (
        <div>
          <div>
            <Checkbox
              label={t('backToToday')}
              value={formData?.backToToday}
              onBlur={(e) =>
                setFormData({ ...formData, backToToday: e.target.checked })
              }
            />
          </div>
        </div>
      )}
      {(collection === 'contacts' ||
        collection === 'grids' ||
        collection === 'articles' ||
        collection === 'services') && (
        <div>
          <Checkbox
            label={t('displayImport')}
            value={formData?.displayImport}
            onBlur={(e) =>
              setFormData({ ...formData, displayImport: e.target.checked })
            }
          />
        </div>
      )}
      {collection === 'passes' && (
        <div>
          <Select
            select
            staticView
            noEmpty
            key={'viewType'}
            label={t('viewType')}
            value={formData?.viewType}
            selections={[
              {
                label: t('resources'),
                value: 'resources',
                id: 'resources',
              },
              {
                label: t('employees'),
                value: 'employees',
                id: 'employees',
              },
            ]}
            onChange={(e, value) =>
              setFormData({ ...formData, viewType: value })
            }
            fullWidth
          />
        </div>
      )}
      <div>
        <Checkbox
          label={t('displayFilter')}
          value={formData?.displayFilter}
          onBlur={(e) =>
            setFormData({ ...formData, displayFilter: e.target.checked })
          }
        />
      </div>
      {/* {(pageModel === 'kanban' || pageModel === 'calendar') && (
        <div>
          <Selection
            value={formData?.dateField}
            onChange={(e, value) =>
              setFormData({ ...formData, dateField: value })
            }
            field={{
              typeData: 'selectionNode',
              required: false,
            }}
            selections={[
              {
                label: t('lastUpdate'),
                value: 'lastUpdate',
                id: 'lastUpdate',
                color: '#000000',
              },
              {
                label: t('timeStamp'),
                value: 'timeStamp',
                id: 'timeStamp',
                color: '#000000',
              },
              {
                label: t('startDate'),
                value: 'startDate',
                id: 'startDate',
                color: '#000000',
              },
            ]}
            label={t('dateFieldOrder')}
          />
        </div>
      )}
      {(pageModel === 'kanban' || pageModel === 'calendar') && (
        <div>
          <Select
            value={formData?.rangeDates}
            onChange={(e, value) =>
              setFormData({ ...formData, rangeDates: value })
            }
            noEmpty
            selections={[
              {
                label: t('none'),
                value: 'none',
                id: 'none',
                color: '#000000',
              },
              {
                label: t('singleRange'),
                value: 'single',
                id: 'single',
                color: '#000000',
              },
              {
                label: t('weekRange'),
                value: 'week',
                id: 'week',
                color: '#000000',
              },

              {
                label: t('tenDaysRange'),
                value: 'tenDays',
                id: 'tenDays',
                color: '#000000',
              },
            ]}
            label={t('rangeOfDates')}
          />
        </div>
      )} */}
      <div>
        <TextField
          label={t('limitPagination')}
          fullWidth
          help={t('limitPaginationHelp')}
          type="number"
          value={formData?.limit}
          onChange={(e) => {
            setFormData({
              ...formData,
              limit: Number(e.target.value),
            });
          }}
        />
      </div>
      {statuses && (
        <div>
          <FormControl
            sx={{
              marginLeft: '1px',
              border: '1px solid lightgray',
              borderRadius: '10px',
              width: '99.8%',
              fontSize: '13px',
              minHeight: '42px',
              padding: '3px',
              marginTop: '12px',
              marginBottom: '10px',
            }}
            fullWidth
          >
            <InputLabel
              shrink={true}
              sx={{
                backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
                padding: '2px 5px 2px 5px',
                borderRadius: '10px',
              }}
            >
              {t('statusesToHide')}
            </InputLabel>
            {statuses?.map((status, index) => (
              <div key={index}>
                <Checkbox
                  label={status?.['label_' + currentLangCode]}
                  value={formData?.statusesToHide?.[status?.value]}
                  onBlur={(e) =>
                    setFormData({
                      ...formData,
                      statusesToHide: {
                        ...formData?.statusesToHide,
                        [status?.value]: e.target.checked,
                      },
                    })
                  }
                />
              </div>
            ))}
          </FormControl>
        </div>
      )}
    </div>
  );
};

export default ModuleSettings;
