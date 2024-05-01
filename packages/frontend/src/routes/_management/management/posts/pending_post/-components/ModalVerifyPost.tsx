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
import { NumberInputRHF } from "@components/MantineRHF/NumberInputRHF";
import { TypePendingPost } from "@sunrise-backend/src/schemas/PendingPost.schema";

type ModalProps = {
  isOpen: boolean;
  postId: string;
  handleClose: () => void;
};

const defaultValues: TypePendingPost = {
  Id: "",
  TypeId: "",
  Code: "",
  Title: "",
  Address: "",
  Description: "",
  Price: 0,
  MapUrl: "",
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
      ...pendingPostByIdResponse,
    },
  });

  const { mutateAsync, isPending } =
    privateRoute.management.post.publish.useMutation({
      onSuccess: () => {
        utils.management.post.invalidate();
      },
    });

  const onSubmit: SubmitHandler<TypeAddPost> = async (values) => {
    await mutateAsync(values);
    handleClose();
    reset();
  };

  const isLoading =
    isGetAllGlobalPostDetailFetching || isGetPendingPostByIdFetching;

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
      title="Duyệt bài đăng"
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
        visible={isPending || isLoading}
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
        <TextInputRHF
          name="Code"
          label="Mã quản lý"
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
              header: "DetailId",
              editVariant: "select",
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
      </Stack>
    </CustomModal>
  );
};
