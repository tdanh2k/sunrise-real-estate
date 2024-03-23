import { TextInputRHF } from "@components/MantineRHF/TextInputRHF";
import { Modal } from "@mantine/core";
import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  AddPostSchema,
  TypeAddPost,
} from "sunrise-real-estate-backend/src/schemas/AddPost.schema";

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
  const methods = useForm<TypeAddPost>({
    resolver: zodResolver(AddPostSchema),
    mode: "all",
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = methods;

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title="Thêm bài đăng"
      centered
    >
      <TextInputRHF name="Code" label="Mã quản lý" />
      <TextInputRHF name="Title" label="TIêu đề" />
    </Modal>
  );
};
