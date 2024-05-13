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
import { privateRoute } from "@utils/trpc";
import { QuerySelectRHF } from "@components/MantineRHF/SelectRHF/query";
import { TypeGlobalBlogType } from "@sunrise-backend/src/schemas/GlobalBlogType.schema";
import { CustomModal } from "@components/MantineRHF/CustomModal";
import { useNavigate } from "@tanstack/react-router";
import { FileTableRHF } from "@components/MantineRHF/FileTableRHF";

type ModalAddProps = {
  isOpen: boolean;
  blogId: string;
  handleClose: () => void;
};

const defaultValues: TypeAddDraftBlog = {
  TypeId: "",
  Title: "",
  Description: "",
  DraftBlogImage: [],
};

export const ModalUpdateDraftBlog: FC<ModalAddProps> = ({
  isOpen,
  blogId,
  handleClose,
}) => {
  const navigate = useNavigate({ from: "/user/blogs/draft_blog" });
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const utils = privateRoute.useUtils();

  const {
    data: draftBlogByIdResponse,
    isFetching: isGetDraftBlogByIdFetching,
  } = privateRoute.user.draft_blog.byId.useQuery(
    { Id: blogId },
    { enabled: Boolean(blogId) }
  );

  const { handleSubmit, control, reset } = useForm({
    resolver: isDrafting ? zodResolver(AddDraftBlogSchema) : undefined,
    mode: "all",
    values: {
      ...defaultValues,
      ...draftBlogByIdResponse?.data,
    },
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
        handleClose();
      },
    });

  const onSubmit: SubmitHandler<TypeAddDraftBlog> = async (values) => {
    if (!window.confirm("Bạn đã chắc chắn?")) return;

    await mutateAsync(values);
    setIsDrafting(false);
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
    setIsDrafting(false);
    handleClose();
    reset();
  };

  const isLoading =
    isDraftPending || isBlogPending || isGetDraftBlogByIdFetching;

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
      title="Tạo bài nháp"
      centered
      footer={
        <>
          <Button
            variant="transparent"
            loading={isLoading}
            onClick={() => reset()}
          >
            Reset
          </Button>
          <Button
            color="green"
            loading={isLoading}
            onClick={() => {
              setIsDrafting(true);
              handleSubmit(onDraftSubmit, (error) => console.error(error))();
            }}
          >
            Lưu nháp
          </Button>
          <Button
            color="blue"
            loading={isLoading}
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
        <TextInputRHF name="Title" label="Tiêu đề" control={control} />
        <RichTextRHF name="Description" label="Mô tả" control={control} />
        {/* <MantineReactTableRHF
          legendLabel="Hình ảnh"
          externalLoading={isLoading}
          disableEdit
          name="DraftBlogImage"
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
          name="DraftBlogImage"
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
