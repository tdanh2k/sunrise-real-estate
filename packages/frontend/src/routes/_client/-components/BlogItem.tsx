import { Link } from "@tanstack/react-router";
import { TypeBlog } from "@sunrise-backend/src/schemas/Blog.schema";
import { FC } from "react";

export const BlogItem: FC<{ data: TypeBlog }> = ({ data }) => {
  return (
    <div className="col-lg-4">
      <div className="blog-item">
        <div className="blog-img">
          <img src="/images/product1.jpeg" alt="product" className="w-100" />
        </div>
        <div className="blog-content">
          <h2 className="blog-title" title={data?.Title}>
            <Link to={`/blog/$id`} params={{ id: data?.Id ?? "" }}>
              {data?.Title}
            </Link>
          </h2>
          <div className="blog-info">
            <div className="blog-info-item">
              <i className="far fa-calendar-alt "></i>
              <span>{data?.CreatedDate?.toISOString()}</span>
            </div>
            <div className="blog-info-item">
              <i className="far fa-comments"></i>
              <span>0 Comments</span>
            </div>
          </div>
          <div className="blog-text">{data?.Description}</div>
        </div>
      </div>
    </div>
  );
};
