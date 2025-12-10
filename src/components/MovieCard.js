import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  // SỬA 1: Dùng movie.movie_id thay vì movie.id
  const detailUrl = `/movie/${movie.movie_id}`; 
  
  // SỬA 2: Dùng movie.poster_url thay vì movie.posterUrl
  // SQL lưu đường dẫn dạng '/assets/img/...', ta ghép thêm PUBLIC_URL để React hiểu
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

export default MovieCard;