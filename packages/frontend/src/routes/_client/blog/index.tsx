import { FC } from "react";
import { BlogItem } from "../-components/BlogItem";
import { createFileRoute } from "@tanstack/react-router";
import { publicRoute } from "@utils/trpc";
import { TypeBlog } from "@sunrise-backend/src/schemas/Blog.schema";

export const Blog: FC = () => {
  const { data: response } = publicRoute.topBlogs.useQuery();
  return (
    <section className="blog">
      <div className="page-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="page-title">Blog</h1>
              <h2 className="page-description">Blog</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="row">
            {response?.data?.map((item) => (
              <BlogItem key={item.Id} data={item as TypeBlog} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Route = createFileRoute("/_client/blog/")({
  component: Blog,
});
