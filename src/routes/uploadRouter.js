//
// uploadRouter.js
// 

const express = require('express');
const router = express.Router();

const { postUploadData } = require('../controllers/uploadController');

router.post('/upload', postUploadData);

module.exports = router;
