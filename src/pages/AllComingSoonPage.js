// src/pages/AllComingSoonPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ComingSoonMovieCard from '../components/ComingSoonMovieCard'; // Import component tái sử dụng

function AllComingSoonPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(response => response.json())
      .then(data => {
        // Lọc TẤT CẢ phim sắp chiếu
        const comingSoon = data.filter(m => m.status === 'coming_soon');
        setMovies(comingSoon);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lỗi tải phim:', error);
        setLoading(false);
      });
      
      window.scrollTo(0, 0);
  }, []);

  return (
    <section className="page-section bg-light">
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Phim Sắp Khởi Chiếu</h2>
          <h3 className="section-subheading text-muted">Đừng bỏ lỡ những siêu phẩm sắp ra mắt.</h3>
        </div>

        {loading ? (
          <p className="text-center">Đang tải dữ liệu...</p>
        ) : (
          <div className="row">
            {movies.length > 0 ? (
              movies.map(movie => (
                // Tái sử dụng ComingSoonMovieCard
                <ComingSoonMovieCard key={movie.movie_id} movie={movie} />
              ))
            ) : (
              <p className="text-center w-100">Hiện chưa có phim sắp chiếu.</p>
            )}
          </div>
        )}
        
        <div className="text-center mt-5">
            <Link to="/" className="btn btn-dark">Quay lại Trang Chủ</Link>
        </div>
      </div>
    </section>
  );
}

export default AllComingSoonPage;