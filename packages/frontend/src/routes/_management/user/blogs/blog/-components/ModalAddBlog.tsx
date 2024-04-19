import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddBlogSchema,
  TypeAddBlog,
} from "@sunrise-backend/src/schemas/AddBlog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";
import { privateRoute } from "@utils/trpc";
import { QuerySelectRHF } from "@components/MantineRHF/SelectRHF/query";
import { TypeGlobalBlogType } from "@sunrise-backend/src/schemas/GlobalBlogType.schema";
import { CustomModal } from "@components/MantineRHF/CustomModal";
import { useNavigate } from "@tanstack/react-router";
import { TypeAddDraftBlog } from "@sunrise-backend/src/schemas/AddDraftBlog.schema";

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
  const navigate = useNavigate({ from: "/user/posts/post" });
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const utils = privateRoute.useUtils();

  const { data: postDetailResponse, isFetching } =
    privateRoute.user.global_post_detail.all.useQuery();

  const { handleSubmit, control, reset } = useForm({
    resolver: isDrafting ? zodResolver(AddBlogSchema) : undefined,
    mode: "all",
    defaultValues,
  });

  const { mutateAsync, isPending } = privateRoute.user.post.publish.useMutation(
    {
      onSuccess: () => {
        utils.user.post.invalidate();
      },
    }
  );

  const { mutateAsync: mutateDraftAsync, isPending: isDraftPending } =
    privateRoute.user.draft_post.create.useMutation({
      onSuccess: () => {
        utils.user.draft_post.invalidate();
        navigate({ to: "/user/posts/draft_post" });
      },
    });

  const onSubmit: SubmitHandler<TypeAddBlog> = async (values) => {
    if (!window.confirm("Bạn đã chắc chắn?")) return;

    await mutateAsync(values);
    handleClose();
    reset();
  };

  const onDraftSubmit: SubmitHandler<TypeAddDraftBlog> = async ({
    BlogImage,
    ...rest
  }) => {
    if (!window.confirm("Bạn đã chắc chắn?")) return;

    await mutateDraftAsync({
      ...rest,
      DraftBlogImage: BlogImage ?? [],
    });
    handleClose();
    reset();
  };

  const isLoading = isPending || isDraftPending;

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
      title="Tạo bài đăng"
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
        <QuerySelectRHF<TypeAddBlog, TypeGlobalBlogType>
          name="TypeId"
          label="Loại blog"
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
        {/* <MantineReactTableRHF
          legendLabel="Hình ảnh"
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
                //error: control?._formState?.errors?.BlogCurrentDetail?.[0]?.Value,
                error:
                  control?._formState?.errors?.BlogImage?.[row.index]?.Value
                    ?.message,
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
        /> */}
      </Stack>
    </CustomModal>
  );
};

// const BlogCurrentDetailTable: FC<{
//   control: Control<TypeAddBlog>;
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
