const { Router } = require('express');
const router = Router();
const imageController = require('../controllers/ImageController');
const { backendValidation } = require('../controllers/TokenController');



router.post('/:documentId/:imageName', backendValidation, imageController.upload.single('image'), imageController.uploadImage);





router.delete('/delete/:documentId', backendValidation, imageController.deleteFolder);

module.exports = router;