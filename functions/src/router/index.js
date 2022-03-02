const express = require('express');
const authUtil = require('../middleware/auth');
const router = express.Router();

router.use('/auth', require('./authRouter'));
router.use(authUtil.checkUserByToken);
router.use('/vehicles', require('./vehiclesRouter'));

module.exports = router;