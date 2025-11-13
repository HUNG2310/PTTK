// src/pages/CheckoutPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Dùng cho logo ở thanh Nav

function CheckoutPage() {
  return (
    // Sử dụng <div> bọc ngoài cùng với class bg-light (thay cho thẻ <body>)
    <div className="bg-light">

      {/* --- THANH NAV ĐƠN GIẢN --- */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/"><h4>Cinema Web</h4></Link>
        </div>
      </nav>

      {/* --- THANH TIẾN TRÌNH ĐẶT VÉ (BƯỚC 3) --- */}
      <div className="booking-progress-bar">
        <div className="container">
          <div className="row">
            {/* Bước 1: Đã hoàn thành */}
            <div className="step completed">
              <div className="step-content">
                <div className="step-number"><i className="fas fa-check"></i></div>
                <div className="step-label">Chọn Suất</div>
              </div>
            </div>
            {/* Bước 2: Đã hoàn thành */}
            <div className="step completed">
              <div className="step-content">
                <div className="step-number"><i className="fas fa-check"></i></div>
                <div className="step-label">Chọn Ghế</div>
              </div>
            </div>
            {/* Bước 3: Đang hoạt động */}
            <div className="step active">
              <div className="step-content">
                <div className="step-number">3</div>
                <div className="step-label">Thanh Toán</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- NỘI DUNG TRANG THANH TOÁN --- */}
      <div className="container my-5">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Thanh Toán</h2>
          <h3 className="section-subheading text-muted">Hoàn tất đơn hàng của bạn.</h3>
        </div>
        <div className="row">
          
          {/* Cột trái: Form thông tin */}
          <div className="col-lg-7">
            <div className="card">
              <div className="card-body">
                <h5>Thông tin liên hệ</h5>
                <form>
                  <div className="mb-3">
                    {/* Sửa: 'for' -> 'htmlFor' */}
                    <label htmlFor="fullName" className="form-label">Họ và tên</label>
                    {/* Sửa: Thẻ <input> tự đóng */}
                    <input type="text" className="form-control" id="fullName" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Số điện thoại</label>
                    <input type="tel" className="form-control" id="phone" required />
                  </div>
                  
                  {/* Sửa: Thẻ <hr> tự đóng */}
                  <hr /> 

                  <h5>Phương thức thanh toán</h5>
                  <div className="form-check">
                    {/* Sửa: 'checked' -> 'defaultChecked' (để React không báo lỗi) */}
                    <input className="form-check-input" type="radio" name="paymentMethod" id="momo" defaultChecked />
                    <label className="form-check-label" htmlFor="momo">Ví điện tử MoMo</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="paymentMethod" id="creditCard" />
                    <label className="form-check-label" htmlFor="creditCard">Thẻ tín dụng/ghi nợ</label>
                  </div>
                  
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary btn-lg">THANH TOÁN</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="col-lg-5">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Tóm tắt đơn hàng</h5>
              </div>
              <div className="card-body">
                <div className="d-flex mb-3">
                  {/* Sửa: Đường dẫn ảnh và thẻ <img> tự đóng */}
                  <img 
                    src={process.env.PUBLIC_URL + "/assets/img/aven2018063_cover_0.jpg"} 
                    width="80" 
                    className="rounded me-3"
                    alt="Poster phim" 
                  />
                  <div>
                    <h6 className="mb-0">AVENGER 2: ĐẾ CHẾ ULTRON</h6>
                    <small className="text-muted">GEMINI CINEMAS HÀ TĨNH | 09/10/2025 - 19:00</small>
                  </div>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between"><span>Ghế</span><strong>B6, B7</strong></li>
                  <li className="list-group-item d-flex justify-content-between"><span>Số lượng</span><strong>2 vé</strong></li>
                  <li className="list-group-item d-flex justify-content-between"><span>Tạm tính</span><strong>150.000đ</strong></li>
                  <li className="list-group-item d-flex justify-content-between bg-light">
                    <span className="fw-bold">TỔNG CỘNG</span>
                    <strong className="text-primary fs-5">150.000đ</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> // Đóng thẻ div .bg-light
  );
}

export default CheckoutPage;