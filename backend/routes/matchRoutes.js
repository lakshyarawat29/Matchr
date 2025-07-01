const express = require('express');
const router = express.Router();
const { baselineMatch } = require('../controllers/matchController');

router.post('/baseline', baselineMatch);

module.exports = router;
