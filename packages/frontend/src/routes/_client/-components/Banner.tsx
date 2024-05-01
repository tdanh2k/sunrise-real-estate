import { Link, useNavigate } from "@tanstack/react-router";
import { ChangeEventHandler, useEffect, useState } from "react";

export const Banner = () => {
  const navigate = useNavigate({ from: "/" });
  const [search, setSearch] = useState<string[]>([]);
  const [find, setFind] = useState<string[]>([]);
  const [word, setWord] = useState<string>("");
  useEffect(() => {
    setSearch(["a", "b", "test", "mb"]);
  }, []);
  const findSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setWord(e.target.value);
    // const filteredCountries = search?.filter((item) =>
    //   item.indexOf(e.target.value) > -1 ? item : null
    // );
    // e.target.value.length === 0 ? setFind([]) : setFind(filteredCountries);
  };
  // const findResult = () => {
  //   if (find.length === 0 && word.length > 0) {
  //     return <div className="find-search">Not Found</div>;
  //   }
  //   if (find.length > 0) {
  //     return (
  //       <div className="find-search">
  //         {find.map((item) => {
  //           return (
  //             <Link key={item} to="/">
  //               {item}
  //             </Link>
  //           );
  //         })}
  //       </div>
  //     );
  //   }
  // };
  return (
    <div
      className="banner d-flex align-items-center"
      style={{ backgroundImage: `url(images/banner.jpg)` }}
    >
      <div className="bg-custom">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto">
              <div className="banner-area text-center pt-4 pb-4">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                <h2 className="mt-2 mb-4 banner-title">
                  <strong> Lorem Ipsum Dolor</strong>{" "}
                </h2>
                <div className="search-area">
                  <input
                    value={word}
                    onChange={(e) => findSearch(e)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;

                      navigate({
                        to: "/search",
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
                        to: "/search",
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
  );
};
