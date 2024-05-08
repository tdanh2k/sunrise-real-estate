import { FC } from "react";

export const TeamItem: FC<{
  name: string;
  position: string;
  image: string;
  facebook?:string;
  twitter?:string;
  instagram?:string;
  linkedin?:string;
}> = ({ name, position, image, facebook, instagram, linkedin,twitter }) => {
  return (
    <div className="col-lg-4">
      <div className="team">
        <div className="team-img">
          <img src={image} alt="team" />
        </div>
        <div className="team-info">
          <h5 className="team-name">{name}</h5>
          <h6 className="team-position">{position}</h6>
          <div className="social-links">
            <a className="social-item" target="_blank" rel="noopener noreferrer" href={facebook}>
              <i className="fab fa-facebook"></i>
            </a>
            <a className="social-item" target="_blank" rel="noopener noreferrer" href={twitter}>
              <i className="fab fa-twitter"></i>
            </a>
            <a className="social-item" target="_blank" rel="noopener noreferrer" href={instagram}>
              <i className="fab fa-instagram"></i>
            </a>
            <a className="social-item" target="_blank" rel="noopener noreferrer" href={linkedin}>
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
