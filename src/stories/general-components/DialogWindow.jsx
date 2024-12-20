import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Button from './Button';

export const DialogWindow = ({
  title,
  subtitle,
  button,
  children,
  open,
  width,
  size,
  onClose,
}) => {
  const StyledDialog = styled(Dialog)({
    '.MuiDialog-paper': {
      borderRadius: '10px',
    },
  });

  const { t } = useTranslation();

  return (
    <div style={{ maxWidth: width === 'small' ? '30vh' : '' }}>
      <StyledDialog
        fullWidth={width === 'large' || width === 'medium' ? true : false}
        maxWidth={width === 'small' ? 'xsm' : width === 'large' ? 'md' : 'sm'}
        open={open}
        onClose={onClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContentText>{subtitle}</DialogContentText>
        <DialogContent
          style={{
            maxHeight: size === 'small' ? '20vh' : '45vh',
            overflow: 'scroll',
          }}
        >
          {children}
        </DialogContent>
        {button && (
          <DialogActions sx={{ padding: '30px' }}>
            <Button label={t('cancel')} onClick={onClose} variant="text" />
            <Button label={button?.label} onClick={button?.action} />
          </DialogActions>
        )}
      </StyledDialog>
    </div>
  );
};

export default DialogWindow;
