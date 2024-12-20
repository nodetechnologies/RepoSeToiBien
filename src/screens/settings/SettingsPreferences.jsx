import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Blocks from '../../stories/layout-components/Block';
import { fetchBusinessData } from '../../redux/actions-v2/coreAction';

const SettingsPreferences = ({}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const businessModules = businessStructure?.modules || [];

  // Initial state setup to group modules by section
  const [modulesBySection, setModulesBySection] = useState({});

  useEffect(() => {
    const groupedBySection = businessModules?.reduce((acc, module) => {
      const section = module.section || 'default';
      acc[section] = acc[section] ? [...acc[section], module] : [module];
      return acc;
    }, {});

    // Sort each section's modules by their order
    Object.keys(groupedBySection).forEach((section) => {
      groupedBySection[section].sort((a, b) => a.order - b.order);
    });

    setModulesBySection(groupedBySection);
  }, [businessModules]);

  const onDragEnd = (result, section) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    const items = Array.from(modulesBySection[destination?.droppableId]);

    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    // Update state with the new order
    setModulesBySection({
      ...modulesBySection,
      [destination?.droppableId]: items,
    });

    // Persist the new order in the database
    items?.forEach((item, index) => {
      const moduleRef = doc(
        db,
        'businessesOnNode',
        businessPreference?.id,
        'modules',
        item.id
      );
      updateDoc(moduleRef, { order: index }).catch((error) =>
        console.error('Error updating document: ', error)
      );
    });
    dispatch(fetchBusinessData(businessPreference?.id, t));
  };

  return (
    <Blocks heightPercentage={100} height={1}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          {Object.entries(modulesBySection).map(
            ([section, modules], sectionIndex) => (
              <div key={section} className="col-3">
                <Typography
                  variant="h5"
                  fontSize="15px"
                  fontWeight={500}
                  sx={{
                    mb: 2,
                  }}
                >
                  {t(section?.toLowerCase())}
                </Typography>
                <Droppable droppableId={`${section}`}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {modules.map((module, index) => (
                        <Draggable
                          key={module.id}
                          draggableId={module.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                padding: 16,
                                margin: '0 0 8px 0',
                                borderRadius: 4,
                                backgroundColor: '#f9f9f9',
                                ...provided.draggableProps.style,
                              }}
                            >
                              <div className="justify-content-between d-flex">
                                <DragHandleIcon />
                                <Typography
                                  variant="h6"
                                  fontSize="14px"
                                  style={{ fontWeight: 'medium' }}
                                >
                                  {module?.name_fr}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  fontSize="14px"
                                  style={{ fontWeight: 'medium' }}
                                >
                                  {module?.order + 1}
                                </Typography>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          )}
        </div>
      </DragDropContext>
    </Blocks>
  );
};

export default SettingsPreferences;
