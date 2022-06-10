import React from "react";
import { Link } from "react-router-dom";
import Message from "./Message";

function Navbar({ user, logout }) {
  const token = localStorage.getItem("token");
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg fixed-top py-2">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Saraha
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              {user && token ? (
                <>
                  <li className="nav-item px-2">
                    <Link to="/" className="nav-link rounded-3">
                      My Message
                    </Link>
                  </li>
                  <li className="nav-item px-2">
                    <Link to="profile" className="nav-link rounded-3">
                      My profile
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="login" onClick={logout} className="nav-link">
                      Log out
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item px-2">
                    <Link to="register" className="nav-link rounded-3">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item px-2">
                    <Link to="login" className="nav-link rounded-3">
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
