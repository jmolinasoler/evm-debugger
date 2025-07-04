const express = require('express');
const debugController = require('../controllers/debugController');

const router = express.Router();

router.get('/', debugController.showDebugInfo);
router.get('/api/recent-blocks', debugController.getRecentBlocksHtml);

module.exports = router;