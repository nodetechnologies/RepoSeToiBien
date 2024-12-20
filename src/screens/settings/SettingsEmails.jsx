import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import moment from 'moment';
import { db } from '../../firebase';
import {
  addDoc,
  doc,
  updateDoc,
  getDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import TextField from '../../stories/general-components/TextField';
import {
  fetchBusinessData,
  setGeneralStatus,
} from '../../redux/actions-v2/coreAction';
import StripoEditor from './StripoEditor';
import Blocks from '../../stories/layout-components/Block';
import Selection from '../../stories/general-components/Selection';
import Select from '../../stories/general-components/Select';

const SettingsEmails = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLangCode = i18n.language;
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const cardTags = [
    {
      category: 'Personalization',
      entries: [
        {
          label: t('documentId'),
          value: '${data.cardId}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('status'),
          value: '${data.status}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('total'),
          value: '${data.finances.total}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('subtotal'),
          value: '${data.finances.subtotal}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('balance'),
          value: '${data.finances.balance}',
          hint: 'Tkdjsd',
          hidden: false,
        },

        {
          label: t('assignedToId'),
          value: '${data.assignedToDetails.name}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('shortCardId'),
          value: '${data.searchId}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('targetDate'),
          value: '${data.targetDate}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('invoiceDate'),
          value: '${data.invoiceDate}',
          hint: 'Tkdjsd',
          hidden: false,
        },

        {
          label: t('attribute1'),
          value: '${data.attribute1}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('attribute2'),
          value: '${data.attribute2}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('attribute3'),
          value: '${data.attribute3}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('attribute4'),
          value: '${data.attribute4}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('name'),
          value: '${data.name}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('targetName'),
          value: '${data.targetDetails.name}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('businessName'),
          value: '${data.ownerDetails.name}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('customBody'),
          value: '${data.customBody}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('actionUrl'),
          value: '${data.actionUrl}',
          hint: 'Tkdjsd',
          hidden: false,
        },
      ],
    },
  ];

  const contactTags = [
    {
      category: 'Personalization',
      entries: [
        {
          label: t('userName'),
          value: '${data.name}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('targetEmail'),
          value: '${data.targetEmail}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('targetPhone'),
          value: '${data.targetPhone}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('targetReference'),
          value: '${data.targetReference}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('targetLang'),
          value: '${data.targetLang}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('targetAddress'),
          value: '${data.targetAddress}',
          hint: 'Tkdjsd',
          hidden: false,
        },

        {
          label: t('attribute1'),
          value: '${data.attribute1}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('attribute2'),
          value: '${data.attribute2}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('attribute3'),
          value: '${data.attribute3}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('attribute4'),
          value: '${data.attribute4}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('businessName'),
          value: '${data.ownerDetails.name}',
          hint: 'Tkdjsd',
          hidden: false,
        },
        {
          label: t('customBody'),
          value: '${data.customBody}',
          hint: 'Tkdjsd',
          hidden: false,
        },
      ],
    },
  ];

  const businessPreference = useSelector((state) => state.core.businessData);

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessStructures = businessStructure?.structures;

  //get all structure where collectionField is 'contacts'
  const contactStructure = businessStructures?.find(
    (s) => s.collectionField === 'contacts'
  );

  const cardStructure = businessStructures?.find(
    (s) => s.collectionField === 'cards'
  );

  useEffect(() => {
    if (selectedTemplate) {
      setIsLoaded(false);
      if (selectedTemplate.type === 'cards') {
        const formattedStructureTags =
          (cardStructure &&
            cardStructure?.fields
              ?.filter((field) => field?.type !== 'default')
              ?.map((field) => ({
                label: field?.name,
                value: `\${data.data.${field.value}}`,
                hint: field.description || '',
                hidden: false,
              }))) ||
          [];

        const mergedTags = cardTags?.map((tag) => ({
          ...tag,
          entries: [...tag.entries, ...formattedStructureTags],
        }));

        setTags(mergedTags);
      } else if (selectedTemplate.type === 'contacts') {
        const formattedStructureTags =
          (contactStructure &&
            contactStructure?.fields
              ?.filter((field) => field?.type !== 'default')
              ?.map((field) => ({
                label: field?.name,
                value: `\${data.data.${field.value}}`,
                hint: field?.description || '',
                hidden: false,
              }))) ||
          [];

        const mergedTags = contactTags?.map((tag) => ({
          ...tag,
          entries: [...tag.entries, ...formattedStructureTags],
        }));

        setTags(mergedTags);
      }
    }
    setIsLoaded(true);
  }, [selectedTemplate, isModalOpen]);

  const template = {
    html: `
    <
    ><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title></title><!--[if (mso 16)]>
          <style type="text/css">a {text-decoration: none;}</style>
        <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
          <noscript>
         <xml>
           <o:OfficeDocumentSettings>
           <o:AllowPNG></o:AllowPNG>
           <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
         </xml>
      </noscript>
        <![endif]--></head><body><div class="es-wrapper-color"><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td class="esd-email-paddings" valign="top"><!-- Email content starts here --><table class="es-content esd-footer-popover" cellspacing="0" cellpadding="0" align="center"><tbody><tr><td class="esd-stripe" align="center"><table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center"><tbody><tr><td class="esd-structure es-p20t es-p20b es-p20r es-p20l" align="left"><table class="es-left" cellspacing="0" cellpadding="0" align="left"><tbody><tr><td class="esd-container-frame" width="356" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0"><tbody>
                                              
                                          <tr><td align="left" class="esd-block-text">
                    <p>Texte</p>
                </td></tr></tbody></table></td></tr></tbody></table><table class="es-right" cellspacing="0" cellpadding="0" align="right"><tbody><tr><td class="esd-container-frame" width="184" valign="top" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td class="esd-block-text es-infoblock" align="right">
                                                  <p><a href="http://viewstripo.email" target="_blank">View email in your browser</a></p>
                                                </td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!-- Email content ends here --></td></tr></tbody></table></div></body></html> 
    `,
    css: `
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }
    .es-wrapper-color {
      background-color: #f6f6f6;
    }
    .esd-header-popover .es-content-body {
      background-color: transparent;
    }
    h2 {
      color: #333333;
    }
    .es-button-border {
      border-radius: 50%;
    }
    `,
  };

  const addTemplate = async () => {
    try {
      const collectionRef = collection(
        db,
        'businessesOnNode',
        businessPreference.id,
        'emails'
      );

      const businessRef = doc(db, 'businessesOnNode', businessPreference.id);

      const newTemplate = {
        ...template,
        isDefault: false,
        subject: '',
        lang: currentLangCode,
        type: 'cards',
        businessId: businessRef,
      };

      const newDoc = await addDoc(collectionRef, newTemplate);

      //get the new template + id
      const newTemplateDoc = await getDoc(newDoc);
      setSelectedTemplate({
        id: newDoc.id,
        ...newTemplateDoc.data(),
      });
    } catch (error) {
      console.error('Error adding template');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const handleChanges = (value, field) => {
    setSelectedTemplate((prevTemplate) => ({
      ...prevTemplate,
      [field]: value,
    }));
  };

  const deleteTemplate = () => {};

  const handleSave = async () => {
    try {
      setModalOpen(false);
      let newTemplateData = null;
      if (window.StripoEditorApi.actionsApi) {
        const newTemplateDataStripo = await new Promise((resolve, reject) => {
          window.StripoEditorApi.actionsApi.getTemplate((html, css) => {
            if (html && css) {
              html = html.replace(/.*<head/g, '<head');

              resolve({
                ...selectedTemplate,
                html: html,
                css: css,
              });
            } else {
              reject(new Error('Failed to retrieve template data.'));
            }
          });
        });
        newTemplateData = newTemplateDataStripo;
      }

      const docRef = doc(
        db,
        'businessesOnNode',
        businessPreference.id,
        'emails',
        selectedTemplate?.id
      );

      await updateDoc(docRef, {
        name: selectedTemplate?.name,
        body: selectedTemplate?.body || null,
        css: newTemplateData?.css || selectedTemplate?.css || null,
        html: newTemplateData?.html || selectedTemplate?.html,
        subject: selectedTemplate?.subject,
        isProject: selectedTemplate?.isProject || false,
        isInvoiced: selectedTemplate?.isInvoiced || false,
        lang: selectedTemplate?.lang,
        lastUpdate: serverTimestamp(),
        type: selectedTemplate?.type || 'cards',
        structureId: selectedTemplate?.structureId,
      });

      toast.success(t('saved'));
      dispatch(fetchBusinessData(businessPreference.id, t));
    } catch (error) {
      console.error('Error updating template');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <MainLayoutV2
      pageTitle={t('emails')}
      actions={{
        add: addTemplate,
        save: selectedTemplate && handleSave,
        delete: selectedTemplate && deleteTemplate,
      }}
    >
      <Block height={1} heightPercentage={100} noBorder noScroll>
        <div className="row">
          <div className="col-4">
            <List>
              {businessPreference?.emails
                ?.slice()
                .sort((a, b) => a?.isDefault - b?.isDefault)
                ?.map((template) => (
                  <ListItem
                    divider
                    key={template?.id}
                    button
                    onClick={() => setSelectedTemplate(template)}
                    selected={selectedTemplate?.id === template?.id}
                  >
                    <ListItemText
                      primary={template?.name}
                      primaryTypographyProps={{
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                      secondary={
                        (template?.isDefault
                          ? t('defaultModel')
                          : t('custom')) +
                        ' - ' +
                        template?.lang?.toUpperCase()
                      }
                      secondaryTypographyProps={{
                        fontSize: '10px',
                        fontWeight: 400,
                      }}
                    />
                    <ListItemText
                      sx={{
                        textAlign: 'right',
                      }}
                      primary={t(template?.type)}
                      primaryTypographyProps={{
                        fontSize: '11px',
                        fontWeight: 'medium',
                      }}
                      secondary={moment
                        .unix(
                          template?.lastUpdate?.seconds ||
                            template?.lastUpdate?._seconds
                        )
                        .format('DD MMM HH:mm')}
                      secondaryTypographyProps={{
                        fontSize: '8px',
                        fontWeight: 400,
                      }}
                    />
                  </ListItem>
                ))}
            </List>
          </div>
          <div className="col-8 px-5">
            <Blocks
              empty={!selectedTemplate}
              emptyType="select"
              noBorder
              heightPercentage={100}
            >
              <TextField
                fullWidth
                label={t('name')}
                value={selectedTemplate?.name}
                onChange={(e) => {
                  handleChanges(e.target.value, 'name');
                }}
              />

              <TextField
                fullWidth
                label={t('subject')}
                value={selectedTemplate?.subject}
                onChange={(e) => {
                  handleChanges(e.target.value, 'subject');
                }}
              />
              <Selection
                value={selectedTemplate?.lang}
                onChange={(e, value) => {
                  handleChanges(value, 'lang');
                }}
                field={{
                  typeData: 'selectionNode',
                  required: false,
                }}
                selections={[
                  {
                    label: 'English',
                    value: 'en',
                    id: 'en',
                    color: businessPreference?.mainColor,
                  },
                  {
                    label: 'Français',
                    value: 'fr',
                    id: 'fr',
                    color: businessPreference?.mainColor,
                  },
                ]}
                label={t('language')}
              />
              <Select
                value={selectedTemplate || ''}
                onChange={(e, value) =>
                  setSelectedTemplate({
                    ...selectedTemplate,
                    structureId: value,
                  })
                }
                selections={businessStructures?.map((s) => ({
                  label: s.name,
                  id: s.id,
                  value: s.id,
                }))}
                label={t('structure')}
              />

              <Button onClick={openModal}>{t('openBuilder')}</Button>
            </Blocks>
          </div>
        </div>
      </Block>
      {isLoaded && selectedTemplate && isModalOpen && (
        <Dialog open={isModalOpen} onClose={closeModal} maxWidth="lg" fullWidth>
          <DialogTitle>{t('editTemplate')}</DialogTitle>
          <DialogContent>
            <StripoEditor
              templateId={selectedTemplate?.id || '1'}
              businessId={businessPreference?.id}
              template={{
                html: selectedTemplate?.html ?? template.html,
                css: selectedTemplate?.css ?? template.css,
              }}
              tags={tags}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSave} color="primary">
              {t('save')}
            </Button>
            <Button onClick={closeModal} color="secondary">
              {t('close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </MainLayoutV2>
  );
};

export default SettingsEmails;
