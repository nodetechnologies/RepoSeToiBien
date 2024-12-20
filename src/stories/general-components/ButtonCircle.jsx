import React from 'react';
import { useSelector } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import * as Icons from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';

export const ButtonCircle = ({
  size,
  icon,
  onClick,
  color,
  backgroundColor,
  type,
  tooltip,
  primary,
  disabled,
}) => {
  const IconComponent = Icons[icon];
  // const userPermission = currentUser?.permission;

  const businessPreference = useSelector((state) => state.core.businessData);

  const isDisabled = false;

  const renderButton = () => (
    <IconButton
      size={size}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      sx={{
        padding: 0.6,
        marginLeft: 0.3,
        maxHeight: icon === 'Diversity1Outlined' ? '26px' : '30px',
        maxWidth: icon === 'Diversity1Outlined' ? '26px' : '30px',
        '&:hover': {
          backgroundColor: '#f9f9f9',
        },
      }}
      aria-label={icon}
    >
      {IconComponent && (
        <IconComponent
          fontSize="inherit"
          htmlColor={primary ? businessPreference?.mainColor : color || 'black'}
        />
      )}
    </IconButton>
  );

  return (
    <>
      {tooltip ? (
        <Tooltip title={tooltip}>
          {isDisabled ? <span>{renderButton()}</span> : renderButton()}
        </Tooltip>
      ) : (
        renderButton()
      )}
    </>
  );
};

export default React.memo(ButtonCircle);
