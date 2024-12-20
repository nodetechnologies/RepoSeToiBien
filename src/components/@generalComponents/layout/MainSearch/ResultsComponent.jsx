import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ProjectIcon from '@mui/icons-material/AccountTree';
import moment from 'moment';
import Avatar from '../../../../stories/general-components/Avatar';
import { Info } from '@mui/icons-material';

const ResultsComponent = ({
  results,
  selectedType,
  fromMain,
  fromMainInput,
  onSelectReturn,
  restrict,
  fromVariable,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getIconServiceType = (serviceType) => {
    switch (serviceType) {
      case 0:
        return { icon: <InsertInvitationIcon /> };
      case 1:
        return { icon: <CalendarMonthIcon /> };
      case 2:
        return { icon: <DomainVerificationIcon /> };
      case 3:
        return {
          icon: <ShoppingCartCheckoutIcon />,
        };
      case 9:
        return {
          icon: <AssignmentOutlinedIcon />,
        };
      default:
        return {
          icon: <Info fontSize="small" />,
        };
    }
  };

  const onSelect = (item) => {
    resultTypeConfig[selectedType]?.onSelect
      ? resultTypeConfig[selectedType]?.onSelect(item)
      : navigate(`/app/element`);
  };

  const resultTypeConfig = {
    services: {
      onSelect: (item) =>
        fromMainInput
          ? onSelectReturn(item)
          : fromVariable
          ? onSelectReturn(item?.documentPath, item?.name)
          : navigate(`/app/element/services/${item?.objectID}`),
    },
    articles: {
      onSelect: (item) =>
        fromMainInput
          ? onSelectReturn(item)
          : fromVariable
          ? onSelectReturn(item?.documentPath, item?.name)
          : navigate(`/app/element/articles/${item?.objectID}`),
    },
    contacts: {
      onSelect: (item) =>
        fromMainInput
          ? onSelectReturn({
              name: item?.name,
              id: item?.targetId,
              identifiant: item?.targetId?.split('/')[1],
            })
          : fromVariable
          ? onSelectReturn(item?.documentPath, item?.name)
          : navigate(`/app/element/contacts/${item?.targetId}`),
    },
    grids: {
      onSelect: (item) =>
        fromMainInput
          ? onSelectReturn({
              name: item?.name,
              id: item?.documentPath,
              identifiant: item?.documentIdentifiant,
            })
          : fromVariable
          ? onSelectReturn(item?.documentPath, item?.name)
          : navigate(`/app/element/grids/${item?.documentIdentifiant}`),
    },
    employees: {
      onSelect: (item) =>
        fromMainInput
          ? onSelectReturn({
              name: item?.publicDisplay?.name || item?.displayName,
              id: 'users/' + item?.id,
              identifiant: item?.id,
            })
          : fromVariable
          ? onSelectReturn(
              'users/' + item?.id,
              item?.publicDisplay?.name || item?.displayName
            )
          : null,
    },
    cardsuninvoiced: {
      onSelect: (item) =>
        fromMainInput
          ? onSelectReturn({
              name: item?.name,
              id: 'cardsuninvoiced/' + item?.objectID || item?.id,
              identifiant: item?.objectID || item?.id,
              targetId: item?.targetId,
            })
          : fromVariable
          ? onSelectReturn(item?.documentPath, item?.name)
          : navigate(`/app/finances/cards/${item?.objectID}`),
    },
    cardsinvoiced: {
      onSelect: (item) =>
        fromMainInput
          ? onSelectReturn({
              name: item?.name,
              id: 'cardsinvoiced/' + item?.objectID || item?.id,
              identifiant: item?.objectID || item?.id,
              targetId: item?.targetId,
            })
          : fromVariable
          ? onSelectReturn(item?.documentPath, item?.name)
          : navigate(`/app/finances/cards/${item?.objectID}`),
    },
    cardsexpense: {
      onSelect: (item) =>
        fromMainInput
          ? onSelectReturn({
              name: item?.name,
              id: 'cardsexpense/' + item?.objectID || item?.id,
              identifiant: item?.objectID || item?.id,
              targetId: item?.targetId,
            })
          : fromVariable
          ? onSelectReturn(item?.documentPath, item?.name)
          : navigate(`/app/finances/cards/${item?.objectID}`),
    },
    nodies: {
      onSelect: (item) =>
        fromMainInput
          ? onSelectReturn(item)
          : fromVariable
          ? onSelectReturn(item?.documentPath, item?.name)
          : navigate(`/app/element/nodies?nodyId=${item?.objectID}&tab=0`),
    },
  };

  const formatHighlightedName = (highlightedName) => {
    const parts = highlightedName?.split(/<\/?em>/g);
    return parts?.map((part, index) => {
      const trimmedPart = part.substring(0, 55);
      if (index % 2 === 0) {
        return <React.Fragment key={index}>{trimmedPart}</React.Fragment>;
      } else {
        return (
          <Typography key={index} component="span" sx={{ fontWeight: 'bold' }}>
            {trimmedPart}
          </Typography>
        );
      }
    });
  };

  const resolveResultData = (result, selectedType) => {
    switch (selectedType) {
      case 'services':
        const { icon } = getIconServiceType(result.serviceType);
        return {
          title: formatHighlightedName(result?.name),
          subtitle: result?.description,
          secondaryText: icon,
          icon: (
            <Avatar
              src={result?.image_url}
              sx={{
                objectFit: 'contain',
                maxWidth: `${'40px !important'}`,
                maxHeight: `${'40px !important'}`,
                borderRadius: '6px !important',
                padding: '6px',
              }}
            />
          ),
        };
      case 'articles':
        return {
          title: formatHighlightedName(result?._highlightResult?.name?.value),
          subtitle: result?.desc,
          secondaryText: '',
          icon: (
            <Avatar
              src={result?.image_url}
              sx={{
                maxWidth: `${'40px !important'}`,
                maxHeight: `${'40px !important'}`,
                borderRadius: '6px !important',
                padding: '4px',
              }}
            />
          ),
        };
      case 'grids':
        return {
          title: formatHighlightedName(result?._highlightResult?.name?.value),
          subtitle: result?.note,
          secondaryText: '',
          icon: (
            <Avatar
              src={result?.image_url}
              sx={{
                maxWidth: `${'40px !important'}`,
                maxHeight: `${'40px !important'}`,
                borderRadius: '6px !important',
                padding: '4px',
              }}
            />
          ),
        };
      case 'nodies':
        return {
          title: formatHighlightedName(result?._highlightResult?.name?.value),
          subtitle: result?.desc,
          secondaryTextBottom: result?.no,
          icon: (
            <Avatar
              // src={`https://storage.googleapis.com/avatars_node/${
              //   getEmployeeDetails(result?.targetUser)?.profile?.data?.avatar
              // }.png`}
              sx={{
                maxWidth: `${'40px !important'}`,
                maxHeight: `${'40px !important'}`,
                borderRadius: '6px !important',
                padding: '4px',
              }}
            />
          ),
        };
      case 'contacts':
        return {
          title:
            formatHighlightedName(result?._highlightResult?.firstName?.value) ||
            result?.name,
          subtitle: result?.targetPhone,
          secondaryText: result?.targetEmail?.substring(0, 26),
          icon: <Avatar img={result?.targetAvatar} name={result?.name} />,
          secondaryTextBottom: result?.targetPhone,
        };
      case 'employees':
        return {
          title: result?.publicDisplay?.name || result?.displayName,
          subtitle:
            result?.publicDisplay?.title || result?.publicDisplay?.email || '-',
          secondaryText: '',
          icon: (
            <Avatar
              img={result?.avatar || result?.publicDisplay?.name}
              name={result?.displayName || result?.publicDisplay?.name}
            />
          ),
          secondaryTextBottom: '',
        };
      case 'passes':
        return {
          title: formatHighlightedName(
            result?._highlightResult?.profileName?.value
          ),
          subtitle: result?.serviceName?.substring(0, 32),
          secondaryText: moment(result?.startDate).format('DD MMM YYYY HH:mm'),
          icon: (
            <Avatar
              src={result?.image_url}
              sx={{
                maxWidth: `${'40px !important'}`,
                maxHeight: `${'40px !important'}`,
                borderRadius: '6px !important',
                padding: '4px',
              }}
            />
          ),
          secondaryTextBottom: result?.locationName,
        };
      case 'cardsinvoiced':
        let cardInvoicedIcon;

        if (result?.isProject) {
          cardInvoicedIcon = <ProjectIcon fontSize="small" />;
        } else if (result?.isInvoiced) {
          cardInvoicedIcon = (
            <ReceiptIcon
              color={result?.isPaid ? '' : 'error'}
              fontSize="small"
            />
          );
        } else {
          cardInvoicedIcon = <AssignmentIcon fontSize="small" />;
        }
        return {
          title: result?.name || 'No Name',
          subtitle: result?.clientName || '',
          secondaryText: `${Number(result?.total || 0).toFixed(2)}$`,
          icon: <ListItemIcon>{cardInvoicedIcon}</ListItemIcon>,
        };
      case 'cardsuninvoiced':
        let cardIcon;

        if (result?.isProject) {
          cardIcon = <ProjectIcon fontSize="small" />;
        } else if (result?.isInvoiced) {
          cardIcon = (
            <ReceiptIcon
              color={result?.isPaid ? '' : 'error'}
              fontSize="small"
            />
          );
        } else {
          cardIcon = <AssignmentIcon fontSize="small" />;
        }
        return {
          title: result?.name || 'No Name',
          subtitle: result?.targetDetails?.name || result?.name || '',
          secondaryText: `${Number(
            result?.finances?.total / 10000 || 0
          ).toFixed(2)}$`,
          icon: <ListItemIcon>{cardIcon}</ListItemIcon>,
        };
      case 'cardsexpense':
        let cardIconExpense;

        if (result?.isProject) {
          cardIconExpense = <ProjectIcon fontSize="small" />;
        } else if (result?.isInvoiced) {
          cardIconExpense = (
            <ReceiptIcon
              color={result?.isPaid ? '' : 'error'}
              fontSize="small"
            />
          );
        } else {
          cardIconExpense = <AssignmentIcon fontSize="small" />;
        }
        return {
          title: result?.name || 'No Name',
          subtitle: result?.targetDetails?.name || result?.name || '',
          secondaryText: `${Number(
            result?.finances?.total / 10000 || 0
          ).toFixed(2)}$`,
          icon: <ListItemIcon>{cardIcon}</ListItemIcon>,
        };

      default:
        return {
          title: result?.name || 'No Name',
          subtitle: result?.clientName || '',
          secondaryText: `${Number(result?.total || 0).toFixed(2)}$`,
          icon: <ContentCut fontSize="small" />,
        };
    }
  };

  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  };

  const isRestrictMatch = (result) => {
    if (Array.isArray(restrict)) {
      return restrict.includes(result?.serviceType);
    }
    return result?.serviceType === restrict;
  };

  // Filter results based on the value of restrict
  const filteredResults = restrict
    ? results?.filter((result) => isRestrictMatch(result))
    : results;

  return (
    <div>
      <Paper
        elevation={0}
        sx={{
          width: 405,
          maxWidth: '100%',
          zIndex: '1000',
          position: 'absolute',
          marginLeft: fromMain ? '40px' : '0px',
          borderRadius: '10px',
          marginTop: '-3px',
          maxHeight: '600px',
          overflowY: 'auto ',
        }}
      >
        <MenuList>
          {filteredResults &&
            filteredResults?.map((result, index) => {
              const {
                title,
                subtitle,
                secondaryText,
                icon,
                secondaryTextBottom,
              } = resolveResultData(result, selectedType);

              return (
                <div key={index} onClick={() => onSelect(result)}>
                  <MenuItem dense divider>
                    <ListItemIcon sx={{ width: '15%' }}>{icon}</ListItemIcon>
                    <ListItemText
                      sx={{ width: '50%' }}
                      primary={truncateString(title, 23)}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '12px',
                        textAlign: 'left',
                      }}
                      secondary={truncateString(subtitle, 30)}
                      secondaryTypographyProps={{
                        fontWeight: 300,
                        fontSize: '10px',
                      }}
                    />
                    <ListItemText
                      className="align-right"
                      sx={{ width: '35%', textAlign: 'right' }}
                      primary={
                        typeof secondaryText === 'string' && secondaryText
                          ? secondaryText?.slice(0, 22) +
                            (secondaryText?.length > 21 ? '...' : '')
                          : ''
                      }
                      primaryTypographyProps={{
                        fontWeight: 400,
                        fontSize: '11px',
                        textAlign: 'right',
                      }}
                      secondary={secondaryTextBottom}
                      secondaryTypographyProps={{
                        fontWeight: 300,
                        fontSize: '10px',
                        textAlign: 'right',
                      }}
                    />
                  </MenuItem>
                </div>
              );
            })}
        </MenuList>
      </Paper>
    </div>
  );
};

export default ResultsComponent;
