import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { useParams, useSearchParams } from 'react-router-dom';
import * as Icons from '@mui/icons-material';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from '../../components/@generalComponents/Card';
import { motion } from 'framer-motion';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { Skeleton } from '@mui/material';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';

const DragDrop = ({
  isTablet,
  activeModule,
  list,
  customizations,
  isLoading,
  activeIndex,
}) => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const { structureId } = useParams();
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cards, setCards] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [searchColumnsId, setSearchColumnsId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const localStorageStart = localStorage.getItem(activeModule?.id + 'start');

  const startTimeStamp = searchParams.get('start')
    ? parseInt(searchParams.get('start'))
    : null;

  const childVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const currentDate = moment
    .unix(startTimeStamp || localStorageStart || '')
    .format('YYYY-MM-DD');

  const listFinal = list?.filter((event) => {
    const dates = event?.dates;
    return dates && dates.includes(currentDate);
  });

  useEffect(() => {
    let formattedCardsStatus = [];

    if (
      activeModule?.list?.preferences?.rangeDates &&
      activeModule?.list?.preferences?.dateField
    ) {
      formattedCardsStatus = listFinal?.map((card) => {
        const status =
          card?.values?.find((value) => value?.structureValue === 'status')
            ?.value || 0;

        return {
          ...card,
          status: card?.status || status,
        };
      });
    } else {
      formattedCardsStatus = list?.map((card) => {
        const status =
          card?.values?.find((value) => value?.structureValue === 'status')
            ?.value || 0;

        return {
          ...card,
          status: card?.status || status,
        };
      });
    }

    formattedCardsStatus = formattedCardsStatus?.sort((a, b) => {
      if (a?.status === 0 && b?.status === 0) {
        return (
          (a?.startDate?.seconds ||
            a?.startDate?._seconds ||
            a?.targetDate?.seconds ||
            a?.targetDate?._seconds) -
          (b?.startDate?.seconds ||
            b?.startDate?._seconds ||
            b?.targetDate?.seconds ||
            b?.targetDate?._seconds)
        );
      }

      if (a?.status === 0) return -1;
      if (b?.status === 0) return 1;

      return (
        (b?.lastUpdate?.seconds || b?.lastUpdate?._seconds) -
        (a?.lstUpdate?.seconds || a?.lastUpdate?._seconds)
      );
    });

    setCards(formattedCardsStatus || []);
  }, [list]);

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const darkerColor = (color) => {
    return chroma(color || '#FFF')
      .darken(0.4)
      .hex();
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeStructure = businessStructure?.structures?.find(
    (structure) => structure.id === structureId
  );

  const statusColumnsOriginal = activeStructure?.fields?.find(
    (field) => field.value === 'status'
  )?.selections;
  const statusesToHide = customizations?.statusesToHide || {};
  const statusColumns = statusColumnsOriginal?.filter(
    (item) => !statusesToHide[item?.value]
  );

  const lastStatus = statusColumns?.length - 1 || 1;

  const handleCards = (elementId, field, value) => {
    if (field === 'assignedToId') {
      const updatedCards = cards?.map((card) => {
        if (card.id === elementId) {
          return {
            ...card,
            assignedToDetails: { ...card?.assignedToDetails, name: value },
          };
        }
        return card;
      });
      setCards(updatedCards);
    }
  };

  const padding = 32;
  const availableWidth = containerWidth - padding;
  const columnWidth =
    statusColumns?.length > 0 ? availableWidth / statusColumns?.length : 100;

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

    const movedCard = cards?.find((card) => card.id === draggableId);
    if (!movedCard) return;

    // Determine the new status based on destination.droppableId
    let newStatus = parseInt(destination?.droppableId || 0);

    // Update the card's status in the state
    const updatedCards = cards?.map((card) => {
      if (card.id === draggableId && newStatus !== 1) {
        return { ...card, status: newStatus };
      }
      if (card.id === draggableId && newStatus === 1) {
        return {
          ...card,
          status: newStatus,
          realStartDate: { seconds: 0, _seconds: 0 },
        };
      }
      return card;
    });

    setCards(updatedCards);
    updatePass(draggableId, newStatus, movedCard);
  }

  const updatePass = async (draggableId, newStatus, movedCard) => {
    let formatedPath = movedCard?.documentPath.split('/');
    formatedPath = formatedPath
      .filter((part) => part !== draggableId)
      .join('/');
    try {
      if (newStatus === lastStatus) {
        setShowConfetti(draggableId);
      }
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'drag-drop-kanban',
          type: 'pulse',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: draggableId,
          elementPath: formatedPath,
          key: 'status',
          value: newStatus,
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'drag-drop-kanban',
          type: 'pulse',
        })
      );
      setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
    } catch (error) {
      console.error(error);
    }
  };

  const widthCal = window.innerWidth - 290;
  const screenWidth = widthCal > 1210 ? 1210 : widthCal;
  const cardWidth =
    statusColumns?.length > 0 ? screenWidth / statusColumns?.length : 100;

  const handleSearch = (e, columnId) => {
    const searchTerm = e.target.value;
    if (searchTerm === '') {
      setCards(listFinal);
      setSearchColumnsId(null);
      return;
    } else {
      // Filter the items in the column based on the search term
      const filteredItems = cards
        ?.filter((item) => item?.status === columnId)
        ?.filter((item) =>
          item?.targetName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      setCards(filteredItems);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div ref={containerRef} className="d-flex mt-3">
        {statusColumns?.map((column) => {
          const IconComponent = Icons[column.icon] || Icons.Error;

          const totals = cards
            ?.filter((card) => card?.status === column?.value)
            ?.reduce(
              (acc, curr) => {
                const financesSubtotal =
                  (curr?.financesSubtotal || curr?.subtotal || 0) / 10000;

                return {
                  statusCount: acc.statusCount + 1,
                  financesSubtotalTotal:
                    acc.financesSubtotalTotal + financesSubtotal,
                };
              },
              { statusCount: 0, financesSubtotalTotal: 0 } // Initial values
            );
          return (
            <Droppable
              key={column?.value}
              droppableId={column?.value?.toString()}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: 'flex',
                    height: '88vh',
                    margin: '4px',
                    width: `${columnWidth}px`,
                    flexDirection: 'column',
                    overflowX: 'hidden',
                    alignItems: 'center',
                    minHeight: '90px',
                    alignContent: 'flex-start',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      padding: '10px',
                      width: `100%`,
                      borderRadius: '10px',
                      height: '40px',
                      maxHeight: '40px',
                      minHeight: '40px',
                      overflowX: 'hidden',
                      color: darkerColor(column?.color),
                      fontSize: '15px',
                      fontWeight: 600,
                      zIndex: 150,
                    }}
                    className="justify-content-between d-flex px-3 middle-content"
                  >
                    {column?.['label_' + currentLangCode] || column?.label}

                    <div>
                      {searchColumnsId === column?.value ? (
                        <>
                          {customizations?.displaySearch && (
                            <input
                              type="search"
                              style={{
                                border: 'none',
                                outline: 'none',
                                width: '100px',
                                backgroundColor: 'transparent',
                              }}
                              placeholder={t('search') + '...'}
                              onChange={(e) => handleSearch(e, column?.value)}
                            />
                          )}
                        </>
                      ) : (
                        <div className="d-flex">
                          <>
                            {customizations?.displaySearch && (
                              <Icons.SearchOutlined
                                htmlColor="#d1cfcf"
                                sx={{ cursor: 'pointer', marginRight: '10px' }}
                                onClick={() =>
                                  setSearchColumnsId(column?.value)
                                }
                              />
                            )}
                          </>

                          <>
                            {customizations?.displayTotal && (
                              <div
                                style={{
                                  marginTop: '2px',
                                  marginRight:
                                    totals?.financesSubtotalTotal > 0
                                      ? '10px'
                                      : '0px',
                                  color: '#d1cfcf',
                                }}
                              >
                                {totals?.financesSubtotalTotal > 0
                                  ? totals?.financesSubtotalTotal + '$'
                                  : ''}
                              </div>
                            )}
                            {customizations?.displayTotal && (
                              <div
                                style={{ marginTop: '2px', marginRight: '4px' }}
                              >
                                {totals?.statusCount}
                              </div>
                            )}
                          </>
                          <IconComponent />
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ overflow: 'scroll', padding: '10px' }}>
                    {isLoading && (
                      <div>
                        {Array.from({
                          length: Math.floor(Math.random() * 4) + 1,
                        }).map((_, index) => (
                          <motion.div
                            variants={childVariants}
                            key={index}
                            className="mx-2 mt-2"
                          >
                            <Skeleton
                              animation="wave"
                              variant="rectangular"
                              width={cardWidth + 'px'}
                              height={100}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {cards?.length > 0 &&
                      cards
                        ?.filter((card) => card?.status === column?.value)
                        ?.map((card, index) => (
                          <Draggable
                            key={card.id}
                            draggableId={String(card.id)}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                style={{
                                  width: '100%',
                                  overflowX: 'hidden',
                                  textAlign: 'center',
                                }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card
                                  cardWidth={columnWidth}
                                  item={card}
                                  activeModule={activeModule}
                                  index={index}
                                  color={column?.color}
                                  key={`${card.id}`}
                                  isTablet={isTablet}
                                  showConfetti={showConfetti}
                                  activeIndex={activeIndex}
                                  handleCards={handleCards}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default DragDrop;
