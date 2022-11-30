const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-secret' } = process.env;
const NonAuthorisedError = require('../errors/NonAuthorisedError');

const checkAuthorisation = (request, response, next) => {
  const cookie = request.cookies.access_token;

  if (!cookie) {
    throw new NonAuthorisedError('Необходимо авторизоваться.');
  }

  const token = cookie.replace('jwt', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    next(new NonAuthorisedError('Необходимо авторизоваться'));
  }

  request.user = payload;

  next();
};

module.exports = { checkAuthorisation };
