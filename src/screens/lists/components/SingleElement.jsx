import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Icons from '@mui/icons-material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Autocomplete } from '@mui/material';
import TextFieldMUI from '@mui/material/TextField';

// utilities
import { useTranslation } from 'react-i18next';

// components
import { useTheme } from '@mui/material/styles';
import { setGeneralStatus } from '../../../redux/actions-v2/coreAction.js';
import GeneralText from '../../../stories/general-components/GeneralText.jsx';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase.js';
import ModalLarge from '../../../modals/Base/ModalLarge.jsx';
import Button from '../../../stories/general-components/Button.jsx';
import Blocks from '../../../stories/layout-components/Block.jsx';
import TextField from '../../../stories/general-components/TextField.jsx';

const SingleElement = ({
  heightPercentage,
  type,
  element,
  fetchRoomData,
  list,
  tag,
  lengthNb,
  availableTags,
  color,
  handleElement,
  noIcons,
  icon,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { nodeId } = useParams();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [blur, setBlur] = useState(false);
  const [tagsUpdated, setTagsUpdated] = useState(element?.data?.tags || []);
  const [titleUpdated, setTitleUpdated] = useState(element?.name || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const businessPreference = useSelector((state) => state.core.businessData);
  const currentStatus = useSelector((state) => state.core.status);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const structure = businessStructure?.structures?.find(
    (structure) => structure?.id === element?.structureId
  );

  const IconComponent =
    Icons[
      structure?.icon
        ? structure?.icon
        : icon
        ? icon
        : type === 'element'
        ? 'Error'
        : 'Folder'
    ];

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTagsChange = (event, value) => {
    setTagsUpdated(value || []);
  };

  const handleEditTagsElement = async () => {
    dispatch(
      setGeneralStatus({
        status: 'loading',
        position: 'nodies-editElement',
        type: 'pulse',
      })
    );
    try {
      handleModalClose();
      if (titleUpdated !== element?.name) {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `coreSeqV2/node-element`,
          body: {
            structureId: '',
            dropId: nodeId,
            name: titleUpdated,
            identifier: element?.iden,
          },
        });
      }

      if (tagsUpdated !== element?.data?.tags) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `coreSeqV2/node-element`,
          body: {
            structureId: '',
            dropId: nodeId,
            tags: tagsUpdated,
            identifier: element?.iden,
          },
        });
      }
      fetchRoomData();
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'nodies-editElement',
          type: 'pulse',
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removeElement = async (item) => {
    let isClicked = false;
    setBlur(true);
    if (isClicked) return;
    isClicked = true;
    setTimeout(() => {
      isClicked = false;
    }, 300);

    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'nodies-element-remove',
          type: 'pulse',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'DELETE',
        url: `coreSeqV2/node-element`,
        body: {
          dropId: nodeId,
          elementPath: item?.elementRef?.path,
          uniqueId: item?.iden || '',
        },
      });
      fetchRoomData();
      setBlur(false);
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'nodies-element-remove',
          type: 'pulse',
        })
      );
    } catch (error) {
      dispatch(
        setGeneralStatus({
          status: 'error',
          position: 'nodies-element-remove',
          type: 'pulse',
        })
      );
      console.error(error);
    }
  };

  return (
    <React.Fragment key={element?.id || tag}>
      <ModalLarge
        isOpen={isModalOpen}
        modalCloseHandler={handleModalClose}
        title={t('edit')}
      >
        {' '}
        <div className="mt-2">
          <div>
            <TextField
              label={t('title')}
              fullWidth
              value={titleUpdated}
              type="title"
              onChange={(e) => setTitleUpdated(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <Autocomplete
              multiple
              options={availableTags}
              value={tagsUpdated || []}
              freeSolo
              onChange={handleTagsChange}
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  variant="outlined"
                  label={t('folders')}
                  placeholder={t('addFolders')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&.Mui-focused fieldset': {
                        borderColor: businessPreference?.mainColor || '#000',
                        boxShadow: `0 0 0 0.2rem ${
                          businessPreference?.mainColor + '20'
                        }`,
                      },
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="align-left px-2 mt-4">
          <Button
            fullWidth
            onClick={() => {
              handleEditTagsElement();
            }}
            label={t('save')}
          />
        </div>
      </ModalLarge>

      <Blocks
        heightPercentage={heightPercentage || 8}
        height={1}
        noPadding
        clickable
        noShadow
        noScroll
        className={blur ? 'blur-effect' : 'hover '}
      >
        <div
          className="p-2 middle-content"
          style={{ marginTop: heightPercentage / 60 + '%' }}
        >
          {type !== 'folder' && !noIcons && (
            <div
              className="hover"
              style={{
                position: 'absolute',
                right: 0,
                marginRight: '15px',
              }}
            >
              <Icons.EditOutlined
                sx={{
                  '&:hover': {
                    color: 'grey',
                  },
                  marginRight: '5px',
                }}
                fontSize="10px"
                onClick={() => setIsModalOpen(true)}
              />
              <Icons.DeleteOutline
                sx={{
                  '&:hover': {
                    color: 'red',
                  },
                }}
                fontSize="10px"
                onClick={() => removeElement(element)}
              />
            </div>
          )}
          <div className="row">
            <div className="col-3" onClick={() => handleElement(element)}>
              {type !== 'link' && type !== 'media' && type !== 'note' && (
                <IconComponent
                  sx={{ color: color || 'lightgrey', fontSize: '30px', mt: 1 }}
                />
              )}
              {(type === 'media' || type === 'link') && (
                <img
                  src={
                    element?.data?.fileUrl ||
                    element?.data?.image ||
                    '/assets/v3/img/placeholder.png'
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/v3/img/placeholder.png';
                  }}
                  onClick={() => handleElement(element)}
                  alt={element?.name}
                  width="35px"
                  height="45px"
                  style={{
                    borderRadius: '4px',
                    marginTop: '5px',
                    objectFit: 'cover',
                  }}
                />
              )}
            </div>
            <div
              style={{ paddingLeft: '16px', paddingTop: '2px' }}
              className="col-9 mt-2 align-left"
            >
              {lengthNb !== undefined && (
                <GeneralText
                  primary={true}
                  size="bold"
                  onClick={() => handleElement(element)}
                  fontSize="20px"
                  classNameComponent={'mt-1'}
                  text={lengthNb?.toString()}
                />
              )}
              <GeneralText
                primary={true}
                size="bold"
                fontSize="11px"
                onClick={() => handleElement(element)}
                classNameComponent={lengthNb !== undefined ? '' : 'mt-2'}
                text={tag || element?.name?.slice(0, 14)}
              />
              {element?.data?.description && (
                <div>
                  <GeneralText
                    primary={true}
                    size="regular"
                    fontSize="10px"
                    onClick={() => handleElement(element)}
                    type="text"
                    text={(element?.data?.description || '')?.slice(0, 30)}
                  />
                </div>
              )}
              {type === 'folder' && (
                <div onClick={() => handleElement(element)}>
                  <GeneralText
                    primary={true}
                    size="regular"
                    fontSize="10px"
                    type="text"
                    text={
                      list?.filter((el) => el?.data?.tags?.includes(tag))
                        ?.length +
                      ' ' +
                      t('elements')
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Blocks>
    </React.Fragment>
  );
};

export default SingleElement;
