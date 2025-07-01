const express = require('express');
const router = express.Router();
const {
  createMatchReport,
  getMatchReports,
} = require('../controllers/matchReportController');

router.post('/', createMatchReport);
router.get('/', getMatchReports);

module.exports = router;
