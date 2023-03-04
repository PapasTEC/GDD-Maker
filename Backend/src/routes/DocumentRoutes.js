const { Router } = require('express');
const router = Router();
const documentController = require('../controllers/DocumentController');

router.get('/get', documentController.getDocuments);
router.post('/add', documentController.createDocument);
router.get('/get/:id', documentController.getDocument);
router.get('/getInfo/:id', documentController.getDocumentInfo);
router.put('/update/:id', documentController.updateDocument);
router.delete('/delete/:id', documentController.deleteDocument);

module.exports = router;