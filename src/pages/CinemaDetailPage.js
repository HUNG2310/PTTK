import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/custom-styles.css';

function CinemaDetailPage() {
  const { id } = useParams();
  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/cinemas/${id}`)
      .then(res => res.json())
      .then(data => {
        setCinema(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="text-white text-center mt-5 pt-5">Đang tải...</div>;
  if (!cinema) return <div className="text-white text-center mt-5 pt-5">Không tìm thấy rạp.</div>;

  return (
    <div className="bg-dark-section" style={{minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px'}}>
      <div className="container">
        {/* HEADER RẠP */}
        <div className="text-center mb-5">
            <h1 className="text-warning text-uppercase fw-bold">{cinema.name}</h1>
            <p className="text-white-50"><i className="fas fa-map-marker-alt me-2 text-danger"></i>{cinema.address}</p>
        </div>

        {/* DANH SÁCH PHIM */}
        <div className="row">
            <h3 className="text-white border-start border-4 border-warning ps-3 mb-4">PHIM ĐANG CHIẾU</h3>
            {cinema.movies && cinema.movies.length > 0 ? (
                cinema.movies.map(movie => (
                    <div className="col-md-6 mb-4" key={movie.movie_id}>
                        <div className="card bg-dark border border-secondary shadow h-100">
                            <div className="row g-0">
                                <div className="col-4">
                                    <img src={process.env.PUBLIC_URL + movie.poster_url} className="img-fluid rounded-start h-100" style={{objectFit: 'cover'}} alt={movie.title} />
                                </div>
                                <div className="col-8">
                                    <div className="card-body text-white">
                                        <h5 className="card-title text-warning fw-bold">{movie.title}</h5>
                                        <p className="small text-muted mb-1">{movie.genre} | {movie.duration_minutes} phút</p>
                                        <div className="mt-3">
                                            {/* Nút bấm chuyển sang trang chi tiết phim để xem giờ chiếu cụ thể */}
                                            <Link to={`/movie/${movie.movie_id}`} className="btn btn-warning btn-sm fw-bold">
                                                XEM SUẤT CHIẾU
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-white-50">Hiện chưa có lịch chiếu tại rạp này.</p>
            )}
        </div>
      </div>
    </div>
  );
}

export default CinemaDetailPage;