import React from 'react';

//components
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ModalSmallVertical = ({
  isOpen,
  modalCloseHandler,
  precondition,
  bottomAligned,
  className,
  titleVector,
  title,
  subTitle,
  fullWidth,
  btnLabel,
  maxWidth,
  btnOnClick,
  children,
  textMore,
  actionBtn,
  isSmall,
  ...rest
}) => {
  return (
    <>
      <Dialog
        maxWidth={maxWidth || 'xs'}
        open={isOpen}
        onClose={modalCloseHandler}
        fullWidth={fullWidth}
        sx={{
          margin: fullWidth && '80px',
        }}
      >
        <DialogTitle>
          {title}
          <IconButton
            aria-label="close"
            onClick={modalCloseHandler}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{subTitle}</DialogContentText>
          <div className="modal-content">{children}</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalSmallVertical;
