var express = require('express');
var router = express.Router();
var accountController = require('../controllers/index')
const verifyToken = require('./../middleware/authUser')
const { authAdmin } = require('../middleware/authRole')

router.post('/getId', accountController.getId)

router.route('/addnoti')
    .post(accountController.postData)
    .get(accountController.getData)

router.get('/getnotibyuser/:id', verifyToken, accountController.getNotiByUser)

module.exports = router;