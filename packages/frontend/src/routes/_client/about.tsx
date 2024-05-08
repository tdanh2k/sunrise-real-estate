import { useAuth0 } from "@auth0/auth0-react";
import { createFileRoute } from "@tanstack/react-router";

export const About = () => {
  const { error } = useAuth0();

  return (
    <section className="about">
      <div className="page-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="page-title">About</h1>
              <h2 className="page-description">sunrise-real-estate.online</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <img
                src="/images/product1.jpeg"
                alt="product"
                className="w-100"
              />
            </div>
            <div className="col-lg-6">
              <div className="about-item">
                <div className="title">Giới thiệu về sunrise-real-estate.online</div>
                <div className="about-text">
       
Chào mừng đến với www.sunrise-real-estate.online - Nơi giúp bạn tìm kiếm và mua bán bất động sản dễ dàng!

Tại sunrise-real-estate.online, chúng tôi hiểu rằng mua hoặc bán một tài sản bất động sản là một quyết định lớn trong cuộc đời. Vì vậy, chúng tôi cam kết cung cấp cho bạn trải nghiệm tuyệt vời nhất với nền tảng đáng tin cậy và hiệu quả của mình. Dù bạn đang tìm kiếm một ngôi nhà mới, một căn hộ, một khu đất hoặc một tài sản thương mại, chúng tôi sẽ là người đồng hành tin cậy trong hành trình của bạn.

Với lợi thế của công nghệ tiên tiến và đội ngũ chuyên gia giàu kinh nghiệm, sunrise-real-estate.online cung cấp cho bạn công cụ tìm kiếm mạnh mẽ để khám phá các tài sản bất động sản phù hợp với nhu cầu và ngân sách của bạn. Chúng tôi cập nhật liên tục cơ sở dữ liệu rộng lớn với các tin rao mới nhất từ các đại lý bất động sản và chủ nhà uy tín trên khắp đất nước.

Ngoài ra, sunrise-real-estate.online còn cung cấp các tính năng hữu ích như đánh giá giá trị tài sản, lịch sử giao dịch, thông tin về khu vực, và nhiều hơn nữa. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua bán bất động sản an toàn, minh bạch và hiệu quả.

Hãy tham gia cùng chúng tôi và khám phá thế giới bất động sản một cách dễ dàng hơn bao giờ hết. Đăng ký ngay hôm nay và bắt đầu hành trình của bạn với sunrise-real-estate.online!
                </div>
                <div className="about-features">
                  <p className="about-feature">
                    <i className="fas fa-long-arrow-alt-right"></i> 
                    
                  </p>
                  <p className="about-feature">
                    <i className="fas fa-long-arrow-alt-right"></i> 
                    
                  </p>
                  <p className="about-feature">
                    <i className="fas fa-long-arrow-alt-right"></i> 
                    
                  </p>
                  {error?.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Route = createFileRoute("/_client/about")({
  component: About,
});
