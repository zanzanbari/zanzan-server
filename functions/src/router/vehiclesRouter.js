const express = require('express');
const vehiclesController = require('../controller/vehiclesController');
const router = express.Router();

router.get('/directions', vehiclesController.getDirections);

module.exports = router;