import { LoadingOverlay } from "@mantine/core";
import {
  AddFeedbackSchema,
  TypeAddFeedback,
} from "@sunrise-backend/src/schemas/AddFeedback.schema";
import { createFileRoute } from "@tanstack/react-router";
import { publicRoute } from "@utils/trpc";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Contact: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<TypeAddFeedback>({
    resolver: zodResolver(AddFeedbackSchema),
    mode: "all",
    defaultValues: {
      Name: "",
      Email: "",
      Phone: "",
      Title: "",
      Description: "",
    },
  });

  const { mutateAsync: addFeedbackAsync, isPending } =
    publicRoute.addFeedback.useMutation({
      onSuccess: () => {
        reset();
        // notifications.show({
        //   title: "Thông báo",
        //   message: "Gửi phản hồi thành công!",
        // });
      },
    });

  const onSubmit: SubmitHandler<TypeAddFeedback> = async (values) => {
    await addFeedbackAsync(values);
  };

  return (
    <section className="contact">
      <div className="page-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="page-title">Liên hệ</h1>
              <h2 className="page-description">Hãy kết nối với chúng tôi</h2>
            </div>
          </div>
        </div>
      </div>
      <LoadingOverlay
        visible={isPending}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <h6>22630071.bao@student.iuh.edu.vn</h6>
                    <h6>22630511.danh@student.iuh.edu.vn</h6>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <h6>12 Nguyễn Văn Bảo, Q.Gò Vấp, TP.HCM</h6>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="contact-item">
                    <i className="fas fa-phone-alt"></i>
                    <h6>123456789</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <form onSubmit={handleSubmit(onSubmit)} className="row mt-5">
                <div className="col-lg-12">
                  <label style={{ color: errors?.Name ? "red" : undefined }}>
                    Tên người gửi
                  </label>
                  <input {...register("Name")} className="inp-contact" />
                  <p className="text-danger">{errors.Name?.message}</p>
                </div>
                <div className="col-lg-6">
                  <label style={{ color: errors?.Phone ? "red" : undefined }}>
                    Số điện thoại
                  </label>
                  <input {...register("Phone")} className="inp-contact" />
                  <p className="text-danger">{errors.Phone?.message}</p>
                </div>
                <div className="col-lg-6">
                  <label style={{ color: errors?.Email ? "red" : undefined }}>
                    Email
                  </label>
                  <input {...register("Email")} className="inp-contact" />
                  <p className="text-danger">{errors.Email?.message}</p>
                </div>
                <div className="col-lg-12">
                  <label style={{ color: errors?.Title ? "red" : undefined }}>
                    Chủ đề
                  </label>
                  <input {...register("Title")} className="inp-contact" />
                  <p className="text-danger">{errors.Title?.message}</p>
                </div>
                <div className="col-lg-12">
                  <label
                    style={{ color: errors?.Description ? "red" : undefined }}
                  >
                    Nội dung
                  </label>
                  <textarea
                    {...register("Description")}
                    className="ta-contact"
                    rows={4}
                  />
                  <p className="text-danger">{errors.Description?.message}</p>
                </div>
                <div className="col-lg-12">
                  <button type="submit" className="btn-contact">
                    Gửi nội dung
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Route = createFileRoute("/_client/contact")({
  wrapInSuspense: true,
  pendingComponent: () => (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 2 }}
    />
  ),
  component: Contact,
});
