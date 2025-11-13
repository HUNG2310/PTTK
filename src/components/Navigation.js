import React from 'react';

import { HashLink as Link } from 'react-router-hash-link';

function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
      <div className="container">
        <Link className="navbar-brand" to="/#page-top"><h4>Cinema Web</h4></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          Menu
          <i className="fas fa-bars ms-1"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
            <li className="nav-item"><Link smooth className="nav-link" to="/#now-showing">Phim Đang Chiếu</Link></li>
            <li className="nav-item"><Link smooth className="nav-link" to="/#coming-soon">Phim Sắp Chiếu</Link></li>
            <li className="nav-item"><Link smooth className="nav-link" to="/#promotions">Khuyến Mãi</Link></li>
            <li className="nav-item"><Link smooth className="nav-link" to="/#theaters">Hệ Thống Rạp</Link></li>
            {/* <li className="nav-item"><Link className="btn btn-primary" to="/login">Đăng Nhập</Link></li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;