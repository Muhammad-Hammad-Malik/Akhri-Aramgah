import React from "react";

export default function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark admin-dashboard-navbar mx-3 my-3 rounded-3">
        <div className="container-fluid">
          <a className="navbar-brand text-white ms-3" href="#">
            <i className="fas fa-home"></i> Akhri Aramgah
          </a>
          <button
            className="navbar-toggler text-white"
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
            <ul className="navbar-nav ms-auto me-3">
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fas fa-mobile"></i> Graves
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fas fa-tree"></i> Graveyards
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fas fa-users"></i> Service Providers
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fas fa-chart-line"></i> Analytics
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
