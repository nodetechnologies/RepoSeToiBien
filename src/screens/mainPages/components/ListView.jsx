import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

//utilities
import { useTranslation } from 'react-i18next';
import {
  Box,
  ButtonBase,
  Divider,
  IconButton,
  ListItem,
  Typography,
} from '@mui/material';
import {
  Add,
  ColorLensOutlined,
  DeleteForeverOutlined,
  LineWeightOutlined,
  SubdirectoryArrowRightOutlined,
  WidthFullOutlined,
} from '@mui/icons-material';
import ItemRender from '../../lists/items/ItemRender';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ListView = ({
  columns,
  firstElement,
  selectedIndex,
  handleEditElement,
  handleOpenMenu,
  handleAddColumn,
  selectedModuleData,
}) => {
  const { t, i18n } = useTranslation();
  const currentlangCode = i18n.language;

  const screenWidth = window.innerWidth;
  const sevenPerWith = screenWidth * 0.7;
  const [width, setWidth] = useState(screenWidth);

  return (
    <ListItem divider>
      <Droppable droppableId="list" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="d-flex"
            style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
          >
            {columns?.map((col, index) => (
              <Draggable
                key={index}
                draggableId={index.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    id={index}
                    style={{
                      width: `${sevenPerWith * (col?.width / 100)}px`,
                      minWidth: '120px',
                      display: 'flex',
                    }}
                    key={index}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div>
                      <Box
                        height="70px"
                        style={{
                          overflow: 'hidden',
                          width: `${sevenPerWith * (col?.width / 100)}px`,
                          minWidth: '120px',
                          marginBottom: '6px',

                          display: 'flex',
                        }}
                        className="cell-list"
                      >
                        <ItemRender
                          element={firstElement}
                          col={col}
                          isSelected={index === selectedIndex}
                        />
                      </Box>
                      <Divider component="div" />

                      <div className="px-2">
                        <div className="mt-2">
                          <ButtonBase
                            onClick={() =>
                              handleEditElement('weight', col, index)
                            }
                            style={{ paddingLeft: '3px' }}
                          >
                            <LineWeightOutlined />
                            <Typography
                              variant="caption"
                              style={{
                                fontSize: '10px',
                                marginLeft: '2px',
                              }}
                            >
                              {t('weight')}
                            </Typography>
                          </ButtonBase>
                        </div>

                        <div className="mt-2">
                          <ButtonBase
                            onClick={() =>
                              handleEditElement('color', col, index)
                            }
                            style={{ paddingLeft: '3px' }}
                          >
                            <ColorLensOutlined />
                            <Typography
                              variant="caption"
                              style={{
                                fontSize: '10px',
                                marginLeft: '2px',
                              }}
                            >
                              {t('color')}
                            </Typography>
                          </ButtonBase>
                        </div>
                        <div className="mt-2">
                          <ButtonBase
                            onClick={() =>
                              handleEditElement('width', col, index)
                            }
                            style={{ paddingLeft: '3px' }}
                          >
                            <WidthFullOutlined />
                            <Typography
                              variant="caption"
                              style={{
                                fontSize: '10px',
                                marginLeft: '2px',
                              }}
                            >
                              {t('width') + ' (' + col?.width + '%)'}
                            </Typography>
                          </ButtonBase>
                        </div>
                        {selectedModuleData?.listType !== 'listS' && (
                          <div className="mt-2">
                            <ButtonBase
                              onClick={(event) => handleOpenMenu(event, index)}
                              style={{ paddingLeft: '3px' }}
                            >
                              <SubdirectoryArrowRightOutlined />
                              <Typography
                                variant="caption"
                                style={{
                                  fontSize: '10px',
                                  marginLeft: '2px',
                                }}
                              >
                                {t('subData')}
                              </Typography>
                            </ButtonBase>
                          </div>
                        )}
                        <div className="mt-2">
                          <ButtonBase
                            onClick={() =>
                              handleEditElement('remove', col, index)
                            }
                            style={{ paddingLeft: '3px' }}
                          >
                            <DeleteForeverOutlined />
                            <Typography
                              variant="caption"
                              style={{
                                fontSize: '10px',
                                marginLeft: '2px',
                              }}
                            >
                              {t('delete')}
                            </Typography>
                          </ButtonBase>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            <IconButton onClick={handleAddColumn}>
              <Add />
            </IconButton>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </ListItem>
  );
};

export default ListView;
