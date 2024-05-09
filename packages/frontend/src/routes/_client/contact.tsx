import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";

export const Contact: FC = () => {
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
              <div className="row mt-5">
                <div className="col-lg-6">
                  <label>Tên người gửi</label>
                  <input type="text" className="inp-contact" />
                </div>
                <div className="col-lg-6">
                  <label>Số điện thoại</label>
                  <input type="text" className="inp-contact" />
                </div>
                <div className="col-lg-12">
                  <label>Chủ đề</label>
                  <input type="text" className="inp-contact" />
                </div>
                <div className="col-lg-12">
                  <label>Nội dung</label>
                  <textarea className="ta-contact" rows={4} />
                </div>
                <div className="col-lg-12">
                  <button className="btn-contact">Gửi nội dung</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Route = createFileRoute("/_client/contact")({
  component: Contact,
});
