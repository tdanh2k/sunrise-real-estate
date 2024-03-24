import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Modal } from "@mantine/core";
import { FC } from "react";
import { useForm } from "react-hook-form";
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

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        handleClose();
        reset();
      }}
      title="Thêm bài đăng"
      centered
    >
      <TextInputRHF name="Code" label="Mã quản lý" control={control} />
      <TextInputRHF name="Title" label="Tiêu đề" control={control} />
      <TextInputRHF name="Address" label="Tiêu đề" control={control} />
      <RichTextRHF name="Description" control={control} />
    </Modal>
  );
};
