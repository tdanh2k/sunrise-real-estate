import { FC } from "react";
import { CustomModal } from ".";
import { Button } from "@mantine/core";
import { UseTRPCMutationResult } from "@trpc/react-query/shared";
import { TypeAPIResponse } from "@sunrise-backend/src/schemas/APIResponse.schema";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@sunrise-backend/src/routers";

export const CustomDeleteModal: FC<{
  isOpen: boolean;
  handleClose?: () => void;
  afterDelete?: (response?: TypeAPIResponse<Record<string, unknown>>) => void;
  data: { Id: string } & Record<string, unknown>;
  useMutation: () => UseTRPCMutationResult<
    TypeAPIResponse<Record<string, unknown>>,
    TRPCClientErrorLike<AppRouter>,
    { Id: string } & Record<string, unknown>,
    unknown
  >;
}> = ({ isOpen, handleClose, useMutation, data, afterDelete }) => {
  const { mutateAsync, isPending } = useMutation();
  return (
    <CustomModal
      size="sm"
      opened={isOpen}
      onClose={() => {
        handleClose?.();
      }}
      closeOnClickOutside={false}
      closeOnEscape={false}
      title="Xóa"
      centered
      footer={
        <>
          <Button
            variant="transparent"
            loading={isPending}
            onClick={() => handleClose?.()}
          >
            Hủy
          </Button>
          <Button
            color="green"
            loading={isPending}
            onClick={async () => {
              const response = await mutateAsync(data);
              handleClose?.();
              afterDelete?.(response);
            }}
          >
            Xóa
          </Button>
        </>
      }
    >
      Bạn muốn xóa dữ liệu này?
    </CustomModal>
  );
};
