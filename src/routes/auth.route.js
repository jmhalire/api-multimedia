const { Router } = require('express');
const { signUp, signIn, getUser, updateUser } = require('../controllers/user');
const { authenticate } = require('../controllers/passport');

const router = Router();

router.post('/signup', signUp);

router.post('/signin', signIn);

router.get('/user/date', authenticate, getUser);

router.post('/user/update', authenticate, updateUser)



module.exports = router;