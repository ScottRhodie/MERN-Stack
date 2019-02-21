const express = require('express');
const router = express.Router();

// @route   GET api/posts/posts
// @dsc     Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "posts works"
}));

module.exports = router;