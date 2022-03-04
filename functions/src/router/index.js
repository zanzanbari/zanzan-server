const express = require('express');
const router = express.Router();
const authUtil = require('../middleware/auth');

router.use('/auth', require('./authRouter'));
router.use(authUtil.checkUserByToken);
router.use('/vehicles', require('./vehiclesRouter'));

module.exports = router;