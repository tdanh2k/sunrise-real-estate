import { FC } from "react";

export const Title: FC<{ title?: string; description?: string }> = ({
  title,
  description,
}) => {
  
  return (
    <div className="row">
      <div className="col-lg-6 mx-auto">
        <div className="title-area text-center">
          <h2 className="title">{title}</h2>
          <p className="title-description">{description}</p>
        </div>
      </div>
    </div>
  );
};
