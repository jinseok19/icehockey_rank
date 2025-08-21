const express = require('express');
const router = express.Router();

// 임시 라우트 - 추후 구현
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Stats API - Coming Soon',
        data: []
    });
});

module.exports = router;
