import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const ModalLarge = ({
  isOpen,
  modalCloseHandler,
  title,
  fullWidth,
  maxWidth,
  children,
}) => {
  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth || 'md'}
      open={isOpen}
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: '86vh',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '850px',
        },
      }}
      onClose={modalCloseHandler}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        sx={{
          maxHeight: '68vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalLarge;
