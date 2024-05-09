import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "@tanstack/react-router";
import { FC } from "react";

export const Header: FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <div className="header">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <div className="d-flex align-items-center">
                <i className="fas fa-home"></i>
                <span className="ms-2">Sunrise</span>
              </div>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Trang chủ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/blogs">
                    Blog
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/posts">
                    Bài đăng nhà
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    Giới thiệu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">
                    Liên hệ
                  </Link>
                </li>
                {isAuthenticated ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Hello, {user?.nickname ?? user?.family_name ?? user?.name} <i className="fas fa-chevron-down"></i>
                    </Link>
                    <ul className="sub-ul">
                      <li>
                        <Link to="/management">Trang cá nhân</Link>
                      </li>
                      <li>
                        <button
                          className="nav-link logout"
                          onClick={() => {
                            window.localStorage.clear();
                            logout({ logoutParams: { federated: true } });
                          }}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => loginWithRedirect()}
                    >
                      Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
