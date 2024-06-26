import { BlogItem } from "../-components/BlogItem";
import { createFileRoute } from "@tanstack/react-router";
import { publicRoute } from "@utils/trpc";
import { TypeBlog } from "@sunrise-backend/src/schemas/Blog.schema";
import { OptionalString } from "@utils/ZodUtils";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/_client/blogs/")({
  validateSearch: z.object({
    keyword: OptionalString.catch(""),
  }),
  component: () => {
    const navigate = Route.useNavigate();
    const { keyword } = Route.useSearch();
    const [word, setWord] = useState<string | undefined>(keyword);

    const [{ data }] = publicRoute.searchBlogs.useSuspenseQuery({
      keyword: keyword ?? "",
    });
    return (
      <section className="blog">
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
                      <strong>Tìm kiếm blog</strong>{" "}
                    </h2>
                    <div className="search-area">
                      <input
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        onKeyDown={(event) => {
                          if (event.key !== "Enter") return;

                          navigate({
                            to: "/blogs",
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
                            to: "/blogs",
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
        <div className="page-content">
          <div className="container">
            <div className="row">
              {data?.map((item) => (
                <BlogItem key={item.Id} data={item as TypeBlog} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
});
