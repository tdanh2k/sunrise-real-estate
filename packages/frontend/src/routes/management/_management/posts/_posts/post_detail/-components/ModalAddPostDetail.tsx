import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddGlobalPostDetailSchema,
  TypeAddGlobalPostDetail,
} from "@sunrise-backend/src/schemas/AddGlobalPostDetail.schema";
import { trpc } from "@utils/trpc";
import { SwitchRHF } from "@components/MantineRHF/SwitchRHF";

type ModalAddProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const defaultValues: TypeAddGlobalPostDetail = {
  Code: "",
  Name: "",
  Unit: "",
  IsNumber: false,
};

export const ModalAddPostDetail: FC<ModalAddProps> = ({
  isOpen,
  handleClose,
}) => {
  const utils = trpc.useUtils();
  // const { data: idxResponse, isFetching } =
  //   trpc.global_post_detail.nextIdx.useQuery(undefined, {
  //     enabled: isOpen,
  //   });
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(AddGlobalPostDetailSchema),
    mode: "all",
    values: {
      ...defaultValues,
      //Idx: idxResponse?.Idx ?? defaultValues.Idx,
    },
  });

  const { mutateAsync, isPending } = trpc.global_post_detail.create.useMutation(
    {
      onSuccess: () => {
        utils.global_post_detail.byPage.invalidate();
      },
    }
  );

  const onSubmit: SubmitHandler<TypeAddGlobalPostDetail> = async (values) => {
    await mutateAsync(values);
    handleClose();
    reset();
  };

  return (
    <Modal
      size="md"
      opened={isOpen}
      onClose={() => {
        handleClose();
        reset();
      }}
      closeOnClickOutside={false}
      closeOnEscape={false}
      title="Thêm loại chi tiết bài đăng"
      centered
    >
      <LoadingOverlay
        visible={isPending}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Stack mb={10} style={{ overflow: "auto" }}>
        <TextInputRHF name="Code" label="Mã quản lý" control={control} />
        <TextInputRHF name="Name" label="Tên" control={control} />
        <TextInputRHF name="Unit" label="Đơn vị" control={control} />
        <SwitchRHF name="IsNumber" label="Dạng số" control={control} />
      </Stack>

      <Group justify="space-between" mt="xl">
        <Button variant="transparent" onClick={() => reset()}>
          Clear
        </Button>
        <Button color="blue" onClick={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </Group>
    </Modal>
  );
};
