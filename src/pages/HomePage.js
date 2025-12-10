// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import các component con
import MovieCard from '../components/MovieCard';
import ComingSoonMovieCard from '../components/ComingSoonMovieCard';

function HomePage() {
  // --- 1. KHAI BÁO STATE ---
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  
  // 👉 THÊM VÀO: State để chứa dữ liệu Rạp và Khuyến mãi
  const [cinemas, setCinemas] = useState([]); 
  const [promotions, setPromotions] = useState([]); 
  
  const [loading, setLoading] = useState(true);

  // --- 2. GỌI API (USE EFFECT) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A. Gọi API lấy danh sách PHIM
        const moviesRes = await fetch('http://localhost:5000/api/movies');
        const moviesData = await moviesRes.json();
        
        setNowShowingMovies(moviesData.filter(m => m.status === 'now_showing').slice(0, 3));
        setComingSoonMovies(moviesData.filter(m => m.status === 'coming_soon').slice(0, 3));

        // 👉 THÊM VÀO: Gọi API lấy danh sách RẠP
        const cinemasRes = await fetch('http://localhost:5000/api/cinemas');
        const cinemasData = await cinemasRes.json();
        setCinemas(cinemasData);

        // 👉 THÊM VÀO: Gọi API lấy danh sách KHUYẾN MÃI
        const promosRes = await fetch('http://localhost:5000/api/promotions');
        const promosData = await promosRes.json();
        setPromotions(promosData);

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 3. RENDER GIAO DIỆN ---
  return (
    <>
      <header className="masthead">
        <div className="container">
          <div className="masthead-subheading">Xem phim yêu thích của bạn</div>
          <div className="masthead-heading text-uppercase">Đặt Vé Ngay</div>
        </div>
      </header>
      
      {/* --- PHIM ĐANG CHIẾU --- */}
      <section className="page-section" id="now-showing">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Phim Đang Chiếu</h2>
            <h3 className="section-subheading text-muted">Chọn phim và đặt vé ngay hôm nay.</h3>
          </div>
          
          {loading ? <p className="text-center">Đang tải...</p> : (
            <div className="row text-center">
              {nowShowingMovies.map(movie => (
                <MovieCard key={movie.movie_id} movie={movie} />
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/movies/now-showing" className="btn btn-primary btn-xl text-uppercase">
              Xem Thêm Phim Đang Chiếu
            </Link>
          </div>
        </div>
      </section>

      {/* --- PHIM SẮP CHIẾU --- */}
      <section className="page-section bg-light" id="coming-soon">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Phim Sắp Chiếu</h2>
            <h3 className="section-subheading text-muted">Những bom tấn không thể bỏ lỡ sắp ra mắt.</h3>
          </div>
          
          {loading ? <p className="text-center">Đang tải...</p> : (
            <div className="row">
              {comingSoonMovies.map(movie => (
                <ComingSoonMovieCard key={movie.movie_id} movie={movie} />
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/movies/coming-soon" className="btn btn-primary btn-xl text-uppercase">
              Xem Thêm Phim Sắp Chiếu
            </Link>
          </div>
        </div>
      </section>

      {/* --- HỆ THỐNG RẠP (Đã sửa để dùng dữ liệu thật) --- */}
      <section className="page-section bg-light" id="theaters">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Hệ Thống Rạp</h2>
            <h3 className="section-subheading text-muted">Tìm rạp chiếu gần bạn nhất.</h3>
          </div>
          <div className="row">
            {/* 👉 SỬA: Dùng vòng lặp cinemas.map */}
            {cinemas.map((cinema, index) => (
              <div className="col-md-6 mb-4" key={cinema.cinema_id}>
                <div className="card h-100">
                  <div className="row g-0">
                    <div className="col-lg-5">
                      <img 
                        src={process.env.PUBLIC_URL + (index % 2 === 0 ? "/assets/img/cinema-1.png" : "/assets/img/imax.png")} 
                        className="img-fluid rounded-start" 
                        alt={cinema.name} 
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-lg-7">
                      <div className="card-body">
                        <h5 className="card-title text-primary">{cinema.name}</h5>
                        <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i>{cinema.address}</p>
                        <p className="card-text"><i className="fas fa-phone me-2"></i>1900 1234</p>
                        <Link to={`/schedule/${cinema.cinema_id}`} className="btn btn-primary mt-2">Xem lịch chiếu</Link>
                        <a href="#" className="btn btn-outline-dark mt-2 ms-2"><i className="fas fa-map-marked-alt me-2"></i>Chỉ đường</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- KHUYẾN MÃI (Đã sửa để dùng dữ liệu thật) --- */}
      <section className="page-section" id="promotions">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Khuyến Mãi</h2>
            <h3 className="section-subheading text-muted">Luôn có ưu đãi dành cho bạn.</h3>
          </div>
          <div className="row">
            {/* 👉 SỬA: Dùng vòng lặp promotions.map */}
            {promotions.map(promo => (
              <div className="col-md-6 col-lg-4 mb-5" key={promo.promotion_id}>
                <div className="card h-100 promotion-card">
                  <img 
                    src={process.env.PUBLIC_URL + promo.image_url} 
                    className="card-img-top" 
                    alt={promo.title} 
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-primary">{promo.title}</h5>
                    <p className="card-text text-muted">
                        <i className="far fa-calendar-alt me-2"></i>
                        Áp dụng: {new Date(promo.start_date).toLocaleDateString('vi-VN')} - {new Date(promo.end_date).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="card-text text-truncate">{promo.description}</p>
                    <Link to={`/promotion/${promo.promotion_id}`} className="btn btn-primary mt-auto">Xem chi tiết</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;