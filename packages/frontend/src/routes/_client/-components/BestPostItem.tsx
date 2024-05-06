import { TypePost } from "@sunrise-backend/src/schemas/Post.schema";
import { Link } from "@tanstack/react-router";
import { FC } from "react";

export const BestPostItem: FC<{ data?: TypePost }> = ({ data }) => {
  return (
    <div className="best-estate">
      <div className="best-estate-item">
        <div className="best-estate-img-area">
          <img
            className="best-estate-img"
            src="/images/product1.jpeg"
            alt="flat"
          />
          <div className={`best-estate-state bg-green`}>Best</div>
        </div>
        <div className="best-estate-content">
          <h4>
            <Link to="/">Lorem Ipsum</Link>
          </h4>
          <span>
            <Link to="/">Lorem Ipsum</Link>
          </span>
        </div>
        <div className="best-estate-features">
          <div className="d-flex">
            {data?.PostFeature?.map((item) => (
              <div key={item.Id} className="best-estate-feature">
                <i className="fas fa-check-circle"></i>
                <span>{item.Title}</span>
              </div>
            ))}
            {/* <div className="best-estate-feature">
              <i className="fas fa-check-circle"></i>
              <span>3 Beds</span>
            </div>
            <div className="best-estate-feature">
              <i className="fas fa-check-circle"></i>
              <span>2 Bathrooms</span>
            </div> */}
          </div>
          <h5 className="best-estate-price">{data?.Price}</h5>
        </div>
      </div>
    </div>
  );
};
