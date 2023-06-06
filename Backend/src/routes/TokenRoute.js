const { Router } = require('express');
const router = Router();
const { backendValidation } = require('../controllers/TokenController');

const tokenController = require('../controllers/TokenController');

router.post('/generate-token', tokenController.generateTokenController);


router.post('/decode-token', backendValidation, tokenController.decodeTokenController);


router.post('/verify-token', tokenController.verifyTokenController);

module.exports = router;