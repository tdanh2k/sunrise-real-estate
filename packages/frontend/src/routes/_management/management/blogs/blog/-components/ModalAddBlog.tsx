import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddBlogSchema,
  TypeAddBlog,
} from "@sunrise-backend/src/schemas/AddBlog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";
import { MantineReactTableRHF } from "@components/MantineRHF/MantineReactTableRHF";
import { privateRoute } from "@utils/trpc";
import { QuerySelectRHF } from "@components/MantineRHF/SelectRHF/query";
import { TypeGlobalBlogType } from "@sunrise-backend/src/schemas/GlobalBlogType.schema";
import { CustomModal } from "@components/MantineRHF/CustomModal";

type ModalAddProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const defaultValues: TypeAddBlog = {
  TypeId: "",
  Code: "",
  Title: "",
  Description: "",
  BlogImage: [],
};

export const ModalAddBlog: FC<ModalAddProps> = ({ isOpen, handleClose }) => {
  const utils = privateRoute.useUtils();

  const { data: blogDetailResponse, isFetching } =
    privateRoute.management.global_blog_detail.all.useQuery();

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(AddBlogSchema),
    mode: "all",
    defaultValues,
  });

  const { mutateAsync, isPending } =
    privateRoute.management.blog.publish.useMutation({
      onSuccess: () => {
        utils.management.blog.invalidate();
      },
    });

  const onSubmit: SubmitHandler<TypeAddBlog> = async (values) => {
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
        <QuerySelectRHF<TypeAddBlog, TypeGlobalBlogType>
          name="TypeId"
          label="Loại bài đăng"
          useQuery={privateRoute.management.global_blog_type.all.useQuery}
          mapOption={(item) => ({
            label: item.Name,
            value: item.Id,
          })}
          control={control}
        />
        <TextInputRHF name="Code" label="Mã quản lý" control={control} />
        <TextInputRHF name="Title" label="Tiêu đề" control={control} />
        <RichTextRHF name="Description" label="Mô tả" control={control} />
        <MantineReactTableRHF
          legendLabel="Hình ảnh"
          columns={[
            {
              accessorKey: "Name",
              header: "Tên file",
              mantineEditTextInputProps: ({ row }) => ({
                //value: fields?.find((item) => item.Id === row.original.Id)?.Value,
                //error: control?._formState?.errors?.BlogCurrentDetail?.[0]?.Value,
                error:
                  control?._formState?.errors?.BlogImage?.[row.index]?.Name
                    ?.message,
              }),
            },
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
                data: blogDetailResponse?.data?.map((item) => ({
                  label: item.Name,
                  value: item.Id,
                })),
                //error:
                //  control?._formState?.errors?.BlogCurrentDetail?.[row.index]?.DetailId,
              }),
            },
          ]}
          externalLoading={isFetching}
          name="BlogImage"
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

// const BlogCurrentDetailTable: FC<{
//   control: Control<TypeAddBlog>;
// }> = ({ control }) => {
//   const { data: blogDetailResponse, isFetching } =
//     privateRoute.global_blog_detail.all.useQuery();

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
//               data: blogDetailResponse?.data?.map((item) => ({
//                 label: item.Name,
//                 value: item.Id,
//               })),
//               //error:
//               //  control?._formState?.errors?.BlogCurrentDetail?.[row.index]?.DetailId,
//             }),
//           },
//           {
//             accessorKey: "Value",
//             header: "Value",
//             mantineEditTextInputProps: ({ row }) => ({
//               //value: fields?.find((item) => item.Id === row.original.Id)?.Value,
//               //error: control?._formState?.errors?.BlogCurrentDetail?.[0]?.Value,
//               error:
//                 control?._formState?.errors?.BlogCurrentDetail?.[row.index]
//                   ?.Value?.message,
//             }),
//           },
//         ]}
//         externalLoading={isFetching}
//         name="BlogCurrentDetail"
//         control={control}
//         //methods={methods}
//         // onCreate={({ values }) => {
//         //   append(values);
//         // }}
//       />
//     </>
//   );
// };
