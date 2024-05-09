import { FC } from "react";

export const Footer: FC = () => {
  return (
    <section className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <i className="fas fa-home"></i>
            <span className="footer-other-text d-block mt-3 mb-3">
            SRE sẽ đáp ứng mọi mong muốn của bạn
            </span>
            <div className="footer-social">
              <div className="footer-social-item">
                <i className="fab fa-facebook"></i>
              </div>
              <div className="footer-social-item">
                <i className="fab fa-twitter"></i>
              </div>
              <div className="footer-social-item">
                {" "}
                <i className="fab fa-instagram"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <p className="footer-title">Menu</p>
            <ul className="footer-ul">
              <li>Trang chủ</li>
              <li>Blog</li>
              <li>Giới thiệu</li>
              <li>Liên hệ</li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <div>
              <p className="footer-title">Categories</p>
              <ul className="footer-ul">
                <li>Category 1</li>
                <li>Category 2</li>
                <li>Category 3</li>
                <li>Category 4</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <p className="footer-title">Contact</p>
            <ul className="footer-ul">
              <li className="d-flex">
                <div className="footer-info-item">
                  <i className="fas fa-clock"></i>
                </div>{" "}
                <span>08:00-23:00</span>
              </li>
              <li className="d-flex">
                <div className="footer-info-item">
                  <i className="fas fa-envelope"></i>
                </div>{" "}
                <span>22630511.danh@student.iuh.edu.vn</span>
              </li>
              <li className="d-flex">
                <div className="footer-info-item">
                  <i className="fas fa-envelope"></i>
                </div>{" "}
                <span>22630071.bao@student.iuh.edu.vn</span>
              </li>
              <li className="d-flex">
                <div className="footer-info-item">
                  <i className="fas fa-map-marker-alt"></i>
                </div>{" "}
                <span>12 Nguyễn Văn Bảo, Q.Gò Vấp, TP.HCM </span>
              </li>
              <li className="d-flex">
                <div className="footer-info-item">
                  <i className="fas fa-phone-alt"></i>
                </div>{" "}
                <span>123456789</span>
              </li>
            </ul>
          </div>
          {/*<div className="col-lg-3 col-md-6">
                        <p className="footer-title">Subscribe</p>
                        <span className="footer-other-text">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore dolore magna
                        </span>
                        <div className="subscribe-area mb-2 mt-2">
                            <input type="text" placeholder="Email" className="inp-footer w-100" />
                        </div>
                        <button className="btn-subscribe">Subscribe</button>
                    </div>*/}
        </div>
      </div>
    </section>
  );
};
