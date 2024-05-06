import {
  Flex,
  Group,
  GroupProps,
  Modal,
  ModalBodyProps,
  ModalCloseButtonProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalOverlayProps,
  ModalRootProps,
  ModalTitleProps,
} from "@mantine/core";
import { FC, ReactNode } from "react";

export type CustomModalProps = ModalRootProps & {
  modalOverlayProps?: Omit<ModalOverlayProps, "children">;
  modalContentProps?: Omit<ModalContentProps, "children">;
  modalHeaderProps?: Omit<ModalHeaderProps, "children">;
  modalTitleProps?: Omit<ModalTitleProps, "children">;
  title?: ReactNode;
  modalCloseButtonProps?: Omit<ModalCloseButtonProps, "children">;
  modalBodyProps?: Omit<ModalBodyProps, "children">;
  modalFooterProps?: Omit<GroupProps, "children">;
  footer?: ReactNode;
};

export const CustomModal: FC<CustomModalProps> = ({
  modalOverlayProps,
  modalContentProps,
  modalHeaderProps,
  modalTitleProps,
  modalCloseButtonProps,
  modalBodyProps,
  modalFooterProps,
  children,
  title,
  footer,
  ...modalRootProps
}) => {
  return (
    <Modal.Root {...modalRootProps}>
      <Modal.Overlay {...modalOverlayProps} />
      <Modal.Content {...modalContentProps}>
        <Flex direction="column" h="100%">
          <Modal.Header {...modalHeaderProps}>
            <Modal.Title {...modalTitleProps}>{title}</Modal.Title>
            <Modal.CloseButton {...modalCloseButtonProps} />
          </Modal.Header>
          <Modal.Body
            style={{ overflowY: "auto", flex: 1 }}
            {...modalBodyProps}
          >
            {children}
          </Modal.Body>
          <Group
            justify="right"
            align="center"
            m="md"
            p={1}
            {...modalFooterProps}
          >
            {footer}
          </Group>
        </Flex>
      </Modal.Content>
    </Modal.Root>
  );
};
