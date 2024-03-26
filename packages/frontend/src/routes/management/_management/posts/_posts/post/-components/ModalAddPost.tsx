import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { FC } from "react";
import {
  ArrayPath,
  Control,
  FieldValues,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  AddPostSchema,
  TypeAddPost,
} from "sunrise-real-estate-backend/src/schemas/AddPost.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";
import { MantineReactTableRHF } from "@components/MantineRHF/MantineReactTableRHF";
import { trpc } from "@utils/trpc";

type ModalAddProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const defaultValues: TypeAddPost = {
  TypeId: "",
  Code: "",
  Title: "",
  Address: "",
  Description: "",
  MapUrl: "",
  PostImage: [],
  PostCurrentDetail: [],
  PostFeature: [],
};

export const ModalAddPost: FC<ModalAddProps> = ({ isOpen, handleClose }) => {
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(AddPostSchema),
    mode: "all",
    defaultValues,
  });
  const onSubmit: SubmitHandler<TypeAddPost> = (values) => {};

  return (
    <Modal
      size="xl"
      fullScreen
      opened={isOpen}
      onClose={() => {
        handleClose();
        reset();
      }}
      closeOnClickOutside={false}
      closeOnEscape={false}
      title="Thêm bài đăng"
      centered
    >
      <LoadingOverlay
        visible={false}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Stack mb={10} style={{ overflow: "auto" }}>
        <TextInputRHF name="Code" label="Mã quản lý" control={control} />
        <TextInputRHF name="Title" label="Tiêu đề" control={control} />
        <TextInputRHF name="Address" label="Địa chỉ" control={control} />
        <RichTextRHF name="Description" label="Mô tả" control={control} />
        <PostCurrentDetailTable control={control} />
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

const PostCurrentDetailTable: FC<{
  control: Control<TypeAddPost>;
}> = ({ control }) => {
  const { data: postDetailResponse, isFetching } =
    trpc.global_post_detail.all.useQuery();
  const methods = useFieldArray({
    name: "PostCurrentDetail",
    control,
  });

  const { fields, append, remove } = methods;

  return (
    <>
      <MantineReactTableRHF<TypeAddPost, "PostCurrentDetail">
        columns={[
          {
            accessorKey: "DetailId",
            header: "DetailId",
            editVariant: "select",
            mantineEditTextInputProps: ({ row }) => ({
              // value: fields?.find((item) => item.Id === row.original.Id)
              //   ?.DetailId,
            }),
            mantineEditSelectProps: ({ row }) => ({
              // value: fields?.find((item) => item.Id === row.original.Id)
              //   ?.DetailId,
              data: postDetailResponse?.map((item) => ({
                label: item.Name,
                value: item.Id,
              })),
            }),
          },
          {
            accessorKey: "Value",
            header: "Value",
            mantineEditTextInputProps: ({ row }) => ({
              //value: fields?.find((item) => item.Id === row.original.Id)?.Value,
            }),
          },
        ]}
        data={fields}
        onCreate={({ values }) => {
          append(values);
        }}
      />
    </>
  );
};
