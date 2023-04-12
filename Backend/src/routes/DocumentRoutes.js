const { Router } = require('express');
const router = Router();
const documentController = require('../controllers/DocumentController');
const { backendValidation } = require('../controllers/TokenController');

router.get('/get', backendValidation, documentController.getDocuments);
router.post('/add', backendValidation, documentController.createDocument);
router.get('/get/:id', backendValidation, documentController.getDocument);
router.get('/getInfo/:id', backendValidation, documentController.getDocumentInfo);
router.put('/update/:id', backendValidation, documentController.updateDocument);
router.delete('/delete/:id', backendValidation, documentController.deleteDocument);
router.get('/getInfoByOwner/:owner', backendValidation, documentController.getDocumentsByOwner);
router.post('/getInfoShared', backendValidation, documentController.getSharedDocuments);
router.put('/updateOwner/:owner', backendValidation, documentController.updateOwnerInDocuments);
router.put('/updateOnlySubSectionByIds/:id/:sectionId/:subSectionId', backendValidation, documentController.updateOnlySubSectionByIds);
router.put('/updateOnlySubSectionByTitles/:id/:sectionTitle/:subSectionTitle', backendValidation, documentController.updateOnlySubSectionByTitles);

module.exports = router;