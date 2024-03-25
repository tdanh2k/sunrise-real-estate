import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddPostSchema,
  TypeAddPost,
} from "sunrise-real-estate-backend/src/schemas/AddPost.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextRHF } from "@components/MantineRHF/RichTextRHF";

type ModalAddProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const defaultValues: TypeAddPost = {
  TypeId: "",
  Code: "",
  Title: "",
  Address: "",
  Description: "",
  MapUrl: "",
  PostImage: [],
  PostCurrentDetail: [],
  PostFeature: [],
};

export const ModalAddPost: FC<ModalAddProps> = ({ isOpen, handleClose }) => {
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(AddPostSchema),
    mode: "all",
    defaultValues,
  });

  const onSubmit: SubmitHandler<TypeAddPost> = (values) => {};

  return (
    <Modal
      size="xl"
      opened={isOpen}
      onClose={() => {
        handleClose();
        reset();
      }}
      title="Thêm bài đăng"
      centered
    >
      <LoadingOverlay
        visible={false}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Stack mb={10}>
        <TextInputRHF name="Code" label="Mã quản lý" control={control} />
        <TextInputRHF name="Title" label="Tiêu đề" control={control} />
        <TextInputRHF name="Address" label="Địa chỉ" control={control} />
        <RichTextRHF name="Description" label="Mô tả" control={control} />
      </Stack>

      <Group justify="space-between" mt="xl">
        <Button variant="transparent" onClick={() => reset()}>
          Clear
        </Button>
        <Button color="blue" onClick={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </Group>
    </Modal>
  );
};
