import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import thêm useParams
import { allMovies } from '../data/allMovies'; // Import dữ liệu phim

function MovieDetailPage() {
  
  // 1. Lấy 'id' từ thanh địa chỉ (ví dụ: /movie/4 -> id sẽ là "4")
  const { id } = useParams(); 
  
  // 2. Tạo state để lưu thông tin phim sẽ được tải
  const [movie, setMovie] = useState(null);

  // 3. Tải dữ liệu phim khi component được render
  useEffect(() => {
    // Tìm phim trong 'database' (file allMovies.js)
    // Dùng '==' vì id từ URL là string, id trong data là number
    const foundMovie = allMovies.find(m => m.id == id);
    setMovie(foundMovie);
    
    // Cuộn lên đầu trang mỗi khi vào chi tiết phim
    window.scrollTo(0, 0); 

  }, [id]); // Phụ thuộc vào [id] -> Chạy lại khi id thay đổi

  // 4. Xử lý trường hợp đang tải hoặc không tìm thấy phim
  if (!movie) {
    return (
      <section className="page-section">
        <div className="container text-center">
          <h2>Đang tải...</h2>
        </div>
      </section>
    );
  }

  // 5. Render giao diện với dữ liệu phim đã tìm thấy
  return (
    <section className="page-section">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img 
              className="img-fluid rounded" 
              src={process.env.PUBLIC_URL + movie.posterUrl} 
              alt={movie.title}
            />
          </div>

          <div className="col-md-8">
            <h1 className="display-5 fw-bolder">{movie.title}</h1>
            <div className="fs-5 mb-3">
              <span>{movie.genre}</span>
              <span className="text-muted mx-2">|</span>
              {/* Định dạng lại ngày tháng cho đẹp */}
              <span>Khởi chiếu: {new Date(movie.release_date).toLocaleDateString('vi-VN')}</span>
            </div>
            <p className="lead">{movie.description}</p>
            
            <h4 className="mt-4">Trailer</h4>
            <div className="ratio ratio-16x9">
              <iframe 
                src={movie.trailerUrl}
                title="YouTube video player" 
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* PHẦN LOGIC QUAN TRỌNG NHẤT: HIỂN THỊ NỘI DUNG TÙY TRẠNG THÁI */}
        {/* ========================================================== */}
        
        {/* A. Nếu là PHIM ĐANG CHIẾU -> Hiển thị lịch chiếu */}
        {movie.status === 'now_showing' && (
          <div className="row mt-5">
            <div className="col-12">
              <h2 className="text-uppercase text-center text-primary">Lịch Chiếu</h2>
              <hr />
              <div className="text-center my-4">
                <button className="btn btn-primary">Hôm nay, 09/10</button>
                <button className="btn btn-outline-dark">Ngày mai, 10/10</button>
              </div>
              <div className="cinema-schedule">
                <h4 className="cinema-name">CINEMA HÀ TĨNH</h4>
                <p className="cinema-address text-muted">Số 01, Đường ABC, Phường XYZ</p>
                <div className="showtime-list">
                  <h6 className="mt-3">2D Phụ đề</h6>
                  {/* Chuyển link sang trang chọn ghế */}
                  <Link to="/booking/seats" className="btn btn-outline-dark me-2 mb-2">19:00</Link>
                  <Link to="/booking/seats" className="btn btn-outline-dark me-2 mb-2">20:30</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* B. Nếu là PHIM SẮP CHIẾU -> Hiển thị thông báo ngày ra mắt */}
        {movie.status === 'coming_soon' && (
          <div className="row mt-5 text-center">
            <div className="col-12">
              <h2 className="text-uppercase text-primary">Sắp Khởi Chiếu</h2>
              <h3 className="display-6 fw-bold mt-3">
                Dự kiến ra mắt: {new Date(movie.release_date).toLocaleDateString('vi-VN')}
              </h3>
              <p className="lead text-muted">Phim hiện chưa có lịch chiếu. Hãy quay lại sau nhé!</p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default MovieDetailPage;