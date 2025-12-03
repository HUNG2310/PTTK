import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- COMPONENT THẺ PHIM ĐANG CHIẾU (Dùng dữ liệu từ SQL) ---
function MovieCard({ movie }) {
  // SQL trả về 'movie_id', không phải 'id'
  const detailUrl = `/movie/${movie.movie_id}`; 
  // SQL trả về 'poster_url'
  const imageUrl = process.env.PUBLIC_URL + movie.poster_url;

  return (
    <div className="col-md-4 col-sm-6 mb-4">
      <div className="movie-card">
        <Link to={detailUrl}>
          <img className="img-fluid" src={imageUrl} alt={movie.title} />
        </Link>
        <div className="movie-caption">
          <h4 className="my-3">{movie.title}</h4>
          <p className="text-muted">{movie.genre}</p>
          <Link className="btn btn-primary" to={detailUrl}>Mua Vé</Link>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT THẺ PHIM SẮP CHIẾU (Dùng dữ liệu từ SQL) ---
function ComingSoonMovieCard({ movie }) {
  const detailUrl = `/movie/${movie.movie_id}`;
  const imageUrl = process.env.PUBLIC_URL + movie.poster_url;

  // Format ngày từ SQL (VD: 2025-12-25T00:00:00.000Z) sang dd/mm/yyyy
  const formattedDate = new Date(movie.release_date).toLocaleDateString('vi-VN');

  return (
    <div className="col-lg-4 col-sm-6 mb-4">
      <div className="movie-card-coming-soon">
        <div className="poster-wrapper">
          <Link to={detailUrl}>
            <img className="img-fluid" src={imageUrl} alt={movie.title} />
          </Link>
          <div className="release-date-badge">
            <i className="far fa-calendar-alt me-1"></i>
            Dự kiến {formattedDate}
          </div>
        </div>
        <div className="movie-caption">
          <h4 className="my-3">{movie.title}</h4>
          <p className="text-muted">{movie.genre}</p>
          <Link className="btn btn-secondary" to={detailUrl}>Xem Chi Tiết</Link>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
    // Gọi API từ Backend Node.js
    fetch('http://localhost:5000/api/movies')
      .then(response => response.json())
      .then(data => {
        // 1. Lọc phim ĐANG CHIẾU (status trong SQL là 'now_showing')
        const nowShowing = data
          .filter(m => m.status === 'now_showing')
          .slice(0, 3); // Lấy 3 phim đầu
        setNowShowingMovies(nowShowing);

        // 2. Lọc phim SẮP CHIẾU (status trong SQL là 'coming_soon')
        const comingSoon = data
          .filter(m => m.status === 'coming_soon')
          .slice(0, 3); // Lấy 3 phim đầu
        setComingSoonMovies(comingSoon);
        
        setLoading(false); // Tắt loading
      })
      .catch(error => {
        console.error('Lỗi kết nối API:', error);
        setLoading(false);
      });
  }, []);

  return (
    <> 
      {/* --- Masthead (Giữ nguyên) --- */}
      <header className="masthead">
        <div className="container">
          <div className="masthead-subheading">Xem phim yêu thích của bạn</div>
          <div className="masthead-heading text-uppercase">Đặt Vé Ngay</div>
        </div>
      </header>
      
      {/* --- Phim Đang Chiếu (Đã kết nối Database) --- */}
      <section className="page-section" id="now-showing">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Phim Đang Chiếu</h2>
            <h3 className="section-subheading text-muted">Chọn phim và đặt vé ngay hôm nay.</h3>
          </div>
          
          {loading ? (
            <p className="text-center">Đang tải dữ liệu từ máy chủ...</p>
          ) : (
            <div className="row text-center">
              {nowShowingMovies.length > 0 ? (
                nowShowingMovies.map(movie => (
                  <MovieCard key={movie.movie_id} movie={movie} />
                ))
              ) : (
                <p>Chưa có phim đang chiếu.</p>
              )}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/movies/now-showing" className="btn btn-primary btn-xl text-uppercase">
              Xem Thêm Phim Đang Chiếu
            </Link>
          </div>
        </div>
      </section>

      {/* --- Phim Sắp Chiếu (Đã kết nối Database) --- */}
      <section className="page-section bg-light" id="coming-soon">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Phim Sắp Chiếu</h2>
            <h3 className="section-subheading text-muted">Những bom tấn không thể bỏ lỡ sắp ra mắt.</h3>
          </div>
          
          {loading ? (
            <p className="text-center">Đang tải dữ liệu...</p>
          ) : (
            <div className="row">
              {comingSoonMovies.length > 0 ? (
                comingSoonMovies.map(movie => (
                  <ComingSoonMovieCard key={movie.movie_id} movie={movie} />
                ))
              ) : (
                <p className="text-center w-100">Chưa có phim sắp chiếu.</p>
              )}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/movies/coming-soon" className="btn btn-primary btn-xl text-uppercase">
              Xem Thêm Phim Sắp Chiếu
            </Link>
          </div>
        </div>
      </section>

      {/* --- Hệ Thống Rạp (Giữ nguyên tĩnh) --- */}
      <section className="page-section bg-light" id="theaters">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Hệ Thống Rạp</h2>
            <h3 className="section-subheading text-muted">Tìm rạp chiếu gần bạn nhất.</h3>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="row g-0">
                  <div className="col-lg-5">
                    <img src={process.env.PUBLIC_URL + "/assets/img/cinema-1.png"} className="img-fluid rounded-start" alt="Cinema Hà Tĩnh" />
                  </div>
                  <div className="col-lg-7">
                    <div className="card-body">
                      <h5 className="card-title text-primary">CINEMA HÀ TĨNH</h5>
                      <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i>Số 01, Đường ABC, Phường XYZ, Thành phố Hà Tĩnh</p>
                      <p className="card-text"><i className="fas fa-phone me-2"></i>1900 1234</p>
                      <p className="card-text"><small className="text-muted">Gồm 5 phòng chiếu hiện đại</small></p>
                      <Link to="/schedule/1" className="btn btn-primary mt-2">Xem lịch chiếu</Link>
                      <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn-outline-dark mt-2"><i className="fas fa-map-marked-alt me-2"></i>Chỉ đường</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="row g-0">
                  <div className="col-lg-5">
                    <img src={process.env.PUBLIC_URL + "/assets/img/imax.png"} className="img-fluid rounded-start" alt="Cinema Vinh" />
                  </div>
                  <div className="col-lg-7">
                    <div className="card-body">
                      <h5 className="card-title text-primary">CINEMA VINH</h5>
                      <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i>Số 10, Đường DEF, Thành phố Vinh, Nghệ An</p>
                      <p className="card-text"><i className="fas fa-phone me-2"></i>1900 5678</p>
                      <p className="card-text"><small className="text-muted">Gồm 6 phòng chiếu, có phòng IMAX</small></p>
                      <Link to="/schedule/2" className="btn btn-primary mt-2">Xem lịch chiếu</Link>
                      <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn-outline-dark mt-2"><i className="fas fa-map-marked-alt me-2"></i>Chỉ đường</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Khuyến Mãi (Giữ nguyên tĩnh) --- */}
      <section className="page-section" id="promotions">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Các chương trình đặc biệt</h2>
            <h3 className="section-subheading text-muted">Luôn có ưu đãi dành cho bạn.</h3>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="card h-100 promotion-card">
                <img src={process.env.PUBLIC_URL + "/assets/img/discount-1.png"} className="card-img-top" alt="Thứ hai vui vẻ" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">THỨ HAI VUI VẺ - ĐỒNG GIÁ VÉ 2D</h5>
                  <p className="card-text text-muted"><i className="far fa-calendar-alt me-2"></i>Áp dụng: 01/10/2025 - 31/12/2025</p>
                  <p className="card-text">Tận hưởng ngày thứ hai hàng tuần với giá vé 2D siêu ưu đãi chỉ từ 60.000đ...</p>
                  <Link to="/promotion/1" className="btn btn-primary mt-auto">Xem chi tiết</Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="card h-100 promotion-card">
                <img src={process.env.PUBLIC_URL + "/assets/img/discount-2.png"} className="card-img-top" alt="Combo bắp nước" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">COMBO SIÊU TO - GIÁ SIÊU NHỎ</h5>
                  <p className="card-text text-muted"><i className="far fa-calendar-alt me-2"></i>Áp dụng: 01/11/2025 - 30/11/2025</p>
                  <p className="card-text">Nhận ngay một ly nhân vật phiên bản giới hạn khi mua combo bắp nước lớn...</p>
                  <Link to="/promotion/2" className="btn btn-primary mt-auto">Xem chi tiết</Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="card h-100 promotion-card">
                <img src={process.env.PUBLIC_URL + "/assets/img/discount-3.png"} className="card-img-top" alt="Quà tặng thành viên" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">QUÀ TẶNG THÀNH VIÊN THÂN THIẾT</h5>
                  <p className="card-text text-muted"><i className="far fa-calendar-alt me-2"></i>Áp dụng: Cả năm</p>
                  <p className="card-text">Tích điểm đổi quà, nhận ưu đãi sinh nhật và hàng ngàn quà tặng hấp dẫn...</p>
                  <Link to="/promotion/3" className="btn btn-primary mt-auto">Xem chi tiết</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;