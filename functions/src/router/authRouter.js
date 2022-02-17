const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authUtil = require('../middleware/auth');

router.post('/join',  authController.join);
router.post('/login', authController.login);
router.get('/logout', authUtil.checkUserByToken, authController.logout);
router.get('/reissue/token', authController.reissueToken);

router.get('/:social/callback', authController.socialLogin);


module.exports = router;