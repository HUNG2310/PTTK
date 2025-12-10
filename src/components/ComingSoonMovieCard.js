// src/components/ComingSoonMovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';

function ComingSoonMovieCard({ movie }) {
  // Lấy ID và URL ảnh từ dữ liệu SQL
  const detailUrl = `/movie/${movie.movie_id}`;
  const imageUrl = process.env.PUBLIC_URL + movie.poster_url;

  // Format ngày tháng (VD: 2025-12-25)
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

export default ComingSoonMovieCard;