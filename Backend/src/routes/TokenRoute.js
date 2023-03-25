const { Router } = require('express');
const router = Router();

const tokenController = require('../controllers/TokenController');
// Endpoint para generar un token JWT
router.post('/generate-token', tokenController.generateTokenController);

// Endpoint para decodificar un token JWT
router.post('/decode-token', tokenController.decodeTokenController);

// Endpoint para verificar un token JWT
router.post('/verify-token', tokenController.verifyTokenController);

module.exports = router;