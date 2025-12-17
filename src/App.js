import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// --- IMPORT COMPONENTS CHUNG ---
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// --- IMPORT CÁC TRANG (PAGES) NGƯỜI DÙNG ---
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AllNowShowingPage from './pages/AllNowShowingPage';
import AllComingSoonPage from './pages/AllComingSoonPage';
import CinemaDetailPage from './pages/CinemaDetailPage';     // Trang chi tiết Rạp
import PromotionDetailPage from './pages/PromotionDetailPage'; // Trang chi tiết Khuyến mãi
import AdminPromotionsPage from './pages/admin/AdminPromotionsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminShowtimesPage from './pages/admin/AdminShowtimesPage';

// --- IMPORT CÁC TRANG ADMIN (QUẢN TRỊ) ---
import AdminMoviesPage from './pages/admin/AdminMoviesPage';   // Trang quản lý Phim

// --- LAYOUT CHÍNH (Dành cho khách hàng) ---
// Có Menu (Navigation) ở trên và Footer ở dưới
function MainLayout() {
  return (
    <>
      <Navigation />
      <div style={{ minHeight: '80vh' }}> 
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

// --- APP COMPONENT ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* =========================================================
            NHÓM 1: GIAO DIỆN NGƯỜI DÙNG (USER) - DÙNG MAIN LAYOUT
           ========================================================= */}
        <Route path="/" element={<MainLayout />}>
          
          {/* 1. Trang Chủ */}
          <Route index element={<HomePage />} />
          
          {/* 2. Chi tiết phim */}
          <Route path="movie/:id" element={<MovieDetailPage />} />
          
          {/* 3. Quy trình Đặt vé 
              LƯU Ý QUAN TRỌNG: Route tĩnh 'checkout' phải đặt TRƯỚC route động ':showtimeId'
              để tránh lỗi React Router hiểu nhầm 'checkout' là một cái ID.
          */}
          <Route path="booking/checkout" element={<CheckoutPage />} />
          <Route path="booking/:showtimeId" element={<SeatSelectionPage />} />

          {/* 4. Các trang danh sách phim (Xem thêm) */}
          <Route path="movies/now-showing" element={<AllNowShowingPage />} />
          <Route path="movies/coming-soon" element={<AllComingSoonPage />} />

          {/* 5. Trang Chi tiết Rạp (Khi bấm nút Lịch chiếu ở HomePage) */}
          <Route path="cinema/:id" element={<CinemaDetailPage />} />

          {/* 6. Trang Chi tiết Khuyến mãi */}
          <Route path="promotion/:id" element={<PromotionDetailPage />} />

        </Route>
        
        {/* =========================================================
            NHÓM 2: TRANG ĐỘC LẬP (KHÔNG CÓ MENU/FOOTER CHUNG)
           ========================================================= */}
        
        {/* Trang Đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* =========================================================
            NHÓM 3: GIAO DIỆN QUẢN TRỊ (ADMIN)
           ========================================================= */}
        
        {/* Trang Quản lý Phim */}
        <Route path="/admin/movies" element={<AdminMoviesPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/showtimes" element={<AdminShowtimesPage />} />

        {/* Đường dẫn mặc định /admin sẽ trỏ thẳng vào trang quản lý phim luôn */}
        <Route path="/admin" element={<AdminMoviesPage />} />
        <Route path="/admin/promotions" element={<AdminPromotionsPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;