import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { intersection, difference } from 'lodash';
import { useParams } from 'react-router';
import { useTheme } from '@mui/material/styles';
import TextField from '../general-components/TextField';
import Selection from '../general-components/Selection';
import Button from '../general-components/Button';
import GeneralText from '../general-components/GeneralText';
import Select from '../general-components/Select';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import ButtonMUI from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { FormControl, InputLabel } from '@mui/material';
import { CheckBoxOutlined, RemoveCircleOutline } from '@mui/icons-material';

const RequestChanges = ({
  formData,
  setFormData,
  handleSend,
  structureId,
  existingFields,
}) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const currentlangCode = i18n.language;
  const { elementId } = useParams();
  const [moduleData, setModuleData] = useState({});
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const fields = moduleData?.fields || [];

  const isDarkmode = theme.palette.mode === 'dark';

  useEffect(() => {
    if (fields.length > 0) {
      const leftFields = [];
      const rightFields = [];

      fields.forEach((field) => {
        if (existingFields.includes(field?.value)) {
          rightFields.push(field);
        } else {
          leftFields.push(field);
        }
      });

      setLeft(leftFields);
      setRight(rightFields);
    }
  }, [fields]);

  const getData = async () => {
    try {
      const data = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/layout`,
        body: {
          lang: currentlangCode,
          structureId: structureId,
          currentElementId: elementId,
        },
      });
      setModuleData(data);
    } catch (error) {
      console.error('Error get example');
    }
  };

  useEffect(() => {
    getData();
  }, [structureId, elementId]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useEffect(() => {
    if (fields.length > 0) {
      setFormData({
        ...formData,
        fields: right?.map((field) => {
          return {
            id: field?.id,
            name_en: field?.name_en,
            name_fr: field?.name_fr,
            typeData: field?.typeData,
            value: field?.value ?? '',
          };
        }),
      });
    }
  }, [right]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(difference(left, leftChecked));
    setChecked(difference(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(difference(right, rightChecked));
    setChecked(difference(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (items) => (
    <Paper elevation={0} sx={{ width: 225, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items?.map((value) => {
          const labelId = `transfer-list-item-${value?.name_fr}-label`;

          return (
            <ListItemButton
              key={value?.id} // Ensure unique key
              dense
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value?.name_fr}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <div>
      <GeneralText
        text={t('requestChangesText')}
        primary={true}
        size="regular"
        fontSize="11px"
        classNameComponent="px-2"
      />

      <div className="mt-3">
        <TextField
          label={t('giveTitleChanges')}
          value={formData?.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          variant="outlined"
          fullWidth
        />
      </div>
      <div>
        <Selection
          value={formData?.priority}
          onChange={(e, value) => setFormData({ ...formData, priority: value })}
          field={{
            typeData: 'selectionNode',
            required: false,
          }}
          selections={[
            {
              label: 'Standard',
              value: 'standard',
              id: 'standard',
              color: '#000000',
            },
            {
              label: 'Important',
              value: 'important',
              id: 'important',
              color: '#FFA500',
            },
            {
              label: 'Urgent',
              value: 'urgent',
              id: 'urgent',
              color: '#FF0000',
            },
          ]}
          label={t('priority')}
        />
      </div>
      <div>
        <Select
          value={formData?.type}
          size="small"
          noEmpty
          fullWidth
          onChange={(e, value) =>
            setFormData({
              ...formData,
              type: value,
            })
          }
          label={t('type')}
          selections={[
            {
              label: t('fields'),
              id: 'fields',
              value: 'fields',
            },
            {
              label: t('other'),
              id: 'other',
              value: 'other',
            },
          ]}
        />
      </div>
      {formData?.type === 'fields' && (
        <div className="mt-2 mb-4">
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
              {t('fields')}
            </InputLabel>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <div className="align-c">
                  <div className="mt-2 d-flex middle-content">
                    <RemoveCircleOutline
                      fontSize="10px"
                      className="error-text"
                      sx={{ marginLeft: '25px' }}
                    />
                    <GeneralText
                      text={t('toBeRemoved')}
                      primary={true}
                      size="medium"
                      fontSize="11px"
                      classNameComponent="error-text px-3"
                    />
                  </div>
                  {customList(left)}
                </div>
              </Grid>
              <Grid item>
                <Grid container direction="column" alignItems="center">
                  <ButtonMUI
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleAllRight}
                    disabled={left?.length === 0}
                    aria-label="move all right"
                  >
                    ≫
                  </ButtonMUI>
                  <ButtonMUI
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleCheckedRight}
                    disabled={leftChecked?.length === 0}
                    aria-label="move selected right"
                  >
                    &gt;
                  </ButtonMUI>
                  <ButtonMUI
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleCheckedLeft}
                    disabled={rightChecked?.length === 0}
                    aria-label="move selected left"
                  >
                    &lt;
                  </ButtonMUI>
                  <ButtonMUI
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleAllLeft}
                    disabled={right?.length === 0}
                    aria-label="move all left"
                  >
                    ≪
                  </ButtonMUI>
                </Grid>
              </Grid>
              <Grid item>
                <div className="align-c">
                  <div className="mt-2 d-flex middle-content">
                    <CheckBoxOutlined
                      sx={{ marginLeft: '25px' }}
                      fontSize="10px"
                      className="success-text"
                    />
                    <GeneralText
                      text={t('mustBeListed')}
                      primary={true}
                      size="medium"
                      fontSize="11px"
                      classNameComponent="success-text px-3"
                    />
                  </div>
                  {customList(right)}
                </div>
              </Grid>
            </Grid>
          </FormControl>
        </div>
      )}
      <div>
        <TextField
          label={t('changes')}
          value={formData?.requestChanges}
          onChange={(e) =>
            setFormData({ ...formData, requestChanges: e.target.value })
          }
          multiline
          handleKeyPress={() => {}}
          help={t('changesHelp')}
          rows={4}
          variant="outlined"
          fullWidth
        />
      </div>
      <div className="mt-4">
        <Button
          label={t('submit')}
          onClick={handleSend}
          color={theme.palette.primary.main}
          variant="contained"
          fullWidth
        />
      </div>
    </div>
  );
};

export default RequestChanges;
