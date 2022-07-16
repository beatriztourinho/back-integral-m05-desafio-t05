const { Router } = require('express')
const router = Router()
const authentication = require('./middlewares/authentication')
const chargesController = require('./controllers/chargesController')
const customersController = require('./controllers/customersController')
const usersController = require('./controllers/usersController')

router.post('/user', usersController.registerUser)
router.post('/login', usersController.loginUser)

router.use(authentication.isValidToken)

router.get('/user', usersController.detailUser)
router.put('/user', usersController.updateUser)

router.post('/customer', customersController.registerCustomer)
router.get('/customer', customersController.listCustomers)
router.get('/customer/:id', customersController.detailCustomer)
router.put('/customer/:id', customersController.updateCustomer)
router.delete('/customer/:id', customersController.deleteCustomer)

router.post('/charge', chargesController.registerCharge)
router.get('/charge', chargesController.listCharges)
router.get('/charge/:id', chargesController.detailCharge)
router.put('/charge/:id', chargesController.updateCharge)
router.delete('/charge/:id', chargesController.deleteCharge)

module.exports = router