import { Title } from "./Title";
import { PostItem } from "./PostItem";
import { FC } from "react";
import { publicRoute } from "@utils/trpc";

export const PostList: FC = () => {
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
          {data?.data?.map((item) => <PostItem key={item.Id} data={item} />)}
          {/* <PostItem slug="lorem-ipsum-1" />
          <PostItem slug="lorem-ipsum-2" />
          <PostItem slug="lorem-ipsum-3" />
          <PostItem slug="lorem-ipsum-4" />
          <PostItem slug="lorem-ipsum-5" />
          <PostItem slug="lorem-ipsum-6" /> */}
        </div>
      </div>
    </section>
  );
};