import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { TypePost } from "@sunrise-backend/src/schemas/Post.schema";

export const PostItem: FC<{ data?: TypePost }> = ({ data }) => {
  return (
    <div className="text-center col-lg-4 col-12 col-md-6 ">
      <div className="item">
        <div className="item-image">
          <img
            className="img-fluid"
            src={data?.PostImage?.[0]?.Path ?? "/images/product1.jpeg"}
            alt="flat"
          />
        </div>
        <div className="item-description">
          <div className="d-flex flex-column">
            <span
              className="item-title text-truncate d-inline-block"
              style={{ maxWidth: "100%" }}
            >
              {data?.Title}
            </span>
            <span className="item-price">
              {data?.Area ?? 0} m2 . {" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                compactDisplay: "short",

                //maximumFractionDigits: 9,
              }).format(data?.Price ?? 0)}
            </span>
          </div>
          <div className="item-icon d-flex alig-items-center justify-content-between">
            <div>
              <i className="fas fa-check-circle"></i>{" "}
              <span>Lorem ipsum dolor</span>
            </div>
            <div>
              <i className="fas fa-check-circle"></i> <span> Lorem </span>
            </div>
            <Link
              to={`/posts/$id`}
              params={{ id: data?.Id ?? "" }}
              className="item-title"
            >
              <button className="btn btn-detail">View</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
