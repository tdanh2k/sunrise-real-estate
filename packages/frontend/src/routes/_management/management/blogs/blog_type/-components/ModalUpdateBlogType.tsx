import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { privateRoute } from "@utils/trpc";
import { NumberInputRHF } from "@components/MantineRHF/NumberInputRHF";
import {
  GlobalBlogTypeSchema,
  TypeGlobalBlogType,
} from "@sunrise-backend/src/schemas/GlobalBlogType.schema";

type ModalUpdateProps = {
  isOpen: boolean;
  blogTypeId: string;
  handleClose: () => void;
};

const defaultValues: TypeGlobalBlogType = {
  Id: "",
  Idx: 0,
  Name: "",
};

export const ModalUpdateBlogType: FC<ModalUpdateProps> = ({
  isOpen,
  blogTypeId,
  handleClose,
}) => {
  const utils = privateRoute.useUtils();

  const {
    data: globalBlogTypeByIdResponse,
    isFetching: isGetGlobalBlogTypeByIdFetching,
  } = privateRoute.management.global_blog_type.byId.useQuery(
    {
      Id: blogTypeId,
    },
    {
      enabled: Boolean(blogTypeId),
    }
  );
  const { handleSubmit, control, reset } = useForm<TypeGlobalBlogType>({
    resolver: zodResolver(GlobalBlogTypeSchema),
    mode: "all",
    values: {
      ...defaultValues,
      ...globalBlogTypeByIdResponse?.data,
    },
  });

  const { mutateAsync, isPending } =
    privateRoute.management.global_blog_type.create.useMutation({
      onSuccess: () => {
        utils.management.global_blog_type.byPage.invalidate();
      },
    });

  const onSubmit: SubmitHandler<TypeGlobalBlogType> = async (values) => {
    await mutateAsync(values);
    handleClose();
    reset();
  };

  const isLoading = isPending || isGetGlobalBlogTypeByIdFetching;

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
        visible={isLoading}
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
