const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRouter'));
router.use('/vehicles', require('./vehiclesRouter'));

module.exports = router;