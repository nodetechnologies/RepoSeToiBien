import React from 'react';

import { useTranslation } from 'react-i18next';
import Button from '../stories/general-components/Button';
import ModalSmallHoriz from './Base/ModalSmallHoriz';
import { DialogContent } from '@material-ui/core';

const ModalConfirmation = (props) => {
  const { t } = useTranslation();
  const { title, subtitle, handleConfirm, handleConfirmSub } = props;

  const onConfirm = () => {
    props.modalCloseHandler();
    handleConfirm();
  };

  const onConfirmSub = () => {
    props.modalCloseHandler();
    handleConfirmSub();
  };

  return (
    <div>
      <ModalSmallHoriz title={title} subTitle={subtitle} {...props}>
        <div className="client-modal-body mt-4  align-c align-items-center">
          <DialogContent>
            <div className="d-flex align-c mb-4">
              <div className="ml-2">
                <p className="fs-18 fw-500">{t('areYouSure')}</p>
                <p className="fs-14">{t('thisActionCannotBeUndone')}</p>
              </div>
            </div>
          </DialogContent>
          {handleConfirmSub && (
            <div className="align-c mx-2 mb-2">
              <Button
                label={t('dactivateOnly')}
                size="md"
                onClick={onConfirmSub}
                backColor="sec"
                variant={'outlined'}
                icon="/assets/vectors/r-arrow-btn.svg"
              />
            </div>
          )}
          <div className="align-c mx-2">
            <Button
              label={t('yesContinue')}
              size="md"
              onClick={onConfirm}
              icon="/assets/vectors/r-arrow-btn.svg"
            />
          </div>
          <div className="align-c mx-2 mt-2">
            <Button
              label={t('noStop')}
              size="md"
              variant="text"
              onClick={() => {
                props.modalCloseHandler();
              }}
              backColor="alert"
              icon="/assets/vectors/r-arrow-btn.svg"
            />
          </div>
        </div>
      </ModalSmallHoriz>
    </div>
  );
};

export default ModalConfirmation;
