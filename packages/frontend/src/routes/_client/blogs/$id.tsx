import { publicRoute } from "@utils/trpc";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import htmlParse from "html-react-parser";
import ImageGallery from "react-image-gallery";
import { LoadingOverlay } from "@mantine/core";

export const Route = createFileRoute("/_client/blogs/$id")({
  wrapInSuspense: true,
  pendingComponent: () => (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 2 }}
    />
  ),
  component: () => {
    const { id } = Route.useParams();

    const [{ data }] = publicRoute.getBlogById.useSuspenseQuery({ id });

    return (
      <div className="container mt-4 mb-4">
        <div className="row">
          <div className="col-lg-8">
            <div className="blog-detail">
              {/* <img
                className="w-100"
                src={data?.BlogImage?.[0]?.Path ?? "/images/product1.jpeg"}
                alt="product"
              /> */}
              <ImageGallery
                flickThreshold={0.5}
                slideDuration={0}
                items={
                  (data?.BlogImage?.length as number) > 0
                    ? data?.BlogImage?.map((item) => ({
                        original: item.Path ?? "/images/product1.jpeg",
                        thumbnail: item.Path ?? "/images/product1.jpeg",
                      })) ?? []
                    : [
                        {
                          original: "/images/product1.jpeg",
                          thumbnail: "/images/product1.jpeg",
                        },
                        {
                          original: "/images/product1.jpeg",
                          thumbnail: "/images/product1.jpeg",
                        },
                        {
                          original: "/images/product1.jpeg",
                          thumbnail: "/images/product1.jpeg",
                        },
                      ]
                }
                showNav={false}
                showFullscreenButton={false}
                showPlayButton={false}
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
                    {/* {data?.BlogStats?.map((item) => (
                      <li>Lượt xem: {item?.ViewCount ?? 0}</li>
                    ))} */}
                    <li>Đăng bởi: {data?.Auth0Profile?.name}</li>
                    <li>Lượt xem: {data?.BlogStat?.ViewCount ?? 0}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
