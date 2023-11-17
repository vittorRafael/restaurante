const express = require('express');
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const checkLogin = require('../middlewares/checkLogin');
const router = express.Router();

router.post('/login', loginController.login);
router.post('/usuarios', userController.newUser);

router.use(checkLogin);

router.get('/usuarios', userController.getUser);
router.put('/usuarios', userController.updateUser);
router.delete('/usuarios', userController.removeUser);

module.exports = router;
