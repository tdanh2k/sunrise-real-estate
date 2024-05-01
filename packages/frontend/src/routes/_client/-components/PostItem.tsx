import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { TypePost } from "@sunrise-backend/src/schemas/Post.schema";

export const PostItem: FC<{ data?: TypePost }> = ({ data }) => {
  return (
    <div className="text-center col-lg-4 col-12 col-md-6 ">
      <div className="item">
        <div className="item-image">
          <img className="img-fluid" src="/images/product1.jpeg" alt="flat" />
        </div>
        <div className="item-description">
          <div className="d-flex justify-content-between mb-3">
            <span className="item-title">{data?.Title}</span>
            <span className="item-price">
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
              to={`/post/$id`}
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
