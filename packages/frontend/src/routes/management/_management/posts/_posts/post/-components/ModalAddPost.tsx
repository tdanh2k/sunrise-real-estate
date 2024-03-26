import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { FC } from "react";
import {
  Control,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  AddPostSchema,
  TypeAddPost,
} from "@sunrise-backend/src/schemas/AddPost.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";
import { MantineReactTableRHF } from "@components/MantineRHF/MantineReactTableRHF";
import { trpc } from "@utils/trpc";
import { QuerySelectRHF } from "@components/MantineRHF/SelectRHF/query";
import { TypeGlobalPostType } from "@sunrise-backend/src/schemas/GlobalPostType.schema";
import { CustomModal } from "@components/MantineRHF/CustomModal";

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
  const utils = trpc.useUtils();
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(AddPostSchema),
    mode: "all",
    defaultValues,
  });

  const { mutateAsync, isPending } = trpc.post.publish.useMutation({
    onSuccess: () => {
      utils.post.invalidate();
    },
  });

  const onSubmit: SubmitHandler<TypeAddPost> = async (values) => {
    await mutateAsync(values);
    handleClose();
    reset();
  };

  return (
    <CustomModal
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
      footer={
        <>
          <Button variant="transparent" onClick={() => reset()}>
            Clear
          </Button>
          <Button color="blue" onClick={handleSubmit(onSubmit)}>
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

      <Stack mb={10} style={{ overflow: "auto" }}>
        <QuerySelectRHF<TypeAddPost, TypeGlobalPostType>
          name="TypeId"
          label="Loại bài đăng"
          useQuery={trpc.global_post_type.all.useQuery}
          mapOption={(item) => ({
            label: item.Name,
            value: item.Id,
          })}
          control={control}
        />
        <TextInputRHF name="Code" label="Mã quản lý" control={control} />
        <TextInputRHF name="Title" label="Tiêu đề" control={control} />
        <TextInputRHF name="Address" label="Địa chỉ" control={control} />
        <RichTextRHF name="Description" label="Mô tả" control={control} />
        <PostCurrentDetailTable control={control} />
      </Stack>
    </CustomModal>
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
      <MantineReactTableRHF
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
              data: postDetailResponse?.data?.map((item) => ({
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
        methods={methods}
        // onCreate={({ values }) => {
        //   append(values);
        // }}
      />
    </>
  );
};
