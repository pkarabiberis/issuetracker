import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { useModalSize } from '../utils/useModalSize';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Modal
      returnFocusOnClose={false}
      autoFocus={false}
      isOpen={isOpen}
      onClose={onClose}
      size={useModalSize()}
    >
      <ModalOverlay />
      <ModalContent mx={[2, 2, 0, 0, 0, 0]}>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
