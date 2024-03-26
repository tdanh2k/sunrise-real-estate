import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddGlobalPostTypeSchema,
  TypeAddGlobalPostType,
} from "@sunrise-backend/src/schemas/AddGlobalPostType.schema";
import { trpc } from "@utils/trpc";
import { NumberInputRHF } from "@components/MantineRHF/NumberInputRHF";

type ModalAddProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const defaultValues: TypeAddGlobalPostType = {
  Idx: 0,
  Name: "",
};

export const ModalAddPostType: FC<ModalAddProps> = ({
  isOpen,
  handleClose,
}) => {
  const utils = trpc.useUtils();
  const { data: idxResponse, isFetching } =
    trpc.global_post_type.nextIdx.useQuery(undefined, {
      enabled: isOpen,
    });
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(AddGlobalPostTypeSchema),
    mode: "all",
    values: {
      ...defaultValues,
      Idx: idxResponse?.Idx ?? defaultValues.Idx,
    },
  });

  const { mutateAsync, isPending } = trpc.global_post_type.create.useMutation({
    onSuccess: () => {
      utils.global_post_type.byPage.invalidate();
    },
  });

  const onSubmit: SubmitHandler<TypeAddGlobalPostType> = async (values) => {
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
      title="Thêm loại bài đăng"
      centered
    >
      <LoadingOverlay
        visible={isFetching || isPending}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Stack mb={10} style={{ overflow: "auto" }}>
        <NumberInputRHF name="Idx" label="Thứ tự" control={control} />
        <TextInputRHF name="Name" label="Tên" control={control} />
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
