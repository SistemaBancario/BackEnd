const express = require('express');
const { realizarTransferencia } = require('../controllers/transferencia');

const router = express.Router();

// Ruta para realizar una transferencia
router.post('/transferencia', realizarTransferencia);

module.exports = router;
