// src/pages/AllNowShowingPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Giữ nguyên dòng này
import MovieCard from '../components/MovieCard';

function AllNowShowingPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(response => response.json())
      .then(data => {
        const nowShowing = data.filter(m => m.status === 'now_showing');
        setMovies(nowShowing);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lỗi:', error);
        setLoading(false);
      });
      window.scrollTo(0, 0);
  }, []);

  return (
    <section className="page-section" style={{marginTop: '5rem'}}>
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Phim Đang Chiếu</h2>
        </div>
        
        {loading ? <p className="text-center">Đang tải...</p> : (
          <div className="row">
            {movies.length > 0 ? (
              movies.map(movie => <MovieCard key={movie.movie_id} movie={movie} />)
            ) : (
              <p className="text-center w-100">Không có dữ liệu phim.</p>
            )}
          </div>
        )}

        {/* --- THÊM ĐOẠN NÀY ĐỂ DÙNG <Link> VÀ CÓ NÚT QUAY LẠI --- */}
        <div className="text-center mt-5">
            <Link to="/" className="btn btn-dark">Quay lại Trang Chủ</Link>
        </div>
        
      </div>
    </section>
  );
}

export default AllNowShowingPage;