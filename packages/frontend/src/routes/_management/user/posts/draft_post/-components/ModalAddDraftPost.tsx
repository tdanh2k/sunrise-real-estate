import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { FC, useState } from "react";
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
import { NumberInputRHF } from "@components/MantineRHF/NumberInputRHF";
import { useNavigate } from "@tanstack/react-router";
import { FileTableRHF } from "@components/MantineRHF/FileTableRHF";

type ModalAddProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const defaultValues: TypeAddPost = {
  TypeId: "",
  Title: "",
  Address: "",
  Description: "",
  Price: 0,
  MapUrl: "",
  Area: 0,
  PostImage: [],
  PostCurrentDetail: [],
  PostFeature: [],
};

export const ModalAddDraftPost: FC<ModalAddProps> = ({
  isOpen,
  handleClose,
}) => {
  const navigate = useNavigate({ from: "/user/posts/draft_post" });
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const utils = privateRoute.useUtils();

  const { data: postDetailResponse, isFetching } =
    privateRoute.user.global_post_detail.all.useQuery();

  const { handleSubmit, control, reset } = useForm({
    resolver: isDrafting ? zodResolver(AddPostSchema) : undefined,
    mode: "all",
    defaultValues,
  });

  const { mutateAsync, isPending } =
    privateRoute.user.pending_post.createFromDraft.useMutation({
      onSuccess: () => {
        utils.user.post.invalidate();
        navigate({ to: "/user/posts/pending_posts" });
      },
    });

  const { mutateAsync: mutateDraftAsync, isPending: isDraftPending } =
    privateRoute.user.draft_post.create.useMutation({
      onSuccess: () => {
        utils.user.draft_post.invalidate();
      },
    });

  const onSubmit: SubmitHandler<TypeAddPost> = async ({
    PostCurrentDetail,
    PostFeature,
    PostImage,
    Price,
    ...rest
  }) => {
    if (!window.confirm("Bạn đã chắc chắn?")) return;

    await mutateAsync({
      ...rest,
      Price: Price ?? 0,
      DraftPostCurrentDetail: PostCurrentDetail ?? [],
      DraftPostFeature: PostFeature ?? [],
      DraftPostImage: PostImage ?? [],
    });
    setIsDrafting(false);
    handleClose();
    reset();
  };

  const onDraftSubmit: SubmitHandler<TypeAddPost> = async ({
    PostCurrentDetail,
    PostFeature,
    PostImage,
    Price,
    ...rest
  }) => {
    if (!window.confirm("Bạn đã chắc chắn?")) return;

    await mutateDraftAsync({
      ...rest,
      Price: Price ?? 0,
      DraftPostCurrentDetail: PostCurrentDetail ?? [],
      DraftPostFeature: PostFeature ?? [],
      DraftPostImage: PostImage ?? [],
    });
    setIsDrafting(false);
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
            Reset
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
        <TextInputRHF name="Title" label="Tiêu đề" control={control} />
        <TextInputRHF name="Address" label="Địa chỉ" control={control} />
        <NumberInputRHF name="Price" label="Giá" control={control} />
        <NumberInputRHF name="Area" label="Diện tích (m2)" control={control} />
        <TextInputRHF name="MapUrl" label="Url bản đồ" control={control} />
        <RichTextRHF name="Description" label="Mô tả" control={control} />
        <MantineReactTableRHF
          legendLabel="Chi tiết bất động sản"
          columns={[
            {
              accessorKey: "DetailId",
              header: "Loại chi tiết",
              editVariant: "select",
              Cell: ({ cell, table, renderedCellValue, row }) =>
                table.getState()?.editingCell?.id === cell.id
                  ? renderedCellValue
                  : cell.getValue<string>()
                    ? postDetailResponse?.data?.find(
                        (r) => r.Id === row.original.Id
                      )?.Name
                    : null,
              mantineEditSelectProps: () => ({
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
        <FileTableRHF
          legendLabel="Hình ảnh"
          name="PostImage"
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
