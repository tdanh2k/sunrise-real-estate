import { Title } from "./Title";
import { PostItem } from "./PostItem";
import { FC } from "react";
import { publicRoute } from "@utils/trpc";
import { LoadingOverlay } from "@mantine/core";
import { TypePost } from "@sunrise-backend/src/schemas/Post.schema";

export const PostList: FC = () => {
  const { data, isFetching } = publicRoute.topPost.useQuery();

  const title = {
    text: "Top bài đăng nhà đất",
    description: "Lorem ipsum dolor sit ame",
  };
  return (
    <section className="section-all-re">
      <LoadingOverlay
        visible={isFetching}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <div className="container">
        <Title title={title.text} description={title.description} />
        <div className="row">
          {data?.data?.map((item) => <PostItem key={item.Id} data={item as TypePost} />)}
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
