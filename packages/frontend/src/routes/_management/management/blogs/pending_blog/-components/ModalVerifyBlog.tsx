import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";
import { privateRoute } from "@utils/trpc";
import { QuerySelectRHF } from "@components/MantineRHF/SelectRHF/query";
import { TypeGlobalBlogType } from "@sunrise-backend/src/schemas/GlobalBlogType.schema";
import { CustomModal } from "@components/MantineRHF/CustomModal";
import { FileTableRHF } from "@components/MantineRHF/FileTableRHF";
import { TypePendingBlog } from "@sunrise-backend/src/schemas/PendingBlog.schema";
import { useNavigate } from "@tanstack/react-router";

type ModalVerifyProps = {
  isOpen: boolean;
  blogId: string;
  handleClose: () => void;
};

const defaultValues: TypePendingBlog = {
  Id: "",
  TypeId: "",
  Title: "",
  Description: "",
  PendingBlogImage: [],
};

export const ModalVerifyBlog: FC<ModalVerifyProps> = ({
  isOpen,
  blogId,
  handleClose,
}) => {
  const navigate = useNavigate({ from: "/management/blogs/pending_blog" });
  const utils = privateRoute.useUtils();

  const { data: blogByIdResponse, isFetching } =
    privateRoute.management.pending_blog.byId.useQuery(
      { Id: blogId },
      {
        enabled: Boolean(blogId),
      }
    );

  const { handleSubmit, control, reset } = useForm({
    mode: "all",
    values: {
      ...defaultValues,
      ...(blogByIdResponse?.data ?? {}),
    },
  });

  const { mutateAsync: approveAsync, isPending: isApprovePending } =
    privateRoute.management.pending_blog.approve.useMutation({
      onSuccess: () => {
        utils.management.blog.invalidate();
        navigate({ to: "/management/blogs/blog" });
      },
    });
  const { mutateAsync: rejectAsync, isPending: isRejectPending } =
    privateRoute.management.pending_blog.reject.useMutation({
      onSuccess: () => {
        utils.management.blog.invalidate();
      },
    });

  const onApprove: SubmitHandler<TypePendingBlog> = async ({ Id }) => {
    await approveAsync({ Id });
    handleClose();
    reset();
  };

  const onReject: SubmitHandler<TypePendingBlog> = async ({ Id }) => {
    await rejectAsync({ Id });
    handleClose();
    reset();
  };

  const isLoading = isApprovePending || isRejectPending || isFetching;

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
      title="Xác nhận blog"
      centered
      footer={
        <>
          <Button
            color="red"
            onClick={handleSubmit(onReject, (error) => console.error(error))}
          >
            Từ chối
          </Button>
          <Button
            color="blue"
            onClick={handleSubmit(onApprove, (error) => console.error(error))}
          >
            Đồng ý
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
        <QuerySelectRHF<TypePendingBlog, TypeGlobalBlogType>
          name="TypeId"
          label="Loại blog"
          useQuery={privateRoute.management.global_blog_type.all.useQuery}
          mapOption={(item) => ({
            label: item.Name,
            value: item.Id,
          })}
          readOnly
          disabled={isLoading}
          control={control}
        />
        <TextInputRHF
          name="Title"
          label="Tiêu đề"
          readOnly
          control={control}
          disabled={isLoading}
        />
        <RichTextRHF
          name="Description"
          label="Mô tả"
          control={control}
          editable={false}
        />
        <FileTableRHF
          legendLabel="Hình ảnh"
          name="PendingBlogImage"
          disableEditing
          control={control}
          saveMapping={({ file, base64File }) => ({
            Name: file.name,
            Size: file.size,
            MimeType: file.type,
            Base64Data: base64File,
          })}
          columns={[
            {
              accessorKey: "Name",
              header: "Tên file",
              enableEditing: false,
            },
            {
              accessorKey: "MimeType",
              header: "MIME",
              enableEditing: false,
            },
            {
              accessorKey: "Size",
              header: "Kích thước",
              enableEditing: false,
            },
          ]}
        />
      </Stack>
    </CustomModal>
  );
};
