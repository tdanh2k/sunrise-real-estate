import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddGlobalBlogTypeSchema,
  TypeAddGlobalBlogType,
} from "@sunrise-backend/src/schemas/AddGlobalBlogType.schema";
import { privateRoute } from "@utils/trpc";
import { NumberInputRHF } from "@components/MantineRHF/NumberInputRHF";

type ModalAddProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const defaultValues: TypeAddGlobalBlogType = {
  Idx: 0,
  Name: "",
};

export const ModalAddBlogType: FC<ModalAddProps> = ({
  isOpen,
  handleClose,
}) => {
  const utils = privateRoute.useUtils();
  const { data: idxResponse, isFetching } =
    privateRoute.management.global_blog_type.nextIdx.useQuery(undefined, {
      enabled: isOpen,
    });
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(AddGlobalBlogTypeSchema),
    mode: "all",
    values: {
      ...defaultValues,
      Idx: idxResponse?.data?.Idx ?? defaultValues.Idx,
    },
  });

  const { mutateAsync, isPending } =
    privateRoute.management.global_blog_type.create.useMutation({
      onSuccess: () => {
        utils.management.global_blog_type.byPage.invalidate();
      },
    });

  const onSubmit: SubmitHandler<TypeAddGlobalBlogType> = async (values) => {
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
          Reset
        </Button>
        <Button color="blue" onClick={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </Group>
    </Modal>
  );
};
