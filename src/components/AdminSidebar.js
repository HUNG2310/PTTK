import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook lấy đường dẫn hiện tại để tô màu active

  // Hàm xử lý đăng xuất an toàn
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang Quản trị?")) {
      localStorage.removeItem('currentUser');
      navigate('/login');
    }
  };

  // Hàm kiểm tra đường dẫn để gán class Active (Màu vàng, chữ đen)
  const getNavLinkClass = (path) => {
    return location.pathname === path 
      ? "nav-link active bg-warning text-dark fw-bold shadow" 
      : "nav-link text-white hover-effect"; 
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark border-end border-secondary" style={{width: '280px', minHeight: '100vh', position: 'sticky', top: 0}}>
      
      {/* HEADER SIDEBAR */}
      <Link to="/admin/movies" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <i className="fas fa-user-shield fa-2x text-warning me-3"></i>
        <span className="fs-4 fw-bold text-uppercase">Admin Panel</span>
      </Link>
      
      <hr className="border-secondary" />
      
      {/* DANH SÁCH MENU */}
      <ul className="nav nav-pills flex-column mb-auto">
        
        {/* 1. Quản lý Phim */}
        <li className="nav-item mb-2">
          <Link to="/admin/movies" className={getNavLinkClass("/admin/movies")}>
            <i className="fas fa-film me-3" style={{width: '20px', textAlign: 'center'}}></i>
            Quản Lý Phim
          </Link>
        </li>

        {/* 2. Quản lý Ưu đãi */}
        <li className="nav-item mb-2">
          <Link to="/admin/promotions" className={getNavLinkClass("/admin/promotions")}>
            <i className="fas fa-tags me-3" style={{width: '20px', textAlign: 'center'}}></i>
            Quản Lý Ưu Đãi
          </Link>
        </li>

        {/* 3. Quản lý Lịch chiếu (Placeholder - Để dành làm sau) */}
        <li className="nav-item mb-2">
          <Link to="/admin/showtimes" className={getNavLinkClass("/admin/showtimes")}>
            <i className="far fa-clock me-3" style={{width: '20px', textAlign: 'center'}}></i>
            Quản Lý Lịch Chiếu
          </Link>
        </li>

        {/* 4. Quản lý Người dùng (Placeholder - Để dành làm sau) */}
        <li className="nav-item mb-2">
          <Link to="/admin/users" className={getNavLinkClass("/admin/users")}>
            <i className="fas fa-users me-3" style={{width: '20px', textAlign: 'center'}}></i>
            Quản Lý Người Dùng
          </Link>
        </li>

      </ul>
      
      <hr className="border-secondary" />
      
      {/* FOOTER SIDEBAR (Thông tin Admin & Logout) */}
      <div className="dropdown">
        <div className="d-flex align-items-center text-white text-decoration-none mb-3">
            <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center me-2" style={{width: 32, height: 32}}>
                <i className="fas fa-user"></i>
            </div>
            <strong>Administrator</strong>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-danger w-100">
            <i className="fas fa-sign-out-alt me-2"></i> Đăng Xuất
        </button>
      </div>

    </div>
  );
}

export default AdminSidebar;