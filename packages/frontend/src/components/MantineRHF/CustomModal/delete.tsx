import { FC } from "react";
import { Button, LoadingOverlay } from "@mantine/core";
import {
  TRPCUseQueryBaseOptions,
  UseTRPCMutationResult,
} from "@trpc/react-query/shared";
import { TypeAPIResponse } from "@sunrise-backend/src/schemas/APIResponse.schema";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@sunrise-backend/src/routers";
import { CustomModal, CustomModalProps } from ".";
import { UseMutationOptions } from "@tanstack/react-query";

export type ModalConfirmDeleteProps = Omit<CustomModalProps, "footer" | ""> & {
  data: { Id: string } & Record<string, unknown>;
  afterDelete?: (response?: TypeAPIResponse<Record<string, unknown>>) => void;
  useMutation: (
    opts?: UseMutationOptions<
      TypeAPIResponse<any>,
      unknown,
      { Id: string } & Record<string, unknown>,
      unknown
    > &
      TRPCUseQueryBaseOptions
  ) => UseTRPCMutationResult<
    TypeAPIResponse<Record<string, unknown>>,
    TRPCClientErrorLike<AppRouter>,
    { Id: string } & Record<string, unknown>,
    unknown
  >;
};

export const ModalConfirmDelete: FC<ModalConfirmDeleteProps> = ({
  data,
  afterDelete,
  useMutation,
  modalOverlayProps,
  modalContentProps,
  modalHeaderProps,
  modalTitleProps,
  modalCloseButtonProps,
  modalBodyProps,
  modalFooterProps,
  children,
  onClose,
  ...modalRootProps
}) => {
  if (useMutation == null) throw new Error("'useMutation' is required");

  const { mutateAsync, isPending } = useMutation({
    onSuccess: (props) => {
      afterDelete?.(props);
    },
  });

  return (
    <CustomModal
      size="xl"
      fullScreen
      centered
      {...modalRootProps}
      onClose={() => {
        if (isPending) return;

        onClose?.();
      }}
      footer={
        <>
          <Button
            color="blue"
            disabled={isPending}
            onClick={async () => {
              await mutateAsync(data);
              onClose?.();
            }}
          >
            Submit
          </Button>
        </>
      }
    >
      <LoadingOverlay
        visible={isPending}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      Bạn muốn xóa dữ liệu này?
    </CustomModal>
  );
};
