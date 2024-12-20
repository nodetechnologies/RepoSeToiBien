import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as modalActions from '../redux/actions/modal-actions';
import ModalAddItem from './ModalAddItem';
import ModalElementCreation from './ModalElementCreation';
import ModalScan from './ModalScan';
import ModalConfirmation from './ModalConfirmation';
import ModalEmailCard from './ModalEmailCard';
import ModalInvoice from './ModalInvoice';
import ModalSendEmail from './ModalSendEmail';
import ModalGemini from './ModalGemini';
import ModalContact from './ModalContact';
import ModalEditBlock from './ModalEditBlock';

const AllModalsRoot = () => {
  const dispatch = useDispatch();

  const globalModalState = useSelector((state) => state.modalReducer);

  return (
    <>
      {globalModalState.modalEmail.isOpen && (
        <ModalSendEmail
          {...globalModalState.modalEmail}
          modalCloseHandler={() =>
            dispatch(modalActions.modalEmail({ isOpen: false }))
          }
        />
      )}

      {globalModalState.modalEditBlock.isOpen && (
        <ModalEditBlock
          {...globalModalState.modalEditBlock}
          modalCloseHandler={() =>
            dispatch(modalActions.modalEditBlock({ isOpen: false }))
          }
        />
      )}

      {globalModalState.modalGemini.isOpen && (
        <ModalGemini
          {...globalModalState.modalGemini}
          modalCloseHandler={() =>
            dispatch(modalActions.modalGemini({ isOpen: false }))
          }
        />
      )}

      {globalModalState.modalEmailCard.isOpen && (
        <ModalEmailCard
          {...globalModalState.modalEmailCard}
          modalCloseHandler={() =>
            dispatch(modalActions.modalEmailCard({ isOpen: false }))
          }
        />
      )}

      {globalModalState.modalConfirmation.isOpen && (
        <ModalConfirmation
          {...globalModalState.modalConfirmation}
          modalCloseHandler={() =>
            dispatch(modalActions.modalConfirmation({ isOpen: false }))
          }
        />
      )}

      {globalModalState.modalAddItem.isOpen && (
        <ModalAddItem
          {...globalModalState.modalAddItem}
          modalCloseHandler={() =>
            dispatch(modalActions.modalAddItem({ isOpen: false }))
          }
        />
      )}

      {globalModalState.modalElementCreation.isOpen && (
        <ModalElementCreation
          {...globalModalState.modalElementCreation}
          modalCloseHandler={() =>
            dispatch(modalActions.modalElementCreation({ isOpen: false }))
          }
        />
      )}

      {globalModalState.modalScan.isOpen && (
        <ModalScan
          {...globalModalState.modalScan}
          modalCloseHandler={() =>
            dispatch(modalActions.modalScan({ isOpen: false }))
          }
        />
      )}

      {globalModalState.modalInvoice.isOpen && (
        <ModalInvoice
          {...globalModalState.modalInvoice}
          modalCloseHandler={() =>
            dispatch(modalActions.modalInvoice({ isOpen: false }))
          }
        />
      )}
      {globalModalState.modalContact.isOpen && (
        <ModalContact
          {...globalModalState.modalContact}
          modalCloseHandler={() =>
            dispatch(modalActions.modalContact({ isOpen: false }))
          }
        />
      )}
    </>
  );
};

export default AllModalsRoot;
