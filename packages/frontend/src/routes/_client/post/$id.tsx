import { LoadingOverlay } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { publicRoute } from "@utils/trpc";
import ImageGallery from "react-image-gallery";

export const Route = createFileRoute("/_client/post/$id")({
  component: () => {
    const { id } = Route.useParams();

    const { data: response, isFetching } = publicRoute.getPostById.useQuery(
      { id },
      { enabled: !!id }
    );

    const images = [
      {
        original: "/images/product1.jpeg",
        thumbnail: "/images/product1.jpeg",
      },
      {
        original: "/images/banner.jpg",
        thumbnail: "/images/banner.jpg",
      },
      {
        original: "/images/product1.jpeg",
        thumbnail: "/images/product1.jpeg",
      },
    ];

    return (
      <div className="flat-detail">
        <LoadingOverlay
          visible={isFetching}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <div className="page-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h1 className="page-title">DETAIL</h1>
                <h2 className="page-description">{id}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="fd-top flat-detail-content">
                <div>
                  <h3 className="flat-detail-title">{response?.data?.Title}</h3>
                  <p className="fd-address">
                    {" "}
                    <i className="fas fa-map-marker-alt"></i>
                    {response?.data?.Address}
                  </p>
                </div>
                <div>
                  <span className="fd-price">{response?.data?.Price}</span>
                </div>
              </div>
              <ImageGallery
                flickThreshold={0.5}
                slideDuration={0}
                items={images}
                showNav={false}
                showFullscreenButton={false}
                showPlayButton={false}
              />
              <div className="row">
                <div className="col-lg-8">
                  <div className="fd-item">
                    <h4>Mô tả</h4>
                    <p>
                      {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum */}
                      {response?.data?.Description}
                    </p>
                  </div>
                  <div className="fd-item fd-property-detail">
                    <h4>Chi tiết về bất động sản</h4>
                    <div className="row">
                      {response?.data?.PostCurrentDetail?.map((item) => (
                        <div className="col-lg-4">
                          <span>{item.PostDetail?.Name}: </span>
                          <span>{item.Value}</span>
                        </div>
                      ))}
                      {/* <div className="col-lg-4">
                        <span>All Rooms: </span>
                        <span>5</span>
                      </div>
                      <div className="col-lg-4">
                        <span>Kitchen: </span>
                        <span>1</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4">
                        <span>Kitchen: </span>
                        <span>1</span>
                      </div>
                      <div className="col-lg-4">
                        <span>All Rooms: </span>
                        <span>5</span>
                      </div>
                      <div className="col-lg-4">
                        <span>Kitchen: </span>
                        <span>1</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4">
                        <span>Kitchen: </span>
                        <span>1</span>
                      </div>
                      <div className="col-lg-4">
                        <span>All Rooms: </span>
                        <span>5</span>
                      </div>
                      <div className="col-lg-4">
                        <span>Kitchen: </span>
                        <span>1</span>
                      </div> */}
                    </div>
                  </div>
                  <div className="fd-item fd-features">
                    <h4>Features</h4>
                    <div className="row">
                      <div className="col-lg-4">
                        <i className="fa fa-check"></i>
                        <span>Lorem Ipsum</span>
                      </div>
                      <div className="col-lg-4">
                        <i className="fa fa-check"></i>
                        <span>Lorem Ipsum</span>
                      </div>
                      <div className="col-lg-4">
                        <i className="fa fa-check"></i>
                        <span>Lorem Ipsum</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4">
                        <i className="fa fa-check"></i>
                        <span>Lorem Ipsum</span>
                      </div>
                      <div className="col-lg-4">
                        <i className="fa fa-check"></i>
                        <span>Lorem Ipsum</span>
                      </div>
                      <div className="col-lg-4">
                        <i className="fa fa-check"></i>
                        <span>Lorem Ipsum</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4">
                        <i className="fa fa-check"></i>
                        <span>Lorem Ipsum</span>
                      </div>
                      <div className="col-lg-4">
                        <i className="fa fa-check"></i>
                        <span>Lorem Ipsum</span>
                      </div>
                      <div className="col-lg-4">
                        <i className="fa fa-check"></i>
                        <span>Lorem Ipsum</span>
                      </div>
                    </div>
                  </div>
                  <div className="fd-item">
                    <h4>Maps</h4>
                    <iframe
                      title="flat-map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15105200.564429!2d37.91245092855647!3d38.99130948591772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b0155c964f2671%3A0x40d9dbd42a625f2a!2zVMO8cmtpeWU!5e0!3m2!1str!2str!4v1630158674074!5m2!1str!2str"
                      width="100%"
                      height="450"
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="fd-sidebar-item">
                    <h4>Recently Added</h4>
                    <div className="recently-item">
                      <img
                        src="/images/product1.jpeg"
                        alt="detail"
                        width="50px"
                      />
                      <span>Lorem Ipsum Dolor</span>
                    </div>
                    <div className="recently-item">
                      <img
                        src="/images/product1.jpeg"
                        alt="detail"
                        width="50px"
                      />
                      <span>Lorem Ipsum Dolor</span>
                    </div>
                    <div className="recently-item">
                      <img
                        src="/images/product1.jpeg"
                        alt="detail"
                        width="50px"
                      />
                      <span>Lorem Ipsum Dolor</span>
                    </div>
                  </div>
                  <div className="fd-sidebar-item">
                    <h4>Category</h4>
                    <ul className="category-ul">
                      <li>Category 1</li>
                      <li>Category 2</li>
                      <li>Category 3</li>
                      <li>Category 4</li>
                      <li>Category 5</li>
                    </ul>
                  </div>
                  <div className="fd-sidebar-item">
                    <h4>Recently Added</h4>
                    <div className="recently-item">
                      <img
                        src="/images/product1.jpeg"
                        alt="detail"
                        width="50px"
                      />
                      <span>Lorem Ipsum Dolor</span>
                    </div>
                    <div className="recently-item">
                      <img
                        src="/images/product1.jpeg"
                        alt="detail"
                        width="50px"
                      />
                      <span>Lorem Ipsum Dolor</span>
                    </div>
                    <div className="recently-item">
                      <img
                        src="/images/product1.jpeg"
                        alt="detail"
                        width="50px"
                      />
                      <span>Lorem Ipsum Dolor</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
