const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');


router.post('/register', vendorController.createVendor);
router.post('/login', vendorController.loginVendor);


module.exports = router;