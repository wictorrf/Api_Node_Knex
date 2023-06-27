const express = require("express")
const app = express();
const router = express.Router();
const UsersController = require("../controllers/UsersController");
const AdminAuth = require("../midleware/AdminAuth");

router.get('/users', UsersController.selectAll);
router.get('/user/:id', UsersController.selectOne);
router.post('/user', UsersController.create);
router.put('/user',AdminAuth, UsersController.update);
router.delete('/user/:id',AdminAuth, UsersController.delete);
router.post('/recoverpassword', UsersController.recoverPassword);
router.post('/changepassword', UsersController.changePassword);
router.post('/login', UsersController.login);
router.post('/validate',AdminAuth, UsersController.validate);

module.exports = router;