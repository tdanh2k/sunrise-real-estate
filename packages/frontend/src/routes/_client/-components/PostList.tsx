import { Title } from "./Title";
import { PostItem } from "./PostItem";
import { FC } from "react";
import { publicRoute } from "@utils/trpc";
import { TypePost } from "@sunrise-backend/src/schemas/Post.schema";

export const PostList: FC = () => {
  const [{ data }] = publicRoute.topPost.useSuspenseQuery();

  const title = {
    text: "Top bài đăng nhà đất",
    description: "Những bài đăng được xem nhiều nhât",
  };
  return (
    <section className="section-all-re">
      <div className="container">
        <Title title={title.text} description={title.description} />
        <div className="row">
          {data?.map((item) => (
            <PostItem key={item.Id} data={item as TypePost} />
          ))}
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
