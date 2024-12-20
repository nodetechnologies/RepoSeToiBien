import React from 'react';

//components
import Button from '../../stories/general-components/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const ModalHuge = ({
  isOpen,
  modalCloseHandler,
  precondition,
  bottomAligned,
  className,
  titleVector,
  title,
  subTitle,
  dataMore,
  btnLabel,
  maxWidth,
  btnOnClick,
  children,
  textMore,
  actionBtn,
  ...rest
}) => {
  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={'xl'}
        sx={{ minHeight: '540px', maxHeight: '100%', borderRadius: '10px' }}
        open={isOpen}
        onClose={modalCloseHandler}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <div>{children}</div>
        </DialogContent>
        <DialogActions>
          {btnOnClick && (
            <Button
              primary={true}
              label={btnLabel}
              onClick={btnOnClick}
              size="md"
            />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalHuge;
