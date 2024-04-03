import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddPostSchema,
  TypeAddPost,
} from "@sunrise-backend/src/schemas/AddPost.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";
import { MantineReactTableRHF } from "@components/MantineRHF/MantineReactTableRHF";
import { privateRoute } from "@utils/trpc";
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
  const utils = privateRoute.useUtils();

  const { data: postDetailResponse, isFetching } =
    privateRoute.user.global_post_detail.all.useQuery();

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(AddPostSchema),
    mode: "all",
    defaultValues,
  });

  const { mutateAsync, isPending } = privateRoute.user.post.publish.useMutation({
    onSuccess: () => {
      utils.user.post.invalidate();
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
          <Button
            color="blue"
            onClick={handleSubmit(onSubmit, (error) => console.error(error))}
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

      <Stack mb={10} style={{ overflow: "auto" }}>
        <QuerySelectRHF<TypeAddPost, TypeGlobalPostType>
          name="TypeId"
          label="Loại bài đăng"
          useQuery={privateRoute.user.global_post_type.all.useQuery}
          mapOption={(item) => ({
            label: item.Name,
            value: item.Id,
          })}
          control={control}
        />
        <TextInputRHF name="Code" label="Mã quản lý" control={control} />
        <TextInputRHF name="Title" label="Tiêu đề" control={control} />
        <TextInputRHF name="Address" label="Địa chỉ" control={control} />
        <TextInputRHF name="MapUrl" label="Url bản đồ" control={control} />
        <RichTextRHF name="Description" label="Mô tả" control={control} />
        <MantineReactTableRHF
          legendLabel="Chi tiết bất động sản"
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
                //error:
                //  control?._formState?.errors?.PostCurrentDetail?.[row.index]?.DetailId,
              }),
            },
            {
              accessorKey: "Value",
              header: "Value",
              mantineEditTextInputProps: ({ row }) => ({
                //value: fields?.find((item) => item.Id === row.original.Id)?.Value,
                //error: control?._formState?.errors?.PostCurrentDetail?.[0]?.Value,
                error:
                  control?._formState?.errors?.PostCurrentDetail?.[row.index]
                    ?.Value?.message,
              }),
            },
          ]}
          externalLoading={isFetching}
          name="PostCurrentDetail"
          control={control}
          //methods={methods}
          // onCreate={({ values }) => {
          //   append(values);
          // }}
        />
        <MantineReactTableRHF
          legendLabel="Điểm đặc biệt của bất động sản"
          columns={[
            {
              accessorKey: "Title",
              header: "Tiêu đề",
            },
            {
              accessorKey: "Description",
              header: "Mô tả",
              mantineEditTextInputProps: ({ row }) => ({
                //value: fields?.find((item) => item.Id === row.original.Id)?.Value,
                //error: control?._formState?.errors?.PostCurrentDetail?.[0]?.Value,
                error:
                  control?._formState?.errors?.PostCurrentDetail?.[row.index]
                    ?.Value?.message,
              }),
            },
          ]}
          externalLoading={isFetching}
          name="PostFeature"
          control={control}
          //methods={methods}
          // onCreate={({ values }) => {
          //   append(values);
          // }}
        />
      </Stack>
    </CustomModal>
  );
};

// const PostCurrentDetailTable: FC<{
//   control: Control<TypeAddPost>;
// }> = ({ control }) => {
//   const { data: postDetailResponse, isFetching } =
//     privateRoute.global_post_detail.all.useQuery();

//   return (
//     <>
//       <MantineReactTableRHF
//         legendLabel="Chi tiết bài đăng"
//         columns={[
//           {
//             accessorKey: "DetailId",
//             header: "DetailId",
//             editVariant: "select",
//             mantineEditTextInputProps: ({ row }) => ({
//               // value: fields?.find((item) => item.Id === row.original.Id)
//               //   ?.DetailId,
//             }),
//             mantineEditSelectProps: ({ row }) => ({
//               // value: fields?.find((item) => item.Id === row.original.Id)
//               //   ?.DetailId,
//               data: postDetailResponse?.data?.map((item) => ({
//                 label: item.Name,
//                 value: item.Id,
//               })),
//               //error:
//               //  control?._formState?.errors?.PostCurrentDetail?.[row.index]?.DetailId,
//             }),
//           },
//           {
//             accessorKey: "Value",
//             header: "Value",
//             mantineEditTextInputProps: ({ row }) => ({
//               //value: fields?.find((item) => item.Id === row.original.Id)?.Value,
//               //error: control?._formState?.errors?.PostCurrentDetail?.[0]?.Value,
//               error:
//                 control?._formState?.errors?.PostCurrentDetail?.[row.index]
//                   ?.Value?.message,
//             }),
//           },
//         ]}
//         externalLoading={isFetching}
//         name="PostCurrentDetail"
//         control={control}
//         //methods={methods}
//         // onCreate={({ values }) => {
//         //   append(values);
//         // }}
//       />
//     </>
//   );
// };
