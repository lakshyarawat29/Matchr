const express = require('express');
const router = express.Router();
const { createJD, getJDs } = require('../controllers/jdController');

router.post('/', createJD);
router.get('/', getJDs);

module.exports = router;
