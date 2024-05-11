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
import { privateRoute } from "@utils/trpc";
import { QuerySelectRHF } from "@components/MantineRHF/SelectRHF/query";
import { TypeGlobalBlogType } from "@sunrise-backend/src/schemas/GlobalBlogType.schema";
import { CustomModal } from "@components/MantineRHF/CustomModal";
import { FileTableRHF } from "@components/MantineRHF/FileTableRHF";

type ModalAddProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const defaultValues: TypeAddBlog = {
  TypeId: "",
  Title: "",
  Description: "",
  BlogImage: [],
};

export const ModalAddBlog: FC<ModalAddProps> = ({ isOpen, handleClose }) => {
  const utils = privateRoute.useUtils();

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
      title="Thêm blog"
      centered
      footer={
        <>
          <Button variant="transparent" onClick={() => reset()}>
            Reset
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
          label="Loại blog"
          useQuery={privateRoute.management.global_blog_type.all.useQuery}
          mapOption={(item) => ({
            label: item.Name,
            value: item.Id,
          })}
          control={control}
        />
        <TextInputRHF name="Title" label="Tiêu đề" control={control} />
        <RichTextRHF name="Description" label="Mô tả" control={control} />
        {/* <MantineReactTableRHF
          legendLabel="Hình ảnh"
          disableEdit
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
        /> */}
        <FileTableRHF
          legendLabel="Hình ảnh"
          name="BlogImage"
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
