import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

//utilities
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';

//components
import BlockLayout from '../../stories/layout-components/BlockLayout';

import { Responsive, WidthProvider } from 'react-grid-layout';
import ListItemEdit from './ListItemEdit';
import { Box, Drawer } from '@mui/material';
import { useWindowSize } from 'react-use';
import Blocks from '../../stories/layout-components/Block';
import BlockLayoutPublic from '../../stories/layout-components/BlockLayoutPublic';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ElementDetailsContent = ({
  elementData,
  elementId,
  layout,
  layoutPublic,
  publicMode,
  currentElementId,
  setLayout,
  setLayoutPublic,
  editMode,
  displayBorder,
  activeIndex,
  fromList,
  refreshDoc,
}) => {
  const theme = useTheme();
  const { structureId } = useParams();
  const { width, height } = useWindowSize();

  const [rowHeight, setRowHeight] = useState(30);
  const [rowWidth, setRowWidth] = useState(12);
  const [drag, setDrag] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [layoutSelected, setLayoutSelected] = useState(null);

  const businessPreference = useSelector((state) => state.core.businessData);

  const useStyles = makeStyles({
    paper: {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? '#696969 !important'
          : '#FFFFFF !important',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      marginTop: '20px',
      borderRadius: '10px',
      marginLeft: '15%',
      transform: openDrawer ? 'translateY(0)' : `translateY(100%)`,
      transition: theme.transitions.create('transform', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      height: '95vh',
      maxHeight: '100%',
      position: 'fixed',
      bottom: 0,
      width: '35%',
      minWidth: '80%',
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
    },
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1200,
      display: openDrawer ? 'block' : 'none',
    },
  });
  const classes = useStyles();

  const secColor = businessPreference?.secColor || '#ff0000';

  const handleChanges = (layoutData) => {
    setLayout(layoutData);
  };

  const handleChangesPublic = (layoutData) => {
    setLayoutPublic(layoutData);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .react-resizable-handle.react-resizable-handle-se {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin: 5px;
        background-color: ${editMode ? secColor : 'transparent'};
        position: absolute;
        right: 0;
        bottom: 0;
        cursor:${editMode ? 'se-resize' : 'default'} ;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [secColor, editMode]);

  const handleRemoveBlock = (blockI) => {
    const newLayout = layout.filter((block) => block.i !== blockI);
    setLayout(newLayout);
  };
  const handleRemoveBlockPublic = (blockI) => {
    const newLayoutPublic = layoutPublic.filter((block) => block.i !== blockI);
    setLayoutPublic(newLayoutPublic);
  };

  const handleEditBlockContent = (layoutData) => {
    setLayoutSelected(layoutData);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setLayoutSelected(null);
    setOpenDrawer(false);
    refreshDoc();
  };

  useEffect(() => {
    const availableHeight = height - 132;
    const desiredRows = 32;
    setRowHeight(availableHeight / desiredRows);
  }, [height]);

  useEffect(() => {
    const availableWidth = width - 132;
    const desiredRows = 40;
    setRowWidth(availableWidth / desiredRows);
  }, [width]);

  return (
    <Blocks heightPercentage={97.5}>
      <div className="d-flex" style={{ width: '100%', padding: '3px' }}>
        {openDrawer && (
          <div className={classes.backdrop} onClick={handleCloseDrawer}></div>
        )}
        {openDrawer && (
          <Drawer
            classes={{ paper: classes.paper }}
            variant="persistent"
            anchor="bottom"
            open={openDrawer}
            onClose={handleCloseDrawer}
          >
            <Box sx={{ height: '88vh' }}>
              <div className="p-3">
                <ListItemEdit
                  moduleId={null}
                  handleClose={handleCloseDrawer}
                  type={layoutSelected?.contentType}
                  blockIdentifiant={layoutSelected?.i}
                  currentElementId={currentElementId}
                  tabIndex={activeIndex}
                  structureId={layoutSelected?.structureId}
                  from={publicMode ? 'public' : 'business'}
                  data={{
                    list: [elementData],
                    params: layoutSelected?.data,
                    structureId: structureId,
                    type: layoutSelected?.type,
                    match: layoutSelected?.match,
                    onClick: layoutSelected?.action,
                  }}
                />
              </div>
            </Box>
          </Drawer>
        )}
        {editMode === true && !publicMode && (
          <ResponsiveGridLayout
            className="layout"
            style={{ width: '100%', height: '100%' }}
            layouts={{ lg: layout }}
            rowHeight={rowHeight}
            margin={[8, 8]}
            isDraggable={drag}
            allowOverlap={false}
            onLayoutChange={handleChanges}
            cols={{ lg: 12, md: 12, sm: 6, xs: 1, xxs: 1 }}
          >
            {layout &&
              layout?.map((blockLayout) => {
                return (
                  <div key={blockLayout?.i}>
                    <BlockLayout
                      key={`${blockLayout?.i + activeIndex}`}
                      childrenComponent={blockLayout?.contentType}
                      editMode={editMode}
                      setDrag={setDrag}
                      handleRemoveBlock={handleRemoveBlock}
                      heightPercentage={blockLayout?.height}
                      activeIndex={activeIndex}
                      layout={blockLayout}
                      elementDetails={{
                        index: blockLayout?.index,
                        data: blockLayout?.data,
                        header: blockLayout?.header,
                        groups: blockLayout?.groups,
                        type: blockLayout?.type,
                        i: blockLayout?.i,
                      }}
                    />
                  </div>
                );
              })}
          </ResponsiveGridLayout>
        )}

        {editMode === true && publicMode && (
          <ResponsiveGridLayout
            className="layout"
            style={{ width: '100%', height: '100%' }}
            layouts={{ lg: layoutPublic }}
            rowHeight={rowHeight}
            margin={[0, 0]}
            isDraggable={drag}
            allowOverlap={false}
            onLayoutChange={handleChangesPublic}
            cols={{ lg: 12, md: 12, sm: 6, xs: 1, xxs: 1 }}
          >
            {layoutPublic &&
              layoutPublic?.map((blockLayout) => {
                return (
                  <div key={blockLayout?.i}>
                    <BlockLayoutPublic
                      key={`${blockLayout?.i + activeIndex}`}
                      childrenComponent={blockLayout?.contentType}
                      editMode={editMode}
                      setDrag={setDrag}
                      handleRemoveBlock={handleRemoveBlockPublic}
                      heightPercentage={blockLayout?.height}
                      activeIndex={activeIndex}
                      layout={blockLayout}
                      componentData={blockLayout?.componentData}
                      elementDetails={{
                        index: blockLayout?.index,
                        data: blockLayout?.data,
                        header: blockLayout?.header,
                        groups: blockLayout?.groups,
                        type: blockLayout?.type,
                        i: blockLayout?.i,
                      }}
                    />
                  </div>
                );
              })}
          </ResponsiveGridLayout>
        )}

        {elementData?.id === elementId && !editMode && publicMode && (
          <ResponsiveGridLayout
            className="layout"
            style={{ width: '100%', height: '100%' }}
            layouts={{ lg: layoutPublic }}
            rowHeight={rowHeight}
            margin={[0, 0]}
            isDraggable={false}
            allowOverlap={false}
            cols={{ lg: 12, md: 12, sm: 6, xs: 1, xxs: 1 }}
          >
            {layoutPublic &&
              layoutPublic?.map((blockLayout) => {
                return (
                  <motion.div
                    key={blockLayout.i}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: '100%',
                    }}
                  >
                    {blockLayout?.index === activeIndex && (
                      <BlockLayoutPublic
                        key={`${blockLayout.i + activeIndex}`}
                        childrenComponent={blockLayout?.contentType}
                        editMode={editMode}
                        fromList={fromList}
                        activeIndex={activeIndex}
                        blockWidth={(blockLayout.w * rowWidth) / 12}
                        handleEditBlockContent={handleEditBlockContent}
                        heightPercentage={
                          blockLayout?.height ||
                          (blockLayout.h * rowHeight) / 12
                        }
                        layout={blockLayout}
                        componentData={blockLayout?.componentData}
                        elementDetails={{
                          data: blockLayout?.data,
                          header: blockLayout?.header,
                          type: blockLayout?.type,
                          elementData: elementData,
                          groups: blockLayout?.groups,
                          i: blockLayout?.i,
                          index: blockLayout?.index,
                          displayBorder: displayBorder,
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
          </ResponsiveGridLayout>
        )}

        {elementData?.id === elementId && !editMode && !publicMode && (
          <ResponsiveGridLayout
            className="layout"
            style={{ width: '100%', height: '100%' }}
            layouts={{ lg: layout }}
            rowHeight={rowHeight}
            margin={[8, 8]}
            isDraggable={false}
            allowOverlap={false}
            cols={{ lg: 12, md: 12, sm: 6, xs: 1, xxs: 1 }}
          >
            {layout &&
              layout?.map((blockLayout) => {
                return (
                  <motion.div
                    key={blockLayout.i}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: '100%',
                    }}
                  >
                    {blockLayout?.index === activeIndex && (
                      <BlockLayout
                        key={`${blockLayout.i + activeIndex}`}
                        childrenComponent={blockLayout?.contentType}
                        editMode={editMode}
                        fromList={fromList}
                        activeIndex={activeIndex}
                        blockWidth={(blockLayout.w * rowWidth) / 12}
                        handleEditBlockContent={handleEditBlockContent}
                        heightPercentage={
                          blockLayout?.height ||
                          (blockLayout.h * rowHeight) / 12
                        }
                        layout={blockLayout}
                        elementDetails={{
                          data: blockLayout?.data,
                          header: blockLayout?.header,
                          type: blockLayout?.type,
                          elementData: elementData,
                          groups: blockLayout?.groups,
                          i: blockLayout?.i,
                          index: blockLayout?.index,
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
          </ResponsiveGridLayout>
        )}
      </div>
    </Blocks>
  );
};

export default ElementDetailsContent;
