// Utilities
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';

const CardInput = ({
  updateItem,
  value,
  itemId,
  itemKey,
  type,
  isDarkMode,
}) => {
  const { t } = useTranslation();
  const [valueInput, setValueInput] = useState('');

  useEffect(() => {
    setValueInput(value);
  }, [itemId, value]);

  return (
    <div>
      <TextField
        value={valueInput}
        variant="standard"
        onChange={(event) => setValueInput(event.target.value)}
        key={itemId + itemKey}
        fullWidth
        multiline
        maxRows={Infinity}
        placeholder={t(itemKey)}
        sx={{
          fontSize: '11px',
          borderBottom: isDarkMode && '1px solid #FFFFFF40',
        }}
        margin="none"
        onBlur={(event) => updateItem(event, itemKey, itemId)}
        type={type || 'text'}
        name={itemKey}
        InputProps={{
          disableUnderline: true,
        }}
      />
    </div>
  );
};

export default CardInput;
