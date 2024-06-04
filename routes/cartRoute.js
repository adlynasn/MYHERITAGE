const express = require('express');
const { getCart } = require('../controller/cartController');
const router = express.Router();

router.get('/:userId', getCart);

module.exports = router;
