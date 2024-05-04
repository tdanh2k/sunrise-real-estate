import { FC } from "react";
import Slider, { Settings } from "react-slick";
import { Title } from "./Title";

export const BestPostList: FC = () => {
  const title = {
    text: "Lorem Ipsum",
    description: "Lorem ipsum dolor sit ame",
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

  //const { data: response } = publicRoute.topPost.useQuery();

  return (
    <section className="section-best-estate">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Title title={title.text} description={title.description} />
            <Slider {...settings}>
              {/* {response?.data?.map((item) => (
                <BestPostItem key={item.Id} data={item} />
              ))} */}
              {/* <BestPostItem flatState="For Rent" />
              <BestPostItem flatState="For Sale" />
              <BestPostItem flatState="For Rent" />
              <BestPostItem flatState="For Rent" />
              <BestPostItem flatState="For Sale" />
              <BestPostItem flatState="For Rent" /> */}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};
