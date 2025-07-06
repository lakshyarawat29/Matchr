const express = require('express');
const multer = require('multer');
const { parseResume, parseJD } = require('../controllers/parseController');

const upload = multer();
const router = express.Router();

router.post('/parse-resume', upload.single('file'), parseResume);
router.post('/parse-jd', upload.single('file'), parseJD);

module.exports = router;
