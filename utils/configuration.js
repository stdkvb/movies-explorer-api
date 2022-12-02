const {
  JWT_SECRET = 'dev-secret',
  PORT = 3000,
  DB = 'mongodb://localhost:27017/moviesdb',
} = process.env;

module.exports = { JWT_SECRET, PORT, DB };
