import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {

  const detailUrl = `/movie/${movie.id}`; 
  const imageUrl = process.env.PUBLIC_URL + movie.posterUrl;

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