import React from 'react';
import ModalSmallHoriz from '../modals/Base/ModalSmallHoriz';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../stories/general-components/Button';

const ModalAppointmentConfirmation = ({
  isOpen,
  modalCloseHandler,
  cardId,
  title,
  selectAppointment,
  removeAppointment,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const openCard = () => {
    navigate(`/app/finances/cards/${cardId}`);
    modalCloseHandler();
  };

  const editCard = () => {
    selectAppointment();
    modalCloseHandler();
    toast.info(`"${title}" is currently selected`, {
      autoClose: false,
      onClose: () => removeAppointment(),
    });
  };

  return (
    <ModalSmallHoriz
      isOpen={isOpen}
      modalCloseHandler={modalCloseHandler}
      title={t('whatDo')}
      subTitle={t('modalAppointmentDesc')}
    >
      <div className="node-modal-body align-c mt-4 d-flex">
        <div>
          <Button
            label={t('openCard')}
            size="md"
            onClick={openCard}
            backColor="main"
            icon="/assets/vectors/new/add-white.svg"
          />
        </div>
        <div className="align-c mx-3">
          <Button
            label={t('movePass')}
            size="md"
            onClick={editCard}
            backColor="sec"
            icon="/assets/vectors/r-arrow-btn.svg"
          />
        </div>
      </div>
    </ModalSmallHoriz>
  );
};

export default ModalAppointmentConfirmation;
