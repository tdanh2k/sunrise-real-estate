import { publicRoute } from "@utils/trpc";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import htmlParse from "html-react-parser";

export const Route = createFileRoute("/_client/blogs/$id")({
  component: () => {
    const { id } = Route.useParams();

    const [{ data }] = publicRoute.getBlogById.useSuspenseQuery({ id });

    return (
      <div className="container mt-4 mb-4">
        <div className="row">
          <div className="col-lg-8">
            <div className="blog-detail">
              <img
                className="w-100"
                src="/images/product1.jpeg"
                alt="product"
              />
              <span className="blog-detail-category">
                {data?.GlobalBlogType?.Name}
              </span>
              <h1 className="blog-detail-title">{data?.Title}</h1>
              <span className="blog-detail-date">
                {data?.CreatedDate
                  ? dayjs(data.CreatedDate).format("DD/MM/YYYY")
                  : null}
              </span>
              {htmlParse(data?.Description ?? "")}
              {/* <p className="blog-detail-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
              </p>
              <h2 className="blog-detail-alttitle">
                Lorem ipsum dolor sit amet
              </h2>
              <p className="blog-detail-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
              </p>
              <h2 className="blog-detail-alttitle">
                Lorem ipsum dolor sit amet
              </h2>
              <p className="blog-detail-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
              </p> */}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="right-sidebar">
              {/* <div className="widget">
                <div className="widget-content">
                  <input
                    type="text"
                    className="widget-search-inp"
                    placeholder="Search"
                  />
                </div>
              </div> */}
              <div className="widget">
                <p className="widget-title">Thông tin blog</p>
                <div className="widget-content">
                  <ul className="category-ul">
                    {data?.BlogStats?.map((item) => (
                      <li>Lượt xem: {item.ViewCount}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* <div className="widget">
                <p className="widget-title">Title</p>
                <div className="widget-content"></div>
              </div>
              <div className="widget">
                <p className="widget-title">Title</p>
                <div className="widget-content"></div>
              </div>
              <div className="widget">
                <p className="widget-title">Title</p>
                <div className="widget-content"></div>
              </div>
              <div className="widget">
                <p className="widget-title">Title</p>
                <div className="widget-content"></div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
