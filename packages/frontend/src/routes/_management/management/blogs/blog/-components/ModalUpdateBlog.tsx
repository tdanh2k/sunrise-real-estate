import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BlogSchema, TypeBlog } from "@sunrise-backend/src/schemas/Blog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";
import { MantineReactTableRHF } from "@components/MantineRHF/MantineReactTableRHF";
import { privateRoute } from "@utils/trpc";
import { QuerySelectRHF } from "@components/MantineRHF/SelectRHF/query";
import { TypeGlobalBlogType } from "@sunrise-backend/src/schemas/GlobalBlogType.schema";
import { CustomModal } from "@components/MantineRHF/CustomModal";
import { MRT_EditCellFileInput } from "@components/MantineRT/MRT_EditCellFileInput";

type ModalUpdateProps = {
  isOpen: boolean;
  blogId: string;
  handleClose: () => void;
};

const defaultValues: TypeBlog = {
  Id: "",
  TypeId: "",
  Code: "",
  Title: "",
  Description: "",
  BlogImage: [],
};

export const ModalUpdateBlog: FC<ModalUpdateProps> = ({
  isOpen,
  blogId,
  handleClose,
}) => {
  const utils = privateRoute.useUtils();

  const { data: blogByIdResponse, isFetching } =
    privateRoute.management.blog.byId.useQuery(
      { Id: blogId },
      {
        enabled: Boolean(blogId),
      }
    );

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(BlogSchema),
    mode: "all",
    values: {
      ...defaultValues,
      ...(blogByIdResponse?.data ?? {}),
    },
  });

  const { mutateAsync, isPending } =
    privateRoute.management.blog.publish.useMutation({
      onSuccess: () => {
        utils.management.blog.invalidate();
      },
    });

  const onSubmit: SubmitHandler<TypeBlog> = async (values) => {
    await mutateAsync(values);
    handleClose();
    reset();
  };

  const isLoading = isPending || isFetching;

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
        <QuerySelectRHF<TypeBlog, TypeGlobalBlogType>
          name="TypeId"
          label="Loại blog"
          useQuery={privateRoute.management.global_blog_type.all.useQuery}
          mapOption={(item) => ({
            label: item.Name,
            value: item.Id,
          })}
          disabled={isLoading}
          control={control}
        />
        <TextInputRHF
          name="Code"
          label="Mã quản lý"
          control={control}
          disabled={isLoading}
        />
        <TextInputRHF
          name="Title"
          label="Tiêu đề"
          control={control}
          disabled={isLoading}
        />
        <RichTextRHF
          name="Description"
          label="Mô tả"
          control={control}
          editable={!isLoading}
        />
        <MantineReactTableRHF
          legendLabel="Hình ảnh"
          disableEdit={isLoading}
          name="BlogImage"
          control={control}
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
            {
              accessorKey: "Base64Data",
              header: "Upload",
              Cell: ({ cell, table, renderedCellValue }) =>
                table.getState()?.editingCell?.id === cell.id
                  ? renderedCellValue
                  : cell.getValue<string>()
                    ? "Có dữ liệu"
                    : null,
              Edit: ({ cell, row, table }) => (
                <MRT_EditCellFileInput
                  cell={cell}
                  table={table}
                  onChange={(file) => {
                    if (!file) return;
                    row._valuesCache["Name"] = file?.name;
                    row._valuesCache["MimeType"] = file?.type;
                    row._valuesCache["Size"] = file?.size;
                  }}
                />
              ),
            },
          ]}
        />
      </Stack>
    </CustomModal>
  );
};