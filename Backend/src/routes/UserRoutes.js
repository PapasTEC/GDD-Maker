const { Router } = require('express');
const router = Router();
const userController = require('../controllers/UserController');
const { backendValidation } = require('../controllers/TokenController');

router.get('/get', backendValidation, userController.getUsers);
router.post('/add', userController.createUser);
router.get('/get/:email', backendValidation, userController.getUser);
router.put('/update/:email', backendValidation, userController.updateUser);
router.delete('/delete/:email', backendValidation, userController.deleteUser);
router.put('/addOwnProject/:email', backendValidation, userController.addOwnProject);
router.put('/addSharedProject/:email', backendValidation, userController.addSharedProject);
router.put('/deleteOwnProject/:email', backendValidation, userController.deleteOwnProject);
router.put('/deleteSharedProject/:email', backendValidation, userController.deleteSharedProject);
router.put('/sendCode/:email', userController.sendCodeUser);
router.get('/login/:email/:password', userController.loginUser);
router.get('/check/:email', userController.checkUser);
module.exports = router;