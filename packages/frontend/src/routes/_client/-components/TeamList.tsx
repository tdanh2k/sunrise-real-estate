import { Title } from "./Title";
import { TeamItem } from "./TeamItem";
import { FC } from "react";

export const TeamList: FC = () => {
  const title = {
    text: "Về chúng tôi",
    description: "Đội ngũ chuyên nghiệp",
  };
  return (
    <section className="section-teams">
      <div className="container">
        <Title title={title.text} description={title.description} />
        <div className="row">
          <TeamItem
            name="Nguyễn Thành Danh"
            position="CEO - Manager"
            image="https://scontent.fsgn2-6.fna.fbcdn.net/v/t1.6435-9/34704832_2117229951855022_1241050913511047168_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=J3T1w_TdodQAb76iZNT&_nc_ht=scontent.fsgn2-6.fna&oh=00_AfA4MhpdRVgYEvCOEpHtz2Gv3Yn2kayIAFFY2m9yrN5SRw&oe=66568DD0"
            facebook="https://www.facebook.com/danh.thanh.2k"
          />
          <TeamItem
            name="Nguyễn Vũ Trần Ngọc Bảo"
            position="Nhân viên"
            image="https://zpsocial-f57-org.zadn.vn/079e30d1669186cfdf80.jpg"
            facebook="https://www.facebook.com/profile.php?id=100022489532447"
          />
        </div>
      </div>
    </section>
  );
};
