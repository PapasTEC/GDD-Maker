const { Router } = require('express');
const router = Router();
const userController = require('../controllers/UserController');

router.get('/get', userController.getUsers);
router.post('/add', userController.createUser);
router.get('/get/:email', userController.getUser);
router.put('/update/:email', userController.updateUser);
router.delete('/delete/:email', userController.deleteUser);
router.put('/sendCode/:email', userController.sendCodeUser);
router.get('/login/:email/:password', userController.loginUser);

module.exports = router;