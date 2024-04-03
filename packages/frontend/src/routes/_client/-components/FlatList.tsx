import { Title } from "./Title";
import { FlatItem } from "./FlatItem";
import { FC } from "react";
import { publicRoute } from "@utils/trpc";

export const FlatList: FC = () => {
  const { data } = publicRoute.topPost.useQuery();
  
  const title = {
    text: "Lorem Ipsum",
    description: "Lorem ipsum dolor sit ame",
  };
  return (
    <section className="section-all-re">
      <div className="container">
        <Title title={title.text} description={title.description} />
        <div className="row">
          {data?.data?.map((item) => <FlatItem key={item.Id} data={item} />)}
          {/* <FlatItem slug="lorem-ipsum-1" />
          <FlatItem slug="lorem-ipsum-2" />
          <FlatItem slug="lorem-ipsum-3" />
          <FlatItem slug="lorem-ipsum-4" />
          <FlatItem slug="lorem-ipsum-5" />
          <FlatItem slug="lorem-ipsum-6" /> */}
        </div>
      </div>
    </section>
  );
};