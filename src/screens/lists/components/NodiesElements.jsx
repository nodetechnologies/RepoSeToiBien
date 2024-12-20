import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import chroma from 'chroma-js';
import PerfectScrollbar from 'react-perfect-scrollbar';

// utilities
import { useTranslation } from 'react-i18next';

// components
import Button from '../../../stories/general-components/Button.jsx';
import SingleElement from './SingleElement.jsx';
import { Divider } from '@mui/material';

const NodiesElements = ({
  list,
  availableTags,
  fetchRoomData,
  mainColor,
  insideFolder,
  setInsideFolder,
  activeFolder,
  setActiveFolder,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedElement, setSelectedElement] = useState(null);

  const handleBackClick = () => {
    setInsideFolder(false);
  };

  const handleFolderClick = (tag) => {
    setActiveFolder(tag);
    setInsideFolder(true);
  };
  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  useEffect(() => {
    if (selectedElement?.elementRef?.id && businessPreference?.id) {
      const businessStructures = businessStructure?.structures;
      const structure = businessStructures?.find(
        (s) => s.id === selectedElement?.structureId
      );

      navigate(
        '/app/element/' +
          structure?.collectionField +
          '/' +
          selectedElement?.structureId +
          '/' +
          selectedElement?.elementRef?.id
      );
    }
  }, [selectedElement]);

  const handleElement = (element) => {
    if (element?.type === 'media') {
      setSelectedElement(element);
    }
    if (element?.type === 'link') {
      window.open(element?.data?.url, '_blank');
    }
    if (element?.type === 'note') {
      setSelectedElement(element);
    }
    if (element?.elementRef?.id) {
      setSelectedElement(element);
    }
  };

  return (
    <div>
      <PerfectScrollbar>
        <div className="mt-3">
          {list && !insideFolder && (
            <div style={{ paddingLeft: '25px' }} className="row mb-3">
              {availableTags?.map((tag) => {
                const randomNumber = Math.floor(Math.random() * 10);

                const colorVariant = chroma(mainColor)
                  .luminance(randomNumber * 0.05)
                  .hex();

                return (
                  <div
                    className="col-3 mb-4"
                    onClick={() => handleFolderClick(tag)}
                  >
                    <SingleElement
                      type={'folder'}
                      element={null}
                      list={list}
                      fetchRoomData={fetchRoomData}
                      tag={tag}
                      availableTags={availableTags}
                      color={colorVariant}
                      handleElement={null}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {list && insideFolder && (
            <div style={{ paddingLeft: '25px' }} className="row">
              <Button
                label={t('back')}
                onClick={handleBackClick}
                size="small"
                variant="text"
                startIcon={'ArrowBack'}
              />
              {list
                ?.filter((element) =>
                  element?.data?.tags?.includes(activeFolder)
                )
                ?.map((element) => {
                  return (
                    <div className="col-3 mb-4">
                      <SingleElement
                        type={element?.type || 'element'}
                        element={element}
                        list={list}
                        fetchRoomData={fetchRoomData}
                        tag={null}
                        availableTags={availableTags}
                        handleElement={() => handleElement(element)}
                      />
                    </div>
                  );
                })}
            </div>
          )}
          <Divider component="div" sx={{ mt: 4, mb: 4 }} />
          {list && !insideFolder && (
            <div style={{ paddingLeft: '25px' }} className="row mb-3">
              {list
                ?.filter(
                  (element) =>
                    element?.data?.tags?.length === 0 || !element?.data?.tags
                )
                ?.map((element) => {
                  return (
                    <div className="col-3 mb-4">
                      <SingleElement
                        type={element?.type || 'element'}
                        element={element}
                        list={list}
                        fetchRoomData={fetchRoomData}
                        tag={null}
                        availableTags={availableTags}
                        handleElement={handleElement}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default NodiesElements;
