const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/join',  authController.join);
router.post('/login', );
router.get('/logout', );

module.exports = router;