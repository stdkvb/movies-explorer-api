const router = require('express').Router();
const { createUser, login, logout } = require('../controllers/users');
const { createUserValidation, loginValidation } = require('../middlewares/validation');

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);
router.post('/signout', logout);

module.exports = router;
