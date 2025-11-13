import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer'; // Bạn tự tạo component Footer nhé
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
// import MovieDetailPage from './pages/MovieDetailPage'; // Trang chi tiết
// import SeatSelectionPage from './pages/SeatSelectionPage'; // Trang chọn ghế
// import CheckoutPage from './pages/CheckoutPage'; // Trang thanh toán

// Component Layout chung (có Nav và Footer)
function MainLayout() {
  return (
    <>
      <Navigation />
      <Outlet /> {/* Đây là nơi nội dung trang sẽ được hiển thị */}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tất cả các trang dùng chung Nav/Footer sẽ nằm trong MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movie/:id" element={<MovieDetailPage />} />
          <Route path="booking/seats" element={<SeatSelectionPage />} />
          <Route path="booking/checkout" element={<CheckoutPage />} />
          {/* <Route path="movie/:id" element={<MovieDetailPage />} /> */}
          {/* ... các trang khác ... */}
        </Route>
        
        {/* Các trang không có Nav/Footer (như trang đăng nhập) */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        
        {/* Quy trình đặt vé có thể có layout riêng */}
        {/* <Route path="/booking" element={<BookingLayout />}>
          <Route path="seats" element={<SeatSelectionPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;