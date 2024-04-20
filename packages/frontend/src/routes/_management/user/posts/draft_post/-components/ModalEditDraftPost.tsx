import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddDraftPostSchema,
  TypeAddDraftPost,
} from "@sunrise-backend/src/schemas/AddDraftPost.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";
import { MantineReactTableRHF } from "@components/MantineRHF/MantineReactTableRHF";
import { privateRoute } from "@utils/trpc";
import { QuerySelectRHF } from "@components/MantineRHF/SelectRHF/query";
import { TypeGlobalPostType } from "@sunrise-backend/src/schemas/GlobalPostType.schema";
import { CustomModal } from "@components/MantineRHF/CustomModal";
import { NumberInputRHF } from "@components/MantineRHF/NumberInputRHF";
import { useNavigate } from "@tanstack/react-router";

type ModalEditDraftProps = {
  isOpen: boolean;
  editId?: string;
  handleClose: () => void;
};

const defaultValues: TypeAddDraftPost = {
  TypeId: "",
  Code: "",
  Title: "",
  Address: "",
  Description: "",
  Price: 0,
  MapUrl: "",
  DraftPostImage: [],
  DraftPostCurrentDetail: [],
  DraftPostFeature: [],
};

export const ModalEditDraftPost: FC<ModalEditDraftProps> = ({
  isOpen,
  editId,
  handleClose,
}) => {
  const navigate = useNavigate({ from: "/user/posts/draft_post" });
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const utils = privateRoute.useUtils();

  const {
    data: globalPostDetailResponse,
    isFetching: isGetAllGlobalPostDetailFetching,
  } = privateRoute.user.global_post_detail.all.useQuery(undefined, {
    enabled: Boolean(editId),
  });

  const {
    data: draftPostByIdResponse,
    isFetching: isGetDraftPostByIdFetching,
  } = privateRoute.user.draft_post.byId.useQuery(
    { Id: editId ?? "" },
    {
      enabled: Boolean(editId),
    }
  );

  const { handleSubmit, control, reset } = useForm({
    resolver: isDrafting ? zodResolver(AddDraftPostSchema) : undefined,
    mode: "all",
    defaultValues,
    values: {
      ...defaultValues,
      ...draftPostByIdResponse?.data,
    },
  });

  const { mutateAsync, isPending: isPostPending } =
    privateRoute.user.pending_post.createFromDraft.useMutation({
      onSuccess: () => {
        utils.user.post.invalidate();
      },
    });

  const { mutateAsync: mutateDraftAsync, isPending: isDraftPending } =
    privateRoute.user.draft_post.create.useMutation({
      onSuccess: () => {
        utils.user.draft_post.invalidate();
        navigate({ to: "/user/posts/pending_posts" });
      },
    });

  const onSubmit: SubmitHandler<TypeAddDraftPost> = async (values) => {
    if (!window.confirm("Bạn đã chắc chắn?")) return;

    await mutateAsync(values);
    handleClose();
    reset();
  };

  const onDraftSubmit: SubmitHandler<TypeAddDraftPost> = async ({
    DraftPostCurrentDetail,
    DraftPostFeature,
    DraftPostImage,
    ...rest
  }) => {
    if (!window.confirm("Bạn đã chắc chắn?")) return;

    await mutateDraftAsync({
      ...rest,
      DraftPostCurrentDetail: DraftPostCurrentDetail ?? [],
      DraftPostFeature: DraftPostFeature ?? [],
      DraftPostImage: DraftPostImage ?? [],
    });
    handleClose();
    reset();
  };

  const isLoading =
    isGetAllGlobalPostDetailFetching ||
    isGetDraftPostByIdFetching ||
    isDraftPending ||
    isPostPending;

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
        <QuerySelectRHF<TypeAddDraftPost, TypeGlobalPostType>
          name="TypeId"
          label="Loại bài đăng"
          useQuery={privateRoute.user.global_post_type.all.useQuery}
          mapOption={(item) => ({
            label: item.Name,
            value: item.Id,
          })}
          control={control}
        />
        <TextInputRHF name="Code" label="Mã quản lý" control={control} />
        <TextInputRHF name="Title" label="Tiêu đề" control={control} />
        <TextInputRHF name="Address" label="Địa chỉ" control={control} />
        <NumberInputRHF name="Price" label="Giá" control={control} />
        <TextInputRHF name="MapUrl" label="Url bản đồ" control={control} />
        <RichTextRHF name="Description" label="Mô tả" control={control} />
        <MantineReactTableRHF
          legendLabel="Chi tiết bất động sản"
          columns={[
            {
              accessorKey: "DetailId",
              header: "DetailId",
              editVariant: "select",
              // mantineEditTextInputProps: ({ row }) => ({
              //   // value: fields?.find((item) => item.Id === row.original.Id)
              //   //   ?.DetailId,
              // }),
              mantineEditSelectProps: ({ row }) => ({
                // value: fields?.find((item) => item.Id === row.original.Id)
                //   ?.DetailId,
                data: globalPostDetailResponse?.data?.map((item) => ({
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
                  control?._formState?.errors?.DraftPostCurrentDetail?.[row.index]
                    ?.Value?.message,
              }),
            },
          ]}
          externalLoading={isLoading}
          name="DraftPostCurrentDetail"
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
                error: control?._formState?.errors?.Description?.message,
              }),
            },
          ]}
          externalLoading={isLoading}
          name="DraftPostFeature"
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

// const PostCurrentDetailTable: FC<{
//   control: Control<TypeAddDraftPost>;
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
//               //  control?._formState?.errors?.PostCurrentDetail?.[row.index]?.DetailId,
//             }),
//           },
//           {
//             accessorKey: "Value",
//             header: "Value",
//             mantineEditTextInputProps: ({ row }) => ({
//               //value: fields?.find((item) => item.Id === row.original.Id)?.Value,
//               //error: control?._formState?.errors?.PostCurrentDetail?.[0]?.Value,
//               error:
//                 control?._formState?.errors?.PostCurrentDetail?.[row.index]
//                   ?.Value?.message,
//             }),
//           },
//         ]}
//         externalLoading={isFetching}
//         name="PostCurrentDetail"
//         control={control}
//         //methods={methods}
//         // onCreate={({ values }) => {
//         //   append(values);
//         // }}
//       />
//     </>
//   );
// };
