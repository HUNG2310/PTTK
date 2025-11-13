// src/components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="footer bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <h5 className="text-uppercase text-primary mb-3">CINEMAS WEB</h5>
            <p><i className="fas fa-map-marker-alt me-2"></i>Số 01, Đường ABC, Phường XYZ, Thành phố Hà Tĩnh, Việt Nam</p>
            <p><i className="fas fa-phone me-2"></i>Hotline: 1900 1234</p>
            <p><i className="fas fa-envelope me-2"></i>Email: support@cinemas.vn</p>
            <p className="small text-white-50">Mã số kinh doanh: 0123456789</p>
          </div>
          <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-3">Về chúng tôi</h5>
            <ul className="list-unstyled">
              <li><a href="#!" className="text-white text-decoration-none">Giới thiệu</a></li>
              <li><a href="#!" className="text-white text-decoration-none">Hệ thống rạp</a></li>
              <li><a href="#!" className="text-white text-decoration-none">Tuyển dụng</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-3">Chăm sóc khách hàng</h5>
            <ul className="list-unstyled">
              <li><a href="#!" className="text-white text-decoration-none">Câu hỏi thường gặp (FAQ)</a></li>
              <li><a href="#!" className="text-white text-decoration-none">Điều khoản sử dụng</a></li>
              <li><a href="#!" className="text-white text-decoration-none">Chính sách bảo mật</a></li>
              <li><a href="#!" className="text-white text-decoration-none">Chính sách thanh toán</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-3">Kết nối với chúng tôi</h5>
            <div>
              <a className="btn btn-outline-light btn-social mx-1" href="#!"><i className="fab fa-youtube"></i></a>
              <a className="btn btn-outline-light btn-social mx-1" href="#!"><i className="fab fa-facebook-f"></i></a>
              <a className="btn btn-outline-light btn-social mx-1" href="#!"><i className="fab fa-instagram"></i></a>
            </div>
            <h5 className="text-uppercase mt-4 mb-3">Tải ứng dụng</h5>
            {/* Lưu ý: Đường dẫn ảnh trong React phải bắt đầu từ /public
              hoặc bạn import chúng vào. Cách đơn giản nhất là dùng /public
            */}
            <a href="#!"><img src={process.env.PUBLIC_URL + "/assets/img/app-store.png"} alt="App Store" height="40" /></a>
            <a href="#!"><img src={process.env.PUBLIC_URL + "/assets/img/google-play.png"} alt="Google Play" height="40" /></a>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-lg-12 text-center small">
            Copyright &copy; Cinemas 2025. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;