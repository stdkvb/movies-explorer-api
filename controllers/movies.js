const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovie = (request, response, next) => {
  Movie.find({})
    .then((movies) => response.send(movies))
    .catch(next);
};

const createMovie = (request, response, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = request.params;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: request.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => response.send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании фильма'));
      } else {
        next(error);
      }
    });
};

const deleteMovie = (request, response, next) => {
  const { movieId } = request.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Переданы некорректные данные при удалении фильма.');
      } else if (request.user._id.toString() !== movie.owner.toString()) {
        throw new ForbiddenError('Нет прав на удаление фильма.');
      } else {
        return movie.remove()
          .then(() => response.send({ message: 'Фильм удален.' }));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Фильм с указанным _id не найден.'));
      }
      next(error);
    });
};

module.exports = { getMovie, createMovie, deleteMovie };
