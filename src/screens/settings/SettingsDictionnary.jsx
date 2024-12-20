import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { db } from '../../firebase';
import { addDoc, doc, setDoc, updateDoc, collection } from 'firebase/firestore';

import { defaultTerms } from '../../utils/terms'; // Make sure this imports an object, not an array

import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import {
  Box,
  Button,
  Divider,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import TextField from '../../stories/general-components/TextField';
import {
  fetchBusinessData,
  setGeneralStatus,
} from '../../redux/actions-v2/coreAction';
import { AddBoxOutlined } from '@mui/icons-material';

const SettingsDictionary = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const businessPreference = useSelector((state) => state.core.businessData);

  // Initialize customTerms as an object keyed by termId
  const [customTerms, setCustomTerms] = useState({});
  const [tags, setTags] = useState(businessPreference?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState(
    businessPreference?.categories || []
  );
  const [newCat, setNewCat] = useState('');

  useEffect(() => {
    // Convert the dictionary from businessPreference to the required format if needed
    const initialTerms = businessPreference?.dictionary?.terms || defaultTerms;
    setCustomTerms(initialTerms);
  }, [businessPreference]);

  const handleTermChange = (termId, lang, form, value) => {
    setCustomTerms((prevTerms) => ({
      ...prevTerms,
      [termId]: {
        ...prevTerms[termId],
        [form]: {
          ...prevTerms[termId][form],
          [lang]: value,
        },
      },
    }));
  };

  const handleAddTag = () => {
    if (newTag) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => () => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleAddCat = async () => {
    try {
      if (newCat) {
        setCategories([...categories, { id: newCat, name: newCat }]);
        await addDoc(
          collection(
            db,
            'businessesOnNode',
            businessPreference.id,
            'categories'
          ),
          { name: newCat }
        );
      }
      toast.success(t('added'));
      dispatch(fetchBusinessData(businessPreference.id, t));
    } catch (error) {
      console.error('Error adding category');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const saveTerms = async () => {
    try {
      const docRef = doc(
        db,
        'businessesOnNode',
        businessPreference.id,
        'dictionary',
        'MAIN'
      );
      await setDoc(docRef, { terms: customTerms }, { merge: true });
      toast.success(t('saved'));
      dispatch(fetchBusinessData(businessPreference.id, t));
    } catch (error) {
      toast.error(t('Error saving dictionary'));
    }
  };

  const saveTags = async () => {
    try {
      const docRef = doc(db, 'businessesOnNode', businessPreference.id);
      await updateDoc(docRef, { tags: tags });
      toast.success(t('saved'));
      dispatch(fetchBusinessData(businessPreference.id, t));
    } catch (error) {
      toast.error(t('Error saving dictionary'));
    }
  };

  return (
    <MainLayoutV2 pageTitle={t('dictionary')}>
      <Block height={1} heightPercentage={82}>
        <div className="row p-3">
          {' '}
          {/* <div className="col-9">
            <Box sx={{ padding: 2, mb: 3 }}>
              {Object.entries(customTerms).map(([termId, term]) => (
                <React.Fragment key={termId}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    {t(termId)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {Object.entries(term.defaultSingle).map(([lang, value]) => (
                      <TextField
                        key={`${termId}-single-${lang}`}
                        label={`${t('single')} (${lang.toUpperCase()})`}
                        value={value}
                        onChange={(e) =>
                          handleTermChange(
                            termId,
                            lang,
                            'defaultSingle',
                            e.target.value
                          )
                        }
                        margin="normal"
                        fullWidth
                      />
                    ))}
                    {Object.entries(term.defaultPlural).map(([lang, value]) => (
                      <TextField
                        key={`${termId}-plural-${lang}`}
                        label={`${t('plural')} (${lang.toUpperCase()})`}
                        value={value}
                        onChange={(e) =>
                          handleTermChange(
                            termId,
                            lang,
                            'defaultPlural',
                            e.target.value
                          )
                        }
                        margin="normal"
                        fullWidth
                      />
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </React.Fragment>
              ))}
              <Button
                disableElevation
                variant="contained"
                onClick={saveTerms}
                sx={{ mt: 2 }}
              >
                {t('save')}
              </Button>
            </Box>{' '}
          </div> */}
          <div className="col-3">
            <div>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                {t('tags')}
              </Typography>
              <div className="mb-3 mt-3">
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={handleDeleteTag(tag)}
                    sx={{ mr: 1, mt: 1 }}
                  />
                ))}
              </div>
              <div className="d-flex middle-content">
                <div className="col-11">
                  <TextField
                    value={newTag}
                    fullWidth
                    onChange={(e) => setNewTag(e.target.value)}
                    label={t('addTag')}
                    variant="outlined"
                    sx={{ mt: 2, mr: 1 }}
                  />
                </div>
                <div className="col-1">
                  <IconButton onClick={handleAddTag} sx={{ mt: 2 }}>
                    <AddBoxOutlined />
                  </IconButton>
                </div>
              </div>
              <Button
                disableElevation
                fullWidth
                variant="contained"
                onClick={saveTags}
                sx={{ mt: 2 }}
              >
                {t('save')}
              </Button>
            </div>
          </div>
          <div className="col-4 mx-4">
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              {t('categories')}
            </Typography>
            <div className="mb-3 mt-3">
              {categories?.map((cat) => (
                <Chip key={cat?.id} label={cat?.name} sx={{ mr: 1, mt: 1 }} />
              ))}
            </div>
            <div className="d-flex middle-content">
              <div className="col-11">
                <TextField
                  value={newCat}
                  fullWidth
                  onChange={(e) => setNewCat(e.target.value)}
                  label={t('addCategory')}
                  variant="outlined"
                  sx={{ mt: 2, mr: 1 }}
                />
              </div>
              <div className="col-1">
                <IconButton onClick={handleAddCat} sx={{ mt: 2 }}>
                  <AddBoxOutlined />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </Block>
    </MainLayoutV2>
  );
};

export default SettingsDictionary;
