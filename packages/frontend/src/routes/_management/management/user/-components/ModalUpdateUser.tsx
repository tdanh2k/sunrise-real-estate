import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  UpdateAuth0UserSchema,
  TypeUpdateAuth0User,
} from "@sunrise-backend/src/schemas/UpdateAuth0User.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { privateRoute } from "@utils/trpc";
import { CustomModal } from "@components/MantineRHF/CustomModal";

type ModalUpdateProps = {
  isOpen: boolean;
  userId: string;
  handleClose: () => void;
};

const defaultValues: TypeUpdateAuth0User = {
  //username: "",
  email: "",
  phone_number: "",
  name: "",
  nickname: "",
  password: "",
  picture: "",
  family_name: "",
  given_name: "",
  blocked: false,
};

export const ModalUpdateAuth0User: FC<ModalUpdateProps> = ({
  isOpen,
  userId,
  handleClose,
}) => {
  const utils = privateRoute.useUtils();

  const {
    data: auth0UserByIdResponse,
    isFetching: isGetAuth0UserByIdFetching,
  } = privateRoute.management.admin_user.byUserId.useQuery(
    { Id: userId },
    { enabled: Boolean(userId) }
  );

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(UpdateAuth0UserSchema),
    mode: "all",
    values: {
      ...defaultValues,
      ...auth0UserByIdResponse?.data,
      blocked: auth0UserByIdResponse?.data?.blocked ?? false,
    },
  });

  const { mutateAsync, isPending } =
    privateRoute.management.admin_user.update.useMutation({
      onSuccess: () => {
        utils.management.admin_user.invalidate();
      },
    });

  const onSubmit: SubmitHandler<TypeUpdateAuth0User> = async (values) => {
    if (!window.confirm("Bạn đã chắc chắn?")) return;

    await mutateAsync(values);
    handleClose();
    reset();
  };

  const isLoading = isPending || isGetAuth0UserByIdFetching;

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
      title="Cập nhật thông tin tài khoản"
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
            color="blue"
            loading={isLoading}
            onClick={handleSubmit(onSubmit, (error) => console.error(error))}
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
        {/* <TextInputRHF name="username" label="Username" control={control} /> */}
        <TextInputRHF name="email" label="Email" control={control} />
        <TextInputRHF
          name="phone_number"
          label="Số điện thoại"
          control={control}
        />
        <TextInputRHF name="name" label="Tên" control={control} />
        <TextInputRHF
          name="picture"
          label="URL hình đại diện"
          control={control}
        />
        <TextInputRHF name="password" label="Mật khẩu" control={control} />
      </Stack>
    </CustomModal>
  );
};
