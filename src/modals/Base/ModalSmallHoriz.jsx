import React from 'react';

//components
import DialogActions from '@mui/material/DialogActions';
import Button from '../../stories/general-components/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ModalSmallHoriz = ({
  isOpen,
  modalCloseHandler,
  title,
  subTitle,
  btnLabel,
  btnOnClick,
  children,
  textMore,
  actionBtn,
}) => {
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={modalCloseHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="p-3"
      >
        <DialogTitle sx={{ marginBottom: '-15px' }} id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {subTitle}
          </DialogContentText>
        </DialogContent>
        <div className="modal-content">{children}</div>
        <DialogActions>
          {btnLabel && (
            <div className="btn-modal-large">
              <Button
                primary={true}
                label={btnLabel}
                onClick={btnOnClick}
                size="md"
              />
            </div>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalSmallHoriz;
