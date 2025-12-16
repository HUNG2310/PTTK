import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import các component con
import MovieCard from '../components/MovieCard';
import ComingSoonMovieCard from '../components/ComingSoonMovieCard';

// Import CSS tùy chỉnh
import '../css/custom-styles.css'; 

// --- DỮ LIỆU BANNER MẪU (Dùng link online) ---
const BANNERS = [
  {
    id: 1,
    image: "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    title: "AVATAR 3: LỬA VÀ TRO TÀN",
    subtitle: "Siêu phẩm 3D vĩ đại nhất mọi thời đại"
  },
  {
    id: 2,
    image: "https://image.tmdb.org/t/p/original/nDxJJyA5giRhXx96q1sWbOUjMBI.jpg",
    title: "SHAZAM: CƠN THỊNH NỘ CỦA CÁC VỊ THẦN!",
    subtitle: "Trận chiến kinh thiên động địa sắp bắt đầu"
  },
  {
    id: 3,
    image: "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    title: "DEADPOOL & WOLVERINE",
    subtitle: "Cặp đôi hoàn cảnh cứu vũ trụ Marvel"
  }
];

function HomePage() {
  // --- STATE ---
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]); 
  const [promotions, setPromotions] = useState([]); 
  const [loading, setLoading] = useState(true);

  // State cho Banner Slider
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // --- 1. GỌI API LẤY DỮ LIỆU ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesRes = await fetch('http://localhost:5000/api/movies');
        const moviesData = await moviesRes.json();
        
        // Giữ nguyên logic cũ: Lấy 4 phim để hiển thị Grid
        setNowShowingMovies(moviesData.filter(m => m.status === 'now_showing').slice(0, 4));
        setComingSoonMovies(moviesData.filter(m => m.status === 'coming_soon').slice(0, 4));

        const cinemasRes = await fetch('http://localhost:5000/api/cinemas');
        const cinemasData = await cinemasRes.json();
        setCinemas(cinemasData);

        const promosRes = await fetch('http://localhost:5000/api/promotions');
        const promosData = await promosRes.json();
        setPromotions(promosData);

        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. LOGIC TỰ ĐỘNG CHUYỂN BANNER (3s) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % BANNERS.length);
    }, 4000); // 4 giây đổi 1 lần cho người dùng kịp đọc

    return () => clearInterval(interval);
  }, []);

  // Hàm chuyển banner khi bấm nút chấm tròn
  const handleDotClick = (index) => {
    setCurrentBannerIndex(index);
  };

  // --- 3. RENDER GIAO DIỆN ---
  return (
    <>
      {/* === PHẦN 1: BANNER SLIDER (ĐÃ SỬA) === */}
      {/* Thay thế class masthead cũ bằng Slider mới */}
      <header className="masthead-slider">
        {BANNERS.map((banner, index) => (
          <div 
            key={banner.id} 
            className={`banner-item ${index === currentBannerIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <div className="banner-overlay"></div>
            <div className="container banner-content">
              <div className="masthead-subheading text-warning fade-in-anim">{banner.subtitle}</div>
              <div className="masthead-heading text-uppercase text-white fade-in-anim" style={{fontSize: '3.5rem', textShadow: '2px 2px 8px #000'}}>
                  {banner.title}
              </div>
              <Link className="btn btn-primary btn-xl text-uppercase shadow-lg mt-4 fade-in-anim" to="/movies/now-showing">
                 Đặt Vé Ngay
              </Link>
            </div>
          </div>
        ))}

        {/* Nút chấm tròn điều hướng */}
        <div className="banner-dots">
            {BANNERS.map((_, index) => (
                <div 
                    key={index} 
                    className={`dot ${index === currentBannerIndex ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
                ></div>
            ))}
        </div>
      </header>
      
      {/* === PHẦN 2: PHIM ĐANG CHIẾU (GIỮ NGUYÊN GRID) === */}
      <section className="page-section bg-dark-section" id="now-showing">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-heading text-uppercase text-warning">Phim Đang Chiếu</h2>
            <h3 className="section-subheading text-white-50">Đừng bỏ lỡ những siêu phẩm đang gây bão tại rạp.</h3>
          </div>
          
          {loading ? (
            <div className="text-center text-white"><div className="spinner-border text-warning" role="status"></div></div>
          ) : (
            <div className="row">
              {nowShowingMovies.map(movie => (
                <MovieCard key={movie.movie_id} movie={movie} />
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/movies/now-showing" className="btn btn-outline-light btn-lg text-uppercase px-5 rounded-pill">
              Xem Tất Cả Phim <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* === PHẦN 3: PHIM SẮP CHIẾU (GIỮ NGUYÊN GRID) === */}
      <section className="page-section bg-light-section" id="coming-soon">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-heading text-uppercase text-warning">Sắp Khởi Chiếu</h2>
            <h3 className="section-subheading text-muted">Chờ đón những bom tấn sắp ra mắt.</h3>
          </div>
          
          <div className="row">
            {comingSoonMovies.map(movie => (
              <ComingSoonMovieCard key={movie.movie_id} movie={movie} />
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/movies/coming-soon" className="btn btn-outline-warning btn-lg text-uppercase px-5 rounded-pill">
              Xem Lịch Sắp Chiếu <i className="far fa-calendar-alt ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* === PHẦN 4: HỆ THỐNG RẠP === */}
      <section className="page-section bg-dark-section" id="theaters">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-heading text-uppercase text-warning">Hệ Thống Rạp</h2>
            <h3 className="section-subheading text-white-50">Không gian hiện đại, trải nghiệm tối đa.</h3>
          </div>
          
          <div className="row">
            {cinemas.map((cinema, index) => {
                // --- 1. LOGIC ẢNH (Giữ nguyên) ---
                const isEven = index % 2 === 0;
                const imageSrc = isEven 
                    ? process.env.PUBLIC_URL + "/assets/img/cinema-1.png" 
                    : process.env.PUBLIC_URL + "/assets/img/imax.png";

                // --- 2. LOGIC BẢN ĐỒ (MỚI THÊM) ---
                // Nếu là rạp chẵn (Hà Tĩnh) -> Link Google Maps Hà Tĩnh
                // Nếu là rạp lẻ (Vinh) -> Link Google Maps Vinh
                const mapLink = isEven
                    ? "https://www.google.com/maps/search/?api=1&query=Vincom+Plaza+Ha+Tinh" // Link mẫu Hà Tĩnh
                    : "https://www.google.com/maps/search/?api=1&query=Lotte+Cinema+Vinh";   // Link mẫu Vinh

                return (
                  <div className="col-lg-6 mb-4" key={cinema.cinema_id}>
                    <div className="card h-100 text-white bg-dark border-0 shadow-lg overflow-hidden cinema-card-hover" style={{borderRadius: '10px'}}> 
                      <div className="row g-0 h-100">
                        {/* CỘT ẢNH */}
                        <div className="col-md-5 position-relative">
                          <img 
                            src={imageSrc}
                            className="img-fluid h-100 w-100" 
                            alt={cinema.name} 
                            style={{ objectFit: 'cover', minHeight: '220px', backgroundColor: isEven ? 'transparent' : '#000' }}
                          />
                          {isEven && (
                              <div className="position-absolute bottom-0 start-0 p-3 text-white" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', width: '100%'}}>
                              </div>
                          )}
                        </div>

                        {/* CỘT THÔNG TIN */}
                        <div className="col-md-7">
                          <div className="card-body d-flex flex-column justify-content-center h-100 p-4">
                            <h5 className="card-title text-warning mb-2 fw-bold text-uppercase" style={{fontSize: '1.1rem'}}>{cinema.name}</h5>
                            <p className="card-text mb-2 text-white-50 small" style={{fontSize: '0.85rem'}}>
                                <i className="fas fa-map-marker-alt me-2 text-danger"></i>{cinema.address}
                            </p>
                            <p className="card-text mb-4 text-white-50 small">
                                <i className="fas fa-phone me-2 text-success"></i>1900 1234
                            </p>
                            
                            <div className="d-flex gap-2 mt-auto">
                                <Link to={`/cinema/${cinema.cinema_id}`} className="btn btn-warning flex-grow-1 fw-bold text-dark shadow-sm">
                                    LỊCH CHIẾU
                                </Link>
                                
                                {/* 👉 NÚT BẢN ĐỒ ĐÃ ĐƯỢC CẬP NHẬT */}
                                <a 
                                    href={mapLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-outline-light" 
                                    style={{minWidth: '80px'}}
                                >
                                    <i className="fas fa-map-marked-alt me-1"></i> Bản đồ
                                </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </section>

      {/* === PHẦN 5: KHUYẾN MÃI === */}
      <section className="page-section bg-dark-section" id="promotions">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-heading text-uppercase text-warning">Ưu Đãi Đặc Biệt</h2>
            <h3 className="section-subheading text-muted" style={{fontStyle: 'italic'}}>Săn deal hời, xem phim thả ga.</h3>
          </div>
          
          <div className="row">
            {promotions.map(promo => (
              <div className="col-md-6 col-lg-4 mb-5" key={promo.promotion_id}>
                {/* Card thiết kế giống hình: Nền tối, bo góc */}
                <div className="card h-100 bg-dark border-0 shadow-lg" style={{borderRadius: '10px', overflow: 'hidden'}}>
                  
                  {/* Phần Ảnh */}
                  <div className="position-relative">
                      <img 
                        // Kiểm tra nếu là link online (http) thì dùng luôn, nếu là file cục bộ thì thêm process.env
                        src={promo.image_url.startsWith('http') ? promo.image_url : process.env.PUBLIC_URL + promo.image_url} 
                        className="card-img-top" 
                        alt={promo.title} 
                        style={{height: '220px', objectFit: 'cover'}}
                      />
                      {/* Badge HOT màu đỏ */}
                      <div className="badge bg-danger position-absolute top-0 end-0 m-3 px-3 py-2 shadow" style={{fontSize: '0.9rem'}}>HOT</div>
                  </div>
                  
                  {/* Phần Nội Dung */}
                  <div className="card-body d-flex flex-column p-4 text-center">
                    {/* Tiêu đề viết hoa, màu trắng */}
                    <h5 className="card-title text-white mb-3 fw-bold text-uppercase" style={{minHeight: '48px', fontSize: '1.1rem'}}>
                        {promo.title}
                    </h5>
                    
                    {/* Thời gian: màu xám */}
                    <p className="card-text text-white-50 small mb-3">
                        {new Date(promo.start_date).toLocaleDateString('vi-VN')} - {new Date(promo.end_date).toLocaleDateString('vi-VN')}
                    </p>

                    {/* Mô tả ngắn */}
                    <p className="card-text text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                        {promo.description.length > 80 ? promo.description.substring(0, 80) + "..." : promo.description}
                    </p>
                    
                    {/* Nút bấm: Viền vàng, bo tròn (rounded-pill) */}
                    <Link 
                        to={`/promotion/${promo.promotion_id}`} 
                        className="btn btn-outline-warning w-100 mt-3 rounded-pill py-2"
                        style={{borderWidth: '1px'}}
                    >
                        Chi Tiết Ưu Đãi
                    </Link>
                  </div>
                </div>
              </div>
            ))}
             {promotions.length === 0 && !loading && <p className="text-center text-white">Đang cập nhật khuyến mãi...</p>}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;