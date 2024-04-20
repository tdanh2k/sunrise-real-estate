import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddDraftBlogSchema,
  TypeAddDraftBlog,
} from "@sunrise-backend/src/schemas/AddDraftBlog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";
import { MantineReactTableRHF } from "@components/MantineRHF/MantineReactTableRHF";
import { privateRoute } from "@utils/trpc";
import { QuerySelectRHF } from "@components/MantineRHF/SelectRHF/query";
import { TypeGlobalBlogType } from "@sunrise-backend/src/schemas/GlobalBlogType.schema";
import { CustomModal } from "@components/MantineRHF/CustomModal";
import { useNavigate } from "@tanstack/react-router";

type ModalAddProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const defaultValues: TypeAddDraftBlog = {
  TypeId: "",
  Code: "",
  Title: "",
  Description: "",
  DraftBlogImage: [],
};

export const ModalAddBlog: FC<ModalAddProps> = ({
  isOpen,
  handleClose,
}) => {
  const navigate = useNavigate({ from: "/user/blogs/blog" });
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const utils = privateRoute.useUtils();

  const { handleSubmit, control, reset } = useForm({
    resolver: isDrafting ? zodResolver(AddDraftBlogSchema) : undefined,
    mode: "all",
    defaultValues,
  });

  const { mutateAsync, isPending: isBlogPending } =
    privateRoute.user.pending_blog.createFromDraft.useMutation({
      onSuccess: () => {
        utils.user.blog.invalidate();
      },
    });

  const { mutateAsync: mutateDraftAsync, isPending: isDraftPending } =
    privateRoute.user.draft_blog.create.useMutation({
      onSuccess: () => {
        utils.user.draft_blog.invalidate();
        navigate({ to: "/user/blogs/pending_blog" });
      },
    });

  const onSubmit: SubmitHandler<TypeAddDraftBlog> = async (values) => {
    if (!window.confirm("Bạn đã chắc chắn?")) return;

    await mutateAsync(values);
    handleClose();
    reset();
  };

  const onDraftSubmit: SubmitHandler<TypeAddDraftBlog> = async ({
    DraftBlogImage,
    ...rest
  }) => {
    if (!window.confirm("Bạn đã chắc chắn?")) return;

    await mutateDraftAsync({
      ...rest,
      DraftBlogImage: DraftBlogImage ?? [],
    });
    handleClose();
    reset();
  };

  const isLoading = isDraftPending || isBlogPending;

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
      title="Cập nhật bài nháp"
      centered
      footer={
        <>
          <Button variant="transparent" onClick={() => reset()}>
            Clear
          </Button>
          <Button
            color="green"
            onClick={() => {
              setIsDrafting(true);
              handleSubmit(onDraftSubmit, (error) => console.error(error))();
            }}
          >
            Lưu nháp
          </Button>
          <Button
            color="blue"
            onClick={() => {
              setIsDrafting(false);
              handleSubmit(onSubmit, (error) => console.error(error))();
            }}
          >
            Submit
          </Button>
        </>
      }
    >
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Stack mb={10} style={{ overflow: "auto" }}>
        <QuerySelectRHF<TypeAddDraftBlog, TypeGlobalBlogType>
          name="TypeId"
          label="Loại bài đăng"
          useQuery={privateRoute.user.global_blog_type.all.useQuery}
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
              header: "Tên",
            },
            {
              accessorKey: "Size",
              header: "Kích thước",
            },
          ]}
          externalLoading={isLoading}
          name="DraftBlogImage"
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
//   control: Control<TypeAddDraftBlog>;
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
