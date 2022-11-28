const router = require('express').Router();
const {
  getUser, updateUser, getCurrentUser,
} = require('../controllers/users');
// const { updateUserValidation, updateAvatarValidation, userIdValidation } = require('../middlewares/validation');

router.get('/me', getUser);
router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
