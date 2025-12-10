// src/components/Navigation.js
import React, { useState, useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { useNavigate, useLocation } from 'react-router-dom'; // <--- 1. Import useLocation

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation(); // <--- 2. Khởi tạo hook lấy địa chỉ hiện tại
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra localStorage mỗi khi component tải HOẶC khi chuyển trang
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(storedUser); // Cập nhật state (nếu null thì là chưa đăng nhập, có dữ liệu là đã đăng nhập)
  }, [location]); // <--- 3. Thêm [location] vào đây để code chạy lại mỗi khi chuyển trang

  const handleLogout = () => {
    // Xóa thông tin user
    localStorage.removeItem('currentUser');
    setUser(null);
    // Chuyển về trang login hoặc trang chủ
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
      <div className="container">
        <Link className="navbar-brand" to="/#page-top"><h4>Cinema Web</h4></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          Menu
          <i className="fas fa-bars ms-1"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0 align-items-center">
            <li className="nav-item"><Link smooth className="nav-link" to="/#now-showing">Phim Đang Chiếu</Link></li>
            <li className="nav-item"><Link smooth className="nav-link" to="/#coming-soon">Phim Sắp Chiếu</Link></li>
            <li className="nav-item"><Link smooth className="nav-link" to="/#theaters">Hệ Thống Rạp</Link></li>
            <li className="nav-item"><Link smooth className="nav-link" to="/#promotions">Khuyến Mãi</Link></li>
            
            {/* --- LOGIC HIỂN THỊ NÚT ĐĂNG NHẬP / ĐĂNG XUẤT --- */}
            {user ? (
              // NẾU ĐÃ ĐĂNG NHẬP -> Hiện tên và nút Đăng xuất
              <li className="nav-item dropdown ms-lg-3">
                 {/* Dùng thẻ div thay vì a href="#" để tránh lỗi nhảy trang */}
                <div className="d-flex align-items-center">
                    <span className="text-white me-3 fw-bold">Xin chào, {user.name}</span>
                    <button 
                        className="btn btn-danger btn-sm text-uppercase" 
                        onClick={handleLogout}
                    >
                        Đăng Xuất
                    </button>
                </div>
              </li>
            ) : (
              // NẾU CHƯA ĐĂNG NHẬP -> Hiện nút Đăng Nhập
              <li className="nav-item ms-lg-3">
                <button 
                  className="btn btn-primary fw-bold text-uppercase px-4" 
                  onClick={() => navigate('/login')}
                >
                  Đăng Nhập
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;