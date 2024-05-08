import { createFileRoute } from "@tanstack/react-router";
import { OptionalString } from "@utils/ZodUtils";
import { publicRoute } from "@utils/trpc";
import { useState } from "react";
import { z } from "zod";
import { PostItem } from "../-components/PostItem";
import { TypePost } from "@sunrise-backend/src/schemas/Post.schema";

export const Route = createFileRoute("/_client/posts/")({
  validateSearch: z.object({
    keyword: OptionalString,
  }),
  component: () => {
    const navigate = Route.useNavigate();
    const { keyword } = Route.useSearch();
    const [word, setWord] = useState<string | undefined>(keyword);

    const [{ data }] = publicRoute.searchPosts.useSuspenseQuery({
      keyword: keyword ?? "",
    });

    return (
      <section className="post">
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
                            to: "/posts",
                            search: {
                              keyword: word,
                            },
                          });
                        }}
                        type="text"
                        className="inp-search"
                        placeholder="Nhập thông tin cần tìm.."
                      />
                      <button
                        className="btn-search m-2"
                        onClick={() =>
                          navigate({
                            to: "/posts",
                            search: {
                              keyword: word,
                            },
                          })
                        }
                      >
                        Tìm kiếm
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
                <PostItem key={item.Id} data={item as TypePost} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
});
