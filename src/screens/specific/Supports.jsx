import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import {
  onSnapshot,
  query,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
} from '@firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  AccordionSummary,
  Accordion,
  AccordionDetails,
} from '@mui/material';
import TextField from '../../stories/general-components/TextField';
import Select from '../../stories/general-components/Select';
import IconUploader from '../../components/@generalComponents/IconUploader';
import GeneralText from '../../stories/general-components/GeneralText';
import { Add, Delete, ExpandMore } from '@mui/icons-material';
import IconSelector from '../../components/@generalComponents/IconSelector';
import TagSelector from '../../stories/general-components/TagSelector';
import ReactQuill from 'react-quill';
import getRandomString from '../../utils/getRandomString';
import Checkbox from '../../stories/general-components/Checkbox';

const Supports = () => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const dispatch = useDispatch();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [openIcon, setOpenIcon] = useState(false);
  const [newArticle, setNewArticle] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'support'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const articles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(articles);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe();
  }, []);

  const categories = [
    {
      value: 'general',
      label: t('general'),
      id: 'general',
    },
    {
      value: 'billing',
      label: t('billing'),
      id: 'billing',
    },
    {
      value: 'technical',
      label: t('technical'),
      id: 'technical',
    },
    {
      value: 'other',
      label: t('other'),
      id: 'other',
    },
  ];

  const addBlock = () => {
    setBlocks([
      ...blocks,
      { name: '', subtitle: '', content: '', icon: '', id: getRandomString(8) },
    ]);
  };

  const getBlocks = async (id) => {
    if (!id) {
      return;
    }
    const docRef = collection(db, 'support', id, 'content');
    const docSnap = await getDocs(docRef);
    const blocks = docSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBlocks(blocks);
  };

  const handleBlockChange = (index, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[index][field] = value;
    setBlocks(newBlocks);
  };

  const handleClose = () => {};

  const handleCloseIcon = () => {};

  const handleSubmit = async () => {
    if (!selectedArticle) {
      toast.error(t('select_article'));
      return;
    }
    try {
      const newArticle = {
        ...selectedArticle,
        lastUpdate: serverTimestamp(),
        type: 1,
        id: selectedArticle?.id || getRandomString(10),
      };

      const docRef = doc(db, 'support', newArticle.id);
      await setDoc(docRef, newArticle);

      //delete all blocks in subcollection
      //get all docs in subcollection
      const q = query(collection(db, 'support', newArticle.id, 'content'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });

      //batch create blocks in subcollection

      blocks.forEach(async (blockdata) => {
        const docRef = doc(
          db,
          'support',
          newArticle.id,
          'content',
          blockdata.id
        );
        const block = {
          ...blockdata,
          lastUpdate: serverTimestamp(),
        };
        await setDoc(docRef, block);
      });

      toast.success(t('article_updated'));
      setSelectedArticle(null);
      setBlocks([]);
      setNewArticle(false);
    } catch (error) {
      console.error(error);
      toast.error(t('error_updating_article'));
    }
  };

  const handleAddNew = () => {
    const newArticle = {
      title: '',
      description: '',
      blocks: [],
      category: 'general',
      tags: [],
      image: '',
      link: '',
    };
    setNewArticle(true);
    setData([...data, newArticle]);
    setSelectedArticle(newArticle);
    setBlocks([]);
  };

  const handleDeleteBlock = async (index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  return (
    <MainLayoutV2
      pageTitle={t('support')}
      actions={{
        save: handleSubmit,
        add: handleAddNew,
      }}
    >
      <Block height={1} heightPercentage={99}>
        <div className="row">
          {openIcon && (
            <IconSelector
              handleClose={handleClose}
              handleCloseIcon={handleCloseIcon}
            />
          )}
          <div className="col-3">
            <List>
              {data?.map((item, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => {
                    setSelectedArticle(item);
                    getBlocks(item.id);
                  }}
                >
                  <ListItemText primary={item.title} />
                </ListItem>
              ))}
            </List>
          </div>
          <div className="col-9">
            {(selectedArticle?.id || newArticle) && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <TextField
                  label={t('title')}
                  value={selectedArticle?.title}
                  fullWidth
                  key={selectedArticle?.id + 'title'}
                  onChange={(e) => {
                    setSelectedArticle({
                      ...selectedArticle,
                      title: e.target.value,
                    });
                  }}
                />

                <div className="d-flex">
                  <div style={{ paddingRight: '20px' }} className="col-8">
                    <TextField
                      label={t('description')}
                      fullWidth
                      multiline
                      rows={6}
                      onChange={(e) => {
                        setSelectedArticle({
                          ...selectedArticle,
                          description: e.target.value,
                        });
                      }}
                      key={selectedArticle?.id + 'description'}
                      value={selectedArticle?.description}
                    />
                    <div className="mt-3 mb-2 d-flex justify-content-between middle-content">
                      <GeneralText
                        text={t('blocks')}
                        fullWidth
                        primary={true}
                        fontSize="16px"
                        size="bold"
                        key={selectedArticle?.id + 'content'}
                      />
                      <IconButton
                        onClick={() => {
                          addBlock();
                        }}
                      >
                        <Add />
                      </IconButton>
                    </div>
                    {blocks?.map((block, index) => (
                      <Accordion elevation={0} key={index}>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <div className="row justify-content-between middle-content">
                            <div className="col-10">
                              <Typography>
                                {block?.name || 'Nouveau bloc sans titre'}
                              </Typography>
                            </div>
                            <div className="col-2">
                              <IconButton
                                onClick={() => {
                                  handleDeleteBlock(index);
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            label={t('name')}
                            value={block.name}
                            fullWidth
                            key={selectedArticle?.id + 'block' + index + 'name'}
                            onChange={(e) =>
                              handleBlockChange(index, 'name', e.target.value)
                            }
                          />
                          <TextField
                            label={t('subtitle')}
                            value={block.subtitle}
                            fullWidth
                            key={
                              selectedArticle?.id + 'block' + index + 'subtitle'
                            }
                            onChange={(e) =>
                              handleBlockChange(
                                index,
                                'subtitle',
                                e.target.value
                              )
                            }
                          />

                          <GeneralText
                            text={t('content')}
                            fullWidth
                            primary={true}
                            fontSize="11px"
                            size="bold"
                            classNameComponent="mt-2 mb-1"
                          />
                          <ReactQuill
                            theme="bubble"
                            value={block?.content}
                            onChange={(e) =>
                              handleBlockChange(index, 'content', e)
                            }
                            modules={{
                              history: {
                                delay: 2000,
                                maxStack: 500,
                                userOnly: true,
                              },
                            }}
                          />
                          <GeneralText
                            text={t('procedure')}
                            fullWidth
                            primary={true}
                            fontSize="11px"
                            size="bold"
                            classNameComponent="mt-2 mb-1"
                          />
                          <ReactQuill
                            theme="bubble"
                            value={block?.procedure}
                            onChange={(e) =>
                              handleBlockChange(index, 'procedure', e)
                            }
                            modules={{
                              history: {
                                delay: 2000,
                                maxStack: 500,
                                userOnly: true,
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </div>
                  <div className="col-4">
                    <Checkbox
                      label={t('published')}
                      value={selectedArticle?.isActive}
                      onClick={(e) => {
                        setSelectedArticle({
                          ...selectedArticle,
                          isActive: e.target.checked,
                        });
                      }}
                      onChange={(e) => {
                        setSelectedArticle({
                          ...selectedArticle,
                          isActive: e.target.checked,
                        });
                      }}
                    />
                    <Select
                      label={t('category')}
                      value={selectedArticle?.category}
                      fullWidth
                      onChange={(e, value) => {
                        setSelectedArticle({
                          ...selectedArticle,
                          category: value,
                        });
                      }}
                      key={selectedArticle?.id + 'category'}
                      selections={categories}
                    />
                    <IconUploader
                      label={t('image')}
                      fullWidth
                      fieldType={'media-single'}
                      onComplete={(e) => {
                        setSelectedArticle({
                          ...selectedArticle,
                          image: e[0]?.fileUrl,
                        });
                      }}
                      key={selectedArticle?.id + 'icon'}
                      value={selectedArticle?.image}
                    />
                    <TagSelector
                      label={t('tags')}
                      fullWidth
                      onChange={(e, value) => {
                        setSelectedArticle({
                          ...selectedArticle,
                          tags: value,
                        });
                      }}
                      key={selectedArticle?.id + 'tags'}
                      value={selectedArticle?.tags}
                    />
                    <TextField
                      label={t('links')}
                      fullWidth
                      onChange={(e) => {
                        setSelectedArticle({
                          ...selectedArticle,
                          link: e.target.value,
                        });
                      }}
                      rows={1}
                      key={selectedArticle?.id + 'link'}
                      value={selectedArticle?.link}
                    />
                  </div>
                </div>
              </Box>
            )}
          </div>
        </div>
      </Block>
    </MainLayoutV2>
  );
};

export default Supports;
