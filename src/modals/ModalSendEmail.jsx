import { useTranslation } from 'react-i18next';
import ModalSmallVertical from './Base/ModalSmallVertical';
import SendEmail from './SendEmail';
import ModalEmailCard from './ModalEmailCard';

const ModalSendEmail = ({ isOpen, type, modalCloseHandler }) => {
  const { t } = useTranslation();

  return (
    <div>
      <ModalSmallVertical
        isOpen={isOpen}
        title={t('sendEmail')}
        fullWidth
        maxWidth="lg"
        modalCloseHandler={modalCloseHandler}
      >
        {type === 'card' ? (
          <ModalEmailCard type={type} modalCloseHandler={modalCloseHandler} />
        ) : (
          <SendEmail modalCloseHandler={modalCloseHandler} />
        )}
      </ModalSmallVertical>
    </div>
  );
};

export default ModalSendEmail;
