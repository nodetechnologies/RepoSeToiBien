import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  ListItemIcon,
} from '@mui/material';
import {
  Category,
  Favorite,
  ListAltTwoTone,
  Paid,
  SwitchAccessShortcut,
} from '@mui/icons-material';
import moment from 'moment';

const ItemSelect = ({
  article,
  selectedArticle,
  setSelectedArticle,
  handleItemSelected,
}) => {
  const { t } = useTranslation();
  const [displayOptions, setDisplayOptions] = useState(false);

  const businessPreference = useSelector((state) => state.core.businessData);

  const mainColor = businessPreference?.mainColor || '#36c2b9';

  const selectedStyle = {
    backgroundColor: `${mainColor}09`,
    border: `thin solid ${mainColor}`,
    borderRadius: '8px',
  };

  const calculatePriceRate = (price) => {
    return Number(price / 10000);
  };

  const manageSelected = (item) => {
    setSelectedArticle(item);
    if (item?.options?.length > 0) {
      setDisplayOptions(true);
    } else {
      handleItemSelected(item, null);
    }
  };

  const isSelected =
    (selectedArticle?.id || selectedArticle?.objectID) ===
    (article?.id || article?.objectID);

  return (
    <React.Fragment key={article?.id || article?.objectID}>
      <ListItem
        alignItems="flex-start"
        button
        divider
        dense
        onClick={() => manageSelected(article)}
        style={isSelected ? selectedStyle : null}
      >
        <ListItemAvatar sx={{ width: '8%' }}>
          <Avatar
            src={article?.image_url || ''}
            alt={article?.name}
            sx={{ width: 30, height: 30 }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <span
              className="title"
              dangerouslySetInnerHTML={{
                __html: article?.highlight?.name?.value || article?.name,
              }}
            />
          }
          primaryTypographyProps={{ noWrap: true, fontWeight: 600 }}
          secondary={
            <span
              className="subtitle"
              dangerouslySetInnerHTML={{
                __html:
                  article?.highlight?.sku?.value ||
                  article?.sku ||
                  article?.highlight?.description?.value ||
                  article?.description ||
                  '-',
              }}
            />
          }
          secondaryTypographyProps={{ noWrap: true, fontSize: 10 }}
          sx={{ width: '35%' }}
        />
        <ListItemText
          primary={
            article?.duration
              ? calculatePriceRate(article?.price)?.toFixed(2) +
                (article?.type === 2 ? ' h' : ' $')
              : Number((article?.price || 0) / 10000)?.toFixed(2) + ' $'
          }
          secondary={article?.categoryName || '-'}
          secondaryTypographyProps={{ noWrap: true, fontSize: 10 }}
          sx={{ width: '20%' }}
        />{' '}
        <ListItemText
          primary={article?.targetName || '-'}
          secondary={
            moment
              .unix(
                article?.lastUpdate?.seconds ||
                  article?.lastUpdate?._seconds ||
                  article?.timeStamp
              )
              .format('DD MMM YYYY') || '-'
          }
          secondaryTypographyProps={{ noWrap: true, fontSize: 10 }}
          sx={{ width: '20%' }}
        />
        <ListItemIcon
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          sx={{ width: '4%' }}
        >
          <Favorite
            fontSize="small"
            color={isSelected ? 'primary' : 'disabled'}
          />
        </ListItemIcon>
        <ListItemIcon
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          sx={{ width: '4%' }}
        >
          <div className="d-flex middle-content">
            <Category fontSize="small" color="secondary" />
            <Typography
              variant="body2"
              color="secondary"
              fontWeight={600}
              sx={{ marginLeft: '5px' }}
            >
              {article?.options?.length}
            </Typography>
          </div>
        </ListItemIcon>
        <ListItemIcon
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          sx={{ width: '4%' }}
        >
          <div className="d-flex middle-content">
            <ListAltTwoTone fontSize="small" color="secondary" />
            <Typography
              variant="body2"
              color="secondary"
              fontWeight={600}
              sx={{ marginLeft: '5px' }}
            >
              {article?.nbItems}
            </Typography>
          </div>
        </ListItemIcon>
      </ListItem>
      {displayOptions && (
        <List component="div" disablePadding>
          {selectedArticle?.options?.map((option, index) => (
            <ListItem
              key={index}
              button
              divider
              onClick={() => handleItemSelected(selectedArticle, option)}
              sx={{ pl: 4 }}
            >
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    {option?.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {Number(option?.price / 10000)?.toFixed(2) + ' $'}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </React.Fragment>
  );
};

export default ItemSelect;
