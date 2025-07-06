const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.post('/match/baseline', matchController.matchBaseline);
router.post('/match/semantic', matchController.matchSemantic);

module.exports = router;
