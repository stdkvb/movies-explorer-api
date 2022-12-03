const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-secret' } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const NonAuthorisedError = require('../errors/NonAuthorisedError');
const ConflictError = require('../errors/ConflictError');

const getUser = (request, response, next) => {
  User.findById(request.user._id)
    .then((user) => response.send(user))
    .catch(next);
};

const createUser = (request, response, next) => {
  const {
    name, email, password,
  } = request.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then(() => response.status(201).send({
          name,
          email,
        }))
        .catch((error) => {
          if (error.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует.'));
          } else if (error.name === 'ValidationError') {
            next(new BadRequestError('Некорректные данные при создании пользователяю'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

const updateUser = (request, response, next) => {
  const { email, name } = request.body;
  User.findByIdAndUpdate(request.user._id, { email, name }, { runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет такого пользователя в базе.');
      }
      response.send({
        _id: user._id,
        name,
        email,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при обновлении пользователя.'));
      } else if (error.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else {
        next(error);
      }
    });
};

const login = (request, response, next) => {
  const { email, password } = request.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NonAuthorisedError('Невереный email или пароль.');
      }
      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            throw new NonAuthorisedError('Невереный email или пароль.');
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          response.cookie('jwt', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          });
          return response.send({ message: 'Аутентификация выполнена', token });
        });
    })
    .catch(next);
};

const logout = (request, response) => {
  response.clearCookie('jwt', {
    httpOnly: true,
    sameSite: true,
  }).send({
    message: 'Выход из системы',
  });
};

module.exports = {
  getUser, createUser, updateUser, login, logout,
};
