const express = require('express');
const router = express.Router();
const frecuentesController = require('../controllers/frecuentes');


router.get('/ordenados', frecuentesController.clientesOrdenados);

module.exports = router;
