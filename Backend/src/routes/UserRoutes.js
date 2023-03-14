const { Router } = require('express');
const router = Router();
const userController = require('../controllers/UserController');

router.get('/get', userController.getUsers);
router.post('/add', userController.createUser);
router.get('/get/:email', userController.getUser);
router.get('/check/:email', userController.checkUser);
router.put('/update/:email', userController.updateUser);
router.delete('/delete/:email', userController.deleteUser);
router.put('/sendCode/:email', userController.sendCodeUser);
router.get('/login/:email/:password', userController.loginUser);
router.put('/addOwnProject/:email', userController.addOwnProject);
router.put('/addSharedProject/:email', userController.addSharedProject);
router.put('/deleteOwnProject/:email', userController.deleteOwnProject);
router.put('/deleteSharedProject/:email', userController.deleteSharedProject);

module.exports = router;