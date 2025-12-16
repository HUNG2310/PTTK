import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../css/custom-styles.css'; // Đảm bảo import CSS

function MovieDetailPage() {
  const { id } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API lấy thông tin phim
        const movieRes = await fetch(`http://localhost:5000/api/movies/${id}`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        // Gọi API lấy lịch chiếu
        const showRes = await fetch(`http://localhost:5000/api/movies/${id}/showtimes`);
        const showData = await showRes.json();
        setShowtimes(showData);

        setLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]); 

  if (loading) return <div className="text-center text-white mt-5 pt-5">Đang tải dữ liệu...</div>;
  if (!movie) return <div className="text-center text-white mt-5 pt-5">Không tìm thấy phim.</div>;

  return (
    // 👉 SỬA LẠI: Dùng bg-dark-section thay vì bg-light để chữ trắng hiện rõ trên nền tối
    <section className="page-section bg-dark-section" style={{paddingTop: '8rem', paddingBottom: '5rem', minHeight: '100vh'}}>
      <div className="container">
        <div className="row">
          {/* Cột Trái: Poster */}
          <div className="col-md-4 mb-4">
            <img 
              className="img-fluid rounded shadow-lg border border-warning" 
              src={process.env.PUBLIC_URL + movie.poster_url} 
              alt={movie.title}
              style={{width: '100%'}}
            />
          </div>

          {/* Cột Phải: Thông tin phim */}
          <div className="col-md-8 text-white">
            <h1 className="display-4 fw-bold text-uppercase text-warning mb-3">{movie.title}</h1>
            
            <div className="fs-5 mb-4 text-white-50">
              <span className="badge bg-warning text-dark me-2">{movie.genre}</span>
              <span className="me-2">|</span>
              <span><i className="far fa-clock me-1"></i> {movie.duration_minutes} phút</span>
              <span className="mx-2">|</span>
              <span>Khởi chiếu: {new Date(movie.release_date).toLocaleDateString('vi-VN')}</span>
            </div>
            
            <p className="lead text-light">{movie.description}</p>
            
            {/* Trailer */}
            {movie.trailer_url && (
                <div className="mt-4 mb-5">
                    <h4 className="text-warning border-bottom border-secondary pb-2 mb-3">Trailer</h4>
                    <div className="ratio ratio-16x9 shadow">
                        <iframe 
                            src={movie.trailer_url.replace("watch?v=", "embed/")}
                            title="Trailer" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* --- PHẦN LỊCH CHIẾU --- */}
            {movie.status === 'now_showing' && (
              <div className="card bg-dark border border-secondary shadow-lg">
                  <div className="card-header border-secondary text-center py-3">
                      <h4 className="m-0 text-uppercase text-warning">Lịch Chiếu Phim</h4>
                  </div>
                  <div className="card-body p-4">
                      {showtimes.length === 0 ? (
                          <p className="text-center text-muted">Chưa có lịch chiếu nào được cập nhật.</p>
                      ) : (
                          <div>
                              <h5 className="text-white mb-3">
                                  <i className="fas fa-map-marker-alt text-danger me-2"></i>
                                  {showtimes[0].cinema_name || "RẠP TRUNG TÂM"}
                              </h5>
                              
                              <div className="d-flex flex-wrap gap-3">
                                  {showtimes.map(st => (
                                      <Link 
                                          key={st.showtime_id}
                                          to={`/booking/${st.showtime_id}`} 
                                          className="btn btn-outline-warning px-4 py-2 text-center"
                                          style={{minWidth: '100px'}}
                                      >
                                          <div className="fw-bold fs-5">
                                              {new Date(st.start_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                                          </div>
                                          <div className="small text-white-50">
                                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(st.price)}
                                          </div>
                                      </Link>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
            )}

            {/* --- PHẦN SẮP CHIẾU --- */}
            {movie.status === 'coming_soon' && (
                <div className="alert alert-dark border-warning text-center" role="alert">
                    <h3 className="text-warning">Sắp Khởi Chiếu</h3>
                    <p className="lead">Hẹn gặp lại bạn vào ngày {new Date(movie.release_date).toLocaleDateString('vi-VN')}</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MovieDetailPage;