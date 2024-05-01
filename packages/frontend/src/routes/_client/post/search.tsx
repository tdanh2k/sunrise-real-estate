import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { OptionalString } from "@utils/ZodUtils";
import { publicRoute } from "@utils/trpc";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/_client/post/search")({
  validateSearch: (search) =>
    z
      .object({
        keyword: OptionalString,
      })
      .parse(search),
  component: () => {
    const navigate = Route.useNavigate();
    const { keyword } = Route.useSearch();
    const [word, setWord] = useState<string | undefined>(keyword);

    const { data: searchResponse, isFetching: isSearchFetching } =
      publicRoute.searchPosts.useQuery(
        { keyword: keyword ?? "" },
        { enabled: Boolean(keyword) }
      );

    return (
      <>
        <div
          className="banner d-flex align-items-center"
          style={{ backgroundImage: `url(images/banner.jpg)` }}
        >
          <div className="bg-custom">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 mx-auto">
                  <div className="banner-area text-center pt-4 pb-4">
                    <h2 className="mt-2 mb-4 banner-title">
                      <strong>Tìm kiếm bài đăng nhà</strong>{" "}
                    </h2>
                    <div className="search-area">
                      <input
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        onKeyDown={(event) => {
                          if (event.key !== "Enter") return;

                          navigate({
                            to: "/post/search",
                            search: {
                              keyword: word,
                            },
                          });
                        }}
                        type="text"
                        className="inp-search"
                        placeholder="Search"
                      />
                      <button
                        className="btn-search m-2"
                        onClick={() =>
                          navigate({
                            to: "/post/search",
                            search: {
                              keyword: word,
                            },
                          })
                        }
                      >
                        Search All
                      </button>
                    </div>
                    {/* {findResult()} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="section-all-re">
          <div className="container">
            {searchResponse?.data?.map((item) => (
              <div
                key={item.Id}
                className="text-center col-lg-4 col-12 col-md-6 "
              >
                <div className="item">
                  <div className="item-image">
                    <img
                      className="img-fluid"
                      src={item?.PostImage?.[0]?.Path}
                      alt="flat"
                    />
                  </div>
                  <div className="item-description">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="item-title">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit
                      </span>
                      <span className="item-price">{item?.Price}</span>
                    </div>
                    <div className="item-icon d-flex alig-items-center justify-content-between">
                      <div>
                        <i className="fas fa-check-circle"></i>{" "}
                        <span>Lorem ipsum dolor</span>
                      </div>
                      <div>
                        <i className="fas fa-check-circle"></i>{" "}
                        <span> Lorem </span>
                      </div>
                      <Link
                        to={`/post/$id`}
                        params={{ id: item?.Id ?? "" }}
                        className="item-title"
                      >
                        <button className="btn btn-detail">Xem</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  },
});
