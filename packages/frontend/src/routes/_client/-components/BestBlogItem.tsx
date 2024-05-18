import { TypeBlog } from "@sunrise-backend/src/schemas/Blog.schema";
import { Link } from "@tanstack/react-router";
import { FC } from "react";

export const BestBlogItem: FC<{ data?: TypeBlog }> = ({ data }) => {
  return (
    <div className="best-estate">
      <div className="best-estate-item">
        <div className="best-estate-img-area">
          <img
            className="best-estate-img"
            src={data?.BlogImage?.[0]?.Path ?? "/images/product1.jpeg"}
            alt="flat"
          />
          <div className={`best-estate-state bg-green`}>Best</div>
        </div>
        <div className="best-estate-content">
          <h4>
            <Link to="/blogs/$id" params={{ id: data?.Id ?? "" }}>
              {data?.Title}
            </Link>
          </h4>
          <span>
            <Link to="/blogs/$id" params={{ id: data?.Id ?? "" }}>
              {data?.GlobalBlogType?.Name}
            </Link>
          </span>
        </div>
        <div className="best-estate-features">
          <div className="d-flex">
            {/* {data?.PostFeature?.map((item) => (
              <div key={item.Id} className="best-estate-feature">
                <i className="fas fa-check-circle"></i>
                <span>{item.Title}</span>
              </div>
            ))} */}
            {/* <div className="best-estate-feature">
              <i className="fas fa-check-circle"></i>
              <span>3 Beds</span>
            </div>
            <div className="best-estate-feature">
              <i className="fas fa-check-circle"></i>
              <span>2 Bathrooms</span>
            </div> */}
          </div>
          {/* <h5 className="best-estate-price">{data?.Price}</h5> */}
        </div>
      </div>
    </div>
  );
};
