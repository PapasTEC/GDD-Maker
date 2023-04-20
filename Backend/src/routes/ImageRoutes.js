const { Router } = require('express');
const router = Router();
const imageController = require('../controllers/ImageController');
const { backendValidation } = require('../controllers/TokenController');
// const upload = require('../middleware/upload');

// Ruta para cargar una imagen
router.post('/:documentId', backendValidation, imageController.upload.single('image'), imageController.uploadImage);

// Ruta para eliminar una imagen
// router.delete('/:documentId/:fileName', backendValidation, imageController.deleteImage);

// Ruta para eliminar una carpeta
router.delete('/delete/:documentId', backendValidation, imageController.deleteFolder);

module.exports = router;