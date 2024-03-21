import { useAuth0 } from "@auth0/auth0-react";
import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@utils/trpc";

export const About = () => {
  const { error } = useAuth0();

  return (
    <section className="about">
      <div className="page-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="page-title">About</h1>
              <h2 className="page-description">cvxvc</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <img
                src="/images/product1.jpeg"
                alt="product"
                className="w-100"
              />
            </div>
            <div className="col-lg-6">
              <div className="about-item">
                <div className="title">Lorem ipsum dolor sit amet</div>
                <div className="about-text">
                  Lorem ipsum is simply free text dolor sit am adipi we help you
                  ensure everyone is in the right jobs sicing elit, sed do
                  consulting firms Et leggings across the nation tempor.
                </div>
                <div className="about-features">
                  <p className="about-feature">
                    <i className="fas fa-long-arrow-alt-right"></i> Lorem ipsum
                    is simply
                  </p>
                  <p className="about-feature">
                    <i className="fas fa-long-arrow-alt-right"></i> Lorem ipsum
                    is simply
                  </p>
                  <p className="about-feature">
                    <i className="fas fa-long-arrow-alt-right"></i> Lorem ipsum
                    is simply
                  </p>
                  {error?.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Route = createFileRoute("/_client/about")({
  component: About,
});
