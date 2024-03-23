import { FC } from "react";
import { BlogItem } from "../-components/BlogItem";
import { createFileRoute } from "@tanstack/react-router";

export const Blog: FC = () => {
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
            <BlogItem
              link="blog-1"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            />
            <BlogItem
              link="blog-2"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            />
            <BlogItem
              link="blog-3"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            />
            <BlogItem
              link="blog-4"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            />
            <BlogItem
              link="blog-5"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            />
            <BlogItem
              link="blog-6"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            />
            <BlogItem
              link="blog-7"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            />
            <BlogItem
              link="blog-8"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            />
            <BlogItem
              link="blog-9"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Route = createFileRoute("/_client/blog/")({
  component: Blog,
});
