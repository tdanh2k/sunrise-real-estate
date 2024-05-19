import { FC } from "react";
import Slider, { Settings } from "react-slick";
import { Title } from "./Title";
import { publicRoute } from "@utils/trpc";
import { BestBlogItem } from "./BestBlogItem";

export const BestBlogList: FC = () => {
  const title = {
    text: "Top bài Blog",
    description: "Những bài blog được xem nhiều nhất",
  };
  const settings: Settings = {
    infinite: true,
    speed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    //autoPlay: true,
    autoplay: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  const [{ data }] = publicRoute.topBlogs.useSuspenseQuery();

  return (
    <section className="section-best-estate">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Title title={title.text} description={title.description} />
            <Slider {...settings}>
              {data?.map((item) => <BestBlogItem key={item.Id} data={item} />)}
              {/* <BestBlogItem flatState="For Rent" />
              <BestBlogItem flatState="For Sale" />
              <BestBlogItem flatState="For Rent" />
              <BestBlogItem flatState="For Rent" />
              <BestBlogItem flatState="For Sale" />
              <BestBlogItem flatState="For Rent" /> */}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};
