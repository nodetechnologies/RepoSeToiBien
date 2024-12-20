import React, { useEffect, useState, useRef } from 'react';
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import MainSearch from '../../components/@generalComponents/layout/MainSearch/MainSearch.jsx';
import DatePickerButton from '../../stories/general-components/DatePickerButton';
import RangePickerButton from '../../stories/general-components/RangePickerButton';
import * as Icons from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  Divider,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
  Tabs,
  Badge,
  Switch,
  Tab,
  Toolbar,
  ButtonBase,
  Box,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase.js';
import DialogWindow from '../../stories/general-components/DialogWindow.jsx';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction.js';
import TagSelectorMenu from '../../stories/general-components/TagSelectorMenu.jsx';

const TopNavBar = ({
  isTablet,
  pageTitle,
  actions,
  isMobile,
  searchActivated,
  elementId,
  formatedPath,
  manualIndex,
  tabs,
  sectionTitle,
  subTitle,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { pathname: currentPath } = useLocation();
  const longPressTimeout = useRef(null);
  const { moduleName, moduleId, structureId } = useParams();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [searchParams, setSearchParams] = useSearchParams();

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const modules = businessStructure?.modules || [];
  const activeModule = modules?.find((m) => m.id === moduleId);
  const localStorageStart = localStorage.getItem(activeModule?.id + 'start');
  const localStorageEnd = localStorage.getItem(activeModule?.id + 'end');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorElSelect, setAnchorElSelect] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [longPress, setLongPress] = useState(false);
  const [tagsValue, setTagsValue] = useState(actions?.tags);
  const [dialogOpenCells, setDialogOpenCells] = useState(false);
  const [dateRange, setDateRange] = useState([
    activeModule?.list?.preferences?.customizations?.backToToday
      ? moment().startOf('day')?.format('YYYY-MM-DD')
      : localStorageStart
      ? moment.unix(localStorageStart)?.format('YYYY-MM-DD')
      : moment().startOf('day').format('YYYY-MM-DD'),
    activeModule?.list?.preferences?.customizations?.backToToday
      ? moment().endOf('day')?.format('YYYY-MM-DD')
      : localStorageEnd
      ? moment.unix(localStorageEnd)?.format('YYYY-MM-DD')
      : moment().endOf('day').format('YYYY-MM-DD'),
  ]);
  const [currentSelect, setCurrentSelect] = useState();
  const [openSelect, setOpenSelect] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleDateRangeChange = (newDateRange) => {
    setSearchParams(searchParams);
    if (actions?.onChangeDateRange?.rangeDates === 'single') {
      setDateRange([newDateRange[0], newDateRange[0]]);
      searchParams.set('startDate', newDateRange[0]?.format('YYYY-MM-DD'));
      searchParams.set('endDate', newDateRange[1]?.format('YYYY-MM-DD'));
      actions?.onChangeDateRange?.action &&
        actions?.onChangeDateRange.action([newDateRange[0], newDateRange[0]]);
    } else if (actions?.onChangeDateRange?.rangeDates !== 'none') {
      setDateRange(newDateRange);
      searchParams.set('startDate', newDateRange[0]?.format('YYYY-MM-DD'));
      searchParams.set('endDate', newDateRange[1]?.format('YYYY-MM-DD'));
      actions?.onChangeDateRange?.action &&
        actions?.onChangeDateRange.action(newDateRange);
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const InnerShadowIconButton = ({ icon, onClick, disabled, noMargin }) => {
    const IconComponent = Icons[icon] || Icons.Error;

    return (
      <IconButton
        size="large"
        edge="start"
        color="black"
        onClick={onClick}
        disabled={disabled}
        sx={{
          ml: noMargin ? 0 : 1,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF',
          padding: '0px',
          height: '42px',
          minHeight: '42px',
          width: '42px',
          maxHeight: '42px',
          position: 'relative',
          '& svg': {
            position: 'relative',
            zIndex: 2,
          },
        }}
      >
        <IconComponent color={isDarkMode ? 'white' : 'black'} />
      </IconButton>
    );
  };

  const updateTabIndexInURL = (index) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('tab', index);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  const handleTabChange = (event, id) => {
    setActiveIndex(id);
    updateTabIndexInURL(id);
  };

  const businessPreference = useSelector((state) => state.core.businessData);
  const currentUser = useSelector((state) => state.core.user);

  const activeStructure = businessStructure?.structures?.find(
    (structure) => structure.id === structureId
  );
  const businessModules = businessStructure?.modules;

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const tab = parseInt(searchParams.get('tab'));
  //   if (tab && tab !== activeIndex) {
  //     setActiveIndex(tab);
  //   }
  // }, []);

  const handleTags = (event) => {
    setClicked(!clicked);
  };

  const handleClose = () => {
    setClicked(false);
  };

  const handleTagsChange = async (event, newValue) => {
    setTagsValue(newValue);
    try {
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: elementId,
          elementPath: formatedPath || 'cards',
          key: 'tags',
          value: newValue,
        },
      });
    } catch (error) {
      console.error('Error set tags');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const handleIsFeatured = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: elementId,
          elementPath: formatedPath || 'cards',
          key: 'isFeatured',
          value: !actions?.isFeatured,
        },
      });
    } catch (error) {
      console.error('Error set isFeatured');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const getModuleName = () => {
    const module = businessModules?.find((m) => m.id === moduleId);

    if (pageTitle) {
      return pageTitle;
    }

    return module?.name;
  };

  const history = localStorage.getItem('history')
    ? JSON.parse(localStorage.getItem('history'))
    : [];

  const filtredHistory = history.filter(
    (loc) => loc.businessId === businessPreference?.id
  );

  const navigateBack = () => {
    const history = localStorage.getItem('history')
      ? JSON.parse(localStorage.getItem('history'))
      : [];
    const lastElementMinusOne = history[history?.length - 2];
    navigate(lastElementMinusOne?.url || lastElementMinusOne?.pathname);
  };

  const handleSelect = (item) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('selection', item?.value);
    navigate(`${pathname}?${searchParams.toString()}`);
    setCurrentSelect(item);
    setAnchorElSelect(null);
    setOpenSelect(false);
  };

  const handleCloseSelect = () => {
    setAnchorElSelect(null);
    setOpenSelect(false);
  };

  const handleOpenSelect = () => {
    setAnchorElSelect(anchorElSelect);
    setOpenSelect(true);
  };

  const cellsFormatted = actions?.cells?.[0]?.ids?.map((cell) => {
    const cellId = cell.toString();
    let id;
    let name;

    if (cell.toString().endsWith('mondaycom')) {
      id = cellId.split('mondaycom')[0];
      name = 'mondaycom';
    } else if (cell.toString().endsWith('trello')) {
      id = cellId.split('trello')[0];
      name = 'trello';
    } else if (cell.toString().endsWith('quickbooks')) {
      id = cellId.split('quickbooks')[0];
      name = 'quickbooks';
    } else if (cell.toString().endsWith('vln')) {
      id = cellId.split('vln')[0];
      name = 'vln';
    } else {
      id = cellId;
    }

    return {
      id: id,
      name: name,
    };
  });

  const handleButtonPress = (e) => {
    setLongPress(false);
    longPressTimeout.current = setTimeout(() => {
      setLongPress(true);
      setMenuAnchor(e.target);
    }, 750);
  };

  const handleButtonRelease = () => {
    clearTimeout(longPressTimeout.current);
    if (!longPress) {
      navigateBack();
    }
  };

  const openCells = () => {
    setDialogOpenCells(true);
  };

  const handleCellSelect = (cell) => {};

  return (
    <div
      style={{
        position: 'relative',
        height: '55px',
        maxHeight: '55px',
        paddingBottom: '20px',
        minHeight: '55px',
      }}
    >
      <DialogWindow
        title={t('cells')}
        open={dialogOpenCells}
        size={'medium'}
        width={'medium'}
        onClose={() => setDialogOpenCells(false)}
      >
        <div>
          <List>
            {cellsFormatted &&
              cellsFormatted?.map((cell, idx) => (
                <ListItem
                  key={idx}
                  divider
                  onClick={() => handleCellSelect(cell)}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{ width: '30px', height: '30px' }}
                      src={`/assets/v3/connectors/${cell?.name}.png`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={cell?.id}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: isDarkMode ? '#FFF' : '#000',
                    }}
                  />
                </ListItem>
              ))}
          </List>
        </div>
      </DialogWindow>
      <Toolbar
        sx={{
          height: '45px',
          minHeight: '45px',
          maxHeight: '45px',
          borderRadius: '12px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'left',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
          flex={searchActivated ? 7 : 4}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
              marginRight: '40px',
              maxWidth: searchActivated ? '200px' : '22vh',
              minWidth: searchActivated ? '200px' : '22vh',
            }}
            flex={searchActivated ? 4 : 2}
          >
            <div style={{ marginTop: '5px' }}>
              <Tooltip title={getModuleName(pageTitle, currentLanguage)}>
                <span>
                  <Typography
                    sx={{
                      maxWidth: '22vh',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: isDarkMode ? '#FFF' : '#000',
                      whiteSpace: 'nowrap',
                    }}
                    fontSize={isTablet ? '16px' : '20px'}
                    fontWeight={700}
                  >
                    {actions?.editLayout?.display
                      ? t('editMode')
                      : getModuleName(pageTitle, currentLanguage)}
                  </Typography>
                </span>
              </Tooltip>

              <div className="d-flex" style={{ marginTop: '-5px' }}>
                <div className="">
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    elevation={3}
                    sx={{
                      marginTop: '18px',
                      marginLeft: '-14px',
                      '& .MuiPaper-root': {
                        borderRadius: '12px',
                      },
                    }}
                  >
                    {filtredHistory?.map((loc, index) => (
                      <MenuItem
                        divider
                        dense
                        key={index}
                        onClick={() => navigate(loc?.pathname)}
                      >
                        <div>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            fontSize="12px"
                            style={{
                              color: isDarkMode ? '#FFFFFF' : '#000000',
                            }}
                          >
                            {loc?.name}
                          </Typography>

                          <Typography
                            variant="body1"
                            fontWeight={400}
                            fontSize="11px"
                            style={{
                              color: isDarkMode ? '#ffffff60' : '#00000060',
                            }}
                          >
                            {loc?.moduleName}
                          </Typography>
                        </div>
                      </MenuItem>
                    ))}
                  </Menu>
                  <Tooltip title={t('navigateBack')}>
                    <IconButton
                      sx={{
                        width: '25px',
                        height: '25px',
                        maxHeight: '25px',
                        maxWidth: '25px',
                        minWidth: '25px',
                        borderRadius: '50%',
                        padding: '0px',
                        marginLeft: '-5px',
                      }}
                      size="medium"
                      onMouseDown={handleButtonPress}
                      onMouseUp={handleButtonRelease}
                      onTouchStart={handleButtonPress}
                      onTouchEnd={handleButtonRelease}
                    >
                      <Icons.ArrowBack
                        sx={{
                          fontSize: '16px',
                        }}
                        htmlColor={isDarkMode ? '#ffffff60' : '#00000060'}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                <div>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: 'grey',
                      marginTop: '4.5px',
                      whiteSpace: 'nowrap',
                    }}
                    fontSize={isTablet ? '10px' : '11px'}
                    fontWeight={300}
                  >
                    {(activeStructure?.name || subTitle || pageTitle || '') +
                      (sectionTitle ? ' - ' + (sectionTitle || '') : '')}
                  </Typography>
                </div>
              </div>
            </div>
          </Box>
          {!currentPath?.startsWith('/app/element') && searchActivated && (
            <motion.div
              initial={{ width: searchActivated ? '15vh' : '0vh' }}
              animate={{
                width: clicked ? '20vh' : searchActivated ? '15vh' : '0vh',
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  minWidth: clicked ? '20vh' : searchActivated ? '15vh' : '0vh',
                }}
                flex={clicked ? 7 : 4}
              >
                <div>
                  <MainSearch
                    userLogged={true}
                    userType="business"
                    isDarkMode={isDarkMode}
                    structureCollection={activeStructure?.collectionField}
                    setClicked={setClicked}
                    clicked={clicked}
                  />
                </div>
              </Box>
            </motion.div>
          )}
          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
            initial={{ width: '30vh' }}
            animate={{ width: clicked ? '20vh' : '30vh' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
              flex={clicked ? 3 : 6}
            >
              {actions?.cells && !clicked && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Tooltip title={t('cells')}>
                    <span>
                      <IconButton
                        size="large"
                        edge="start"
                        color="black"
                        onClick={openCells}
                        sx={{
                          ml: 1,
                          backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF',
                        }}
                      >
                        <Badge
                          badgeContent={cellsFormatted?.length}
                          color="white"
                          sx={{
                            color: isDarkMode ? '#FFF' : '#000',
                          }}
                        >
                          <Icons.HubOutlined
                            color={isDarkMode ? 'white' : 'black'}
                          />
                        </Badge>
                      </IconButton>
                    </span>
                  </Tooltip>
                </motion.div>
              )}
              {actions?.share && !clicked && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Tooltip title={t('sharableLink')}>
                    <span>
                      <InnerShadowIconButton
                        icon="LinkOutlined"
                        onClick={actions?.share}
                        disabled={actions?.share === 'disabled'}
                      />
                    </span>
                  </Tooltip>
                </motion.div>
              )}
              {actions?.refresh && !actions?.editLayout?.display && (
                <motion.div whileHover={{ scale: 1.2, rotate: 90 }}>
                  <Tooltip title={t('refresh')}>
                    <InnerShadowIconButton
                      icon="LoopOutlined"
                      onClick={actions?.refresh}
                      disabled={actions?.refresh === 'disabled'}
                    />
                  </Tooltip>
                </motion.div>
              )}
              {actions?.importCSV &&
                !actions?.editLayout?.display &&
                !clicked && (
                  <motion.div whileHover={{ scale: 1.2, rotate: 90 }}>
                    <Tooltip title={t('import')}>
                      <InnerShadowIconButton
                        icon="UploadFileOutlined"
                        onClick={actions?.importCSV}
                      />
                    </Tooltip>
                  </motion.div>
                )}
              {actions?.filters &&
                actions?.setFilters &&
                !actions?.editLayout?.display && (
                  <motion.div whileHover={{ scale: 1.2, rotate: 90 }}>
                    <Tooltip title={t('filters')}>
                      <InnerShadowIconButton
                        icon="TuneOutlined"
                        onClick={actions?.setFilters}
                        disabled={actions?.setFilters === 'disabled'}
                      />
                    </Tooltip>
                  </motion.div>
                )}{' '}
              {actions?.add && !actions?.editLayout?.display && !clicked && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Tooltip title={t('create')}>
                    <InnerShadowIconButton
                      icon="Add"
                      onClick={actions?.add}
                      disabled={actions?.add === 'disabled'}
                    />
                  </Tooltip>
                </motion.div>
              )}
              {actions?.edit && !actions?.editLayout?.display && !clicked && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Tooltip title={t('edit')}>
                    <InnerShadowIconButton
                      icon="EditOutlined"
                      onClick={actions?.edit}
                      disabled={actions?.edit === 'disabled'}
                    />
                  </Tooltip>
                </motion.div>
              )}
              {actions?.save && !actions?.editLayout?.display && !clicked && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Tooltip title={t('save')}>
                    <InnerShadowIconButton
                      icon="SaveOutlined"
                      onClick={actions?.save}
                      disabled={actions?.save === 'disabled'}
                    />
                  </Tooltip>
                </motion.div>
              )}
              {actions?.editLayout?.display &&
                (actions?.editLayout?.addBlock ||
                  actions?.editLayout?.addBlockPublic) &&
                !clicked && (
                  <motion.div whileHover={{ scale: 1.2 }}>
                    <Tooltip title={t('addBlock')}>
                      <InnerShadowIconButton
                        icon="AddBoxOutlined"
                        onClick={
                          actions?.editLayout?.displayPublic
                            ? actions?.editLayout?.addBlockPublic
                            : actions?.editLayout?.addBlock
                        }
                        disabled={actions?.editLayout?.addBlock === 'disabled'}
                      />
                    </Tooltip>
                  </motion.div>
                )}
              <div
                className="d-flex middle-content"
                style={{
                  backgroundColor: isDarkMode ? '#000' : '#FFF',
                  borderRadius: '30px',
                  marginLeft: '8px',
                }}
              >
                {actions?.previous && !actions?.editLayout?.display && (
                  <Tooltip title={t('previous')}>
                    <span>
                      <InnerShadowIconButton
                        noMargin
                        icon="ArrowBackIos"
                        onClick={actions?.previous}
                        disabled={
                          actions?.previous === 'disabled' ||
                          actions?.currentPage === 1
                        }
                      />
                    </span>
                  </Tooltip>
                )}
                {actions?.currentPage &&
                  !actions?.editLayout?.display &&
                  actions?.next && (
                    <Typography
                      variant="subtitle1"
                      component="div"
                      fontWeight={600}
                    >
                      {actions?.currentPage}
                    </Typography>
                  )}
                {actions?.next && !actions?.editLayout?.display && (
                  <Tooltip title={t('next')}>
                    <span>
                      <InnerShadowIconButton
                        icon="ArrowForwardIos"
                        onClick={actions?.next}
                        disabled={actions?.next === 'disabled'}
                      />
                    </span>
                  </Tooltip>
                )}
              </div>
              {actions?.deleteItem && !actions?.editLayout?.display && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  {(currentUser?.activeBusiness?.role === 'SUPER-ADMIN' ||
                    currentUser?.activeBusiness?.role === 'ADMIN') && (
                    <Tooltip title={t('delete')}>
                      <InnerShadowIconButton
                        icon="DeleteOutlineOutlined"
                        onClick={actions?.deleteItem}
                        disabled={actions?.deleteItem === 'disabled'}
                      />
                    </Tooltip>
                  )}
                </motion.div>
              )}
              {actions?.select && (
                <div id="select">
                  <ButtonBase
                    sx={{
                      backgroundColor: 'success',
                      color: 'black',
                      fontWeight: 500,
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      paddingTop: '3px',
                      fontSize: '13.5px',
                    }}
                    onClick={handleOpenSelect}
                  >
                    {currentSelect?.label || t('select')}
                  </ButtonBase>

                  <Menu
                    anchorEl={anchorElSelect}
                    open={openSelect}
                    onClose={handleCloseSelect}
                    PaperProps={{
                      style: {
                        maxHeight: 400,
                        width: 200,
                      },
                    }}
                  >
                    {actions?.select?.map((item, idx) => (
                      <MenuItem key={idx} onClick={() => handleSelect(item)}>
                        {item?.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              )}
              {actions?.payment && !actions?.editLayout?.display && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Tooltip title={t('addPayment')}>
                    <InnerShadowIconButton
                      icon="MonetizationOnOutlined"
                      onClick={actions?.payment}
                      disabled={actions?.payment === 'disabled'}
                    />
                  </Tooltip>
                </motion.div>
              )}
              {actions?.email && !actions?.editLayout?.display && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Tooltip title={t('sendEmail')}>
                    <InnerShadowIconButton
                      icon="EmailOutlined"
                      onClick={actions?.email}
                      disabled={actions?.email === 'disabled'}
                    />
                  </Tooltip>
                </motion.div>
              )}
              {actions?.print && !actions?.editLayout?.display && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Tooltip title={t('print')}>
                    <InnerShadowIconButton
                      icon="LocalPrintshopOutlined"
                      onClick={actions?.print}
                      disabled={actions?.print === 'disabled'}
                    />
                  </Tooltip>
                </motion.div>
              )}
              {actions?.convert?.action && !actions?.editLayout?.display && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Tooltip title={actions?.convert?.tooltip}>
                    <InnerShadowIconButton
                      icon="PriceCheckOutlined"
                      onClick={actions?.convert?.action}
                      disabled={actions?.convert?.action === 'disabled'}
                    />
                  </Tooltip>
                </motion.div>
              )}
              {elementId && !actions?.editLayout?.display && (
                <motion.div
                  initial={{ width: '15vh' }} // Initial width
                  animate={{ width: clicked ? '270px' : '15vh' }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="d-flex middle-content"
                >
                  <motion.div whileHover={{ scale: 1.2 }}>
                    <Tooltip title={t('manageTags')}>
                      <InnerShadowIconButton
                        icon={
                          actions?.tags?.length > 0
                            ? 'LocalOffer'
                            : 'LocalOfferOutlined'
                        }
                        onClick={anchorEl ? handleClose : handleTags}
                      />
                    </Tooltip>
                  </motion.div>

                  {clicked && (
                    <div
                      style={{
                        width: clicked ? '250px' : '0px',
                        marginRight: '10px',
                      }}
                    >
                      <TagSelectorMenu
                        key={elementId}
                        fullWidth
                        error={null}
                        required={false}
                        label={t('tags')}
                        value={tagsValue}
                        fieldType={'tags'}
                        onChange={handleTagsChange}
                      />
                    </div>
                  )}
                </motion.div>
              )}
              {elementId && !actions?.editLayout?.display && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Tooltip title={t('isFeatured')}>
                    <InnerShadowIconButton
                      icon={
                        actions?.isFeatured === true
                          ? 'FavoriteOutlined'
                          : 'FavoriteBorderOutlined'
                      }
                      onClick={handleIsFeatured}
                    />
                  </Tooltip>
                </motion.div>
              )}
              <Divider
                component="div"
                orientation="vertical"
                flexItem
                sx={{
                  height: '30px',
                  marginTop: '12px',
                  ml: 1,
                }}
              />
              {actions?.editLayout &&
                currentUser?.activeBusiness?.role === 'SUPER-ADMIN' && (
                  <motion.div whileHover={{ scale: 1.2 }}>
                    <Tooltip title={t('editLayout')}>
                      <InnerShadowIconButton
                        icon={
                          actions?.editLayout?.display
                            ? 'SaveOutlined'
                            : 'ViewQuiltOutlined'
                        }
                        onClick={
                          actions?.editLayout?.displayPublic
                            ? actions?.editLayout?.actionPublic
                            : actions?.editLayout?.action
                        }
                      />
                    </Tooltip>
                  </motion.div>
                )}
              {actions?.editLayout?.publicAccessAction &&
                currentUser?.activeBusiness?.role === 'SUPER-ADMIN' && (
                  <motion.div whileHover={{ scale: 1.2 }}>
                    <Tooltip title={t('publicAccessMode')}>
                      <div onClick={actions?.editLayout?.publicAccessAction}>
                        <Switch
                          checked={
                            actions?.editLayout?.publicAccess ? true : false
                          }
                          color="primary"
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          disabled
                          className="middle-content"
                          sx={{
                            marginTop: '6px',
                            marginLeft: '10px',
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: isDarkMode
                                ? '#FFF'
                                : businessPreference?.mainColor,
                              width: '60px',
                              height: '25px',
                            },
                            '& .MuiSwitch-thumb': {
                              width: '24px',
                              height: '24px',
                              marginTop: actions?.editLayout?.publicAccess
                                ? '-1px'
                                : '-9px',
                            },

                            height: '25px',
                            '& .MuiSwitch-track': {
                              borderRadius: '20px',
                              height: '25px',
                              marginTop: '0px',
                            },
                            width: '75px',
                            maxWidth: '75px',
                          }}
                        />
                      </div>
                    </Tooltip>
                  </motion.div>
                )}
              {actions?.settings &&
                (currentUser?.activeBusiness?.role === 'SUPER-ADMIN' ||
                  currentUser?.activeBusiness?.role === 'ADMIN') && (
                  <motion.div whileHover={{ scale: 1.2 }}>
                    <Tooltip title={t('pageParams')}>
                      <IconButton
                        size="large"
                        edge="start"
                        color="black"
                        onClick={actions?.settings}
                        sx={{
                          ml: 1,
                          backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF',
                        }}
                      >
                        <Icons.SettingsOutlined
                          color={isDarkMode ? 'white' : 'black'}
                        />
                      </IconButton>
                    </Tooltip>
                  </motion.div>
                )}
              {actions?.date && !actions?.editLayout?.display && (
                <div style={{ marginLeft: '8px' }}>
                  <DatePickerButton
                    formatDensity="dense"
                    value={actions?.date}
                    onChange={actions?.onChangeDate}
                  />
                </div>
              )}
              {actions?.onChangeDateRange && !actions?.editLayout?.display && (
                <div style={{ marginLeft: '8px' }}>
                  <RangePickerButton
                    formatDensity="dense"
                    value={dateRange}
                    type={actions?.onChangeDateRange?.rangeDates}
                    onChange={handleDateRangeChange}
                  />
                </div>
              )}
            </Box>
          </motion.div>

          {actions?.approve && !actions?.editLayout?.display && (
            <ButtonBase
              sx={{
                borderRadius: '10px',
                backgroundColor: 'success',
                color: 'black',
                fontWeight: 500,
                fontSize: '12px',
              }}
              onClick={actions?.approve}
            >
              {t('sendApproval')}
            </ButtonBase>
          )}
        </Box>

        <Box
          sx={{
            alignItems: 'right',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          flex={2}
        >
          <Tabs
            sx={{
              height: '42px',
              maxHeight: '42px',
              minHeight: '42px',
              backgroundColor: '#FFF',
              borderRadius: '40px',
              position: 'relative',
              overflow: 'hidden',
              '.MuiTabs-indicator': {
                display: 'none',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '100%',
                width: '100%',
                borderRadius: '4px',
                transition: 'transform 0.3s ease-in-out',
                zIndex: 1,
                transform: `translateX(${(manualIndex ?? activeIndex) * 100}%)`,
              },
            }}
            value={manualIndex ?? activeIndex}
            onChange={actions?.editLayout?.display ? null : handleTabChange}
          >
            {tabs &&
              tabs
                ?.filter((tab) => tab?.label || tab?.name)
                ?.map((tab, index) => {
                  return (
                    <Tab
                      label={isMobile ? '' : tab?.label || tab?.name}
                      key={'tab' + tab?.label || tab?.name}
                      style={{
                        fontWeight:
                          (manualIndex ?? activeIndex) === index
                            ? '600'
                            : '500',
                        textTransform: 'capitalize',
                        padding: '10px 20px 10px 20px',
                        fontSize: '13px',
                      }}
                      sx={{
                        position: 'relative',
                        zIndex: 2,

                        minHeight: '42px',
                        maxHeight: '42px',

                        height: '42px',
                        color:
                          (manualIndex ?? activeIndex) !== index
                            ? '#000000 !important'
                            : '#FFFFFF !important',
                        backgroundColor:
                          (manualIndex ?? activeIndex) === index
                            ? businessPreference?.mainColor
                            : 'transparent',
                        minWidth: isMobile ? '30px' : '',
                        borderRadius: '30px',
                        transition: 'color 0.3s ease-in-out',
                        '&:hover': {
                          color: '#FFFFFF',
                        },
                      }}
                    />
                  );
                })}
          </Tabs>
        </Box>
        {actions?.editLayout?.display && (
          <motion.div whileHover={{ scale: 1.2 }}>
            <Tooltip title={t('addTab')}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                onClick={
                  actions?.editLayout?.displayPublic
                    ? actions?.editLayout?.addTabPublic
                    : actions?.editLayout?.addTab
                }
                sx={{ ml: 1, backgroundColor: '#FFF' }}
              >
                <Icons.Add />
              </IconButton>
            </Tooltip>
          </motion.div>
        )}
      </Toolbar>
    </div>
  );
};

export default TopNavBar;
