import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddPostSchema } from "@sunrise-backend/src/schemas/AddPost.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";
import { MantineReactTableRHF } from "@components/MantineRHF/MantineReactTableRHF";
import { privateRoute } from "@utils/trpc";
import { QuerySelectRHF } from "@components/MantineRHF/SelectRHF/query";
import { TypeGlobalPostType } from "@sunrise-backend/src/schemas/GlobalPostType.schema";
import { CustomModal } from "@components/MantineRHF/CustomModal";
import { NumberInputRHF } from "@components/MantineRHF/NumberInputRHF";
import { TypePendingPost } from "@sunrise-backend/src/schemas/PendingPost.schema";
import { FileTableRHF } from "@components/MantineRHF/FileTableRHF";

type ModalProps = {
  isOpen: boolean;
  postId: string;
  handleClose: () => void;
};

const defaultValues: TypePendingPost = {
  Id: "",
  TypeId: "",
  Title: "",
  Address: "",
  Description: "",
  Price: 0,
  MapUrl: "",
  Area: 0,
  PendingPostImage: [],
  PendingPostCurrentDetail: [],
  PendingPostFeature: [],
};

export const ModalVerifyPost: FC<ModalProps> = ({
  isOpen,
  postId,
  handleClose,
}) => {
  const utils = privateRoute.useUtils();

  const {
    data: postDetailResponse,
    isFetching: isGetAllGlobalPostDetailFetching,
  } = privateRoute.management.global_post_detail.all.useQuery();

  const {
    data: pendingPostByIdResponse,
    isFetching: isGetPendingPostByIdFetching,
  } = privateRoute.management.pending_post.byId.useQuery(
    {
      Id: postId,
    },
    {
      enabled: Boolean(postId),
    }
  );

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(AddPostSchema),
    mode: "all",
    values: {
      ...defaultValues,
      ...(pendingPostByIdResponse?.data ?? {}),
    },
  });

  const { mutateAsync: approveAsync, isPending: isApprovePending } =
    privateRoute.management.pending_post.approve.useMutation({
      onSuccess: () => {
        utils.management.post.invalidate();
      },
    });

  const { mutateAsync: rejectAsync, isPending: isRejectPending } =
    privateRoute.management.pending_post.approve.useMutation({
      onSuccess: () => {
        utils.management.post.invalidate();
      },
    });

  const onApprove: SubmitHandler<TypePendingPost> = async (values) => {
    await approveAsync(values);
    handleClose();
    reset();
  };

  const onReject: SubmitHandler<TypePendingPost> = async (values) => {
    await rejectAsync(values);
    handleClose();
    reset();
  };

  const isLoading =
    isGetAllGlobalPostDetailFetching ||
    isGetPendingPostByIdFetching ||
    isApprovePending ||
    isRejectPending;

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
      title="Xác nhận bài đăng"
      centered
      footer={
        <>
          <Button variant="transparent" onClick={() => reset()}>
            Reset
          </Button>
          <Button
            color="orange"
            onClick={handleSubmit(onReject, (error) => console.error(error))}
          >
            Từ chối
          </Button>
          <Button
            color="green"
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
        <QuerySelectRHF<TypePendingPost, TypeGlobalPostType>
          name="TypeId"
          label="Loại bài đăng"
          useQuery={privateRoute.management.global_post_type.all.useQuery}
          mapOption={(item) => ({
            label: item.Name,
            value: item.Id,
          })}
          control={control}
          readOnly
        />
        <TextInputRHF name="Title" label="Tiêu đề" control={control} readOnly />
        <TextInputRHF
          name="Address"
          label="Địa chỉ"
          control={control}
          readOnly
        />
        <TextInputRHF
          name="MapUrl"
          label="Url bản đồ"
          control={control}
          readOnly
        />
        <NumberInputRHF name="Price" label="Giá" control={control} readOnly />
        <NumberInputRHF
          name="Area"
          label="Diện tích (m2)"
          control={control}
          readOnly
        />
        <RichTextRHF
          name="Description"
          label="Mô tả"
          control={control}
          editable={false}
        />
        <MantineReactTableRHF
          legendLabel="Chi tiết bất động sản"
          disableEdit
          columns={[
            {
              accessorKey: "DetailId",
              header: "Chi tiết",
              editVariant: "select",
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
              header: "Giá trị",
            },
          ]}
          externalLoading={isLoading}
          name="PendingPostCurrentDetail"
          control={control}
          //methods={methods}
          // onCreate={({ values }) => {
          //   append(values);
          // }}
        />
        <MantineReactTableRHF
          legendLabel="Điểm đặc biệt của bất động sản"
          disableEdit
          columns={[
            {
              accessorKey: "Title",
              header: "Tiêu đề",
            },
            {
              accessorKey: "Description",
              header: "Mô tả",
            },
          ]}
          externalLoading={isLoading}
          name="PendingPostFeature"
          control={control}
          //methods={methods}
          // onCreate={({ values }) => {
          //   append(values);
          // }}
        />
        <FileTableRHF
          legendLabel="Hình ảnh"
          name="PendingPostImage"
          disableEditing
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
          ]}
        />
      </Stack>
    </CustomModal>
  );
};
