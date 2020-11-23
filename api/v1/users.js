/* required packages */
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

/* get all */
router.post('/all', userController.getAll)

/* get one */
router.post('/getOne/:id', userController.getOne)

/* update one */
router.patch('/update/:id', userController.updateOne)

/* change password */
router.post('/change-password/:id', userController.changePassword)



/* export routes */
module.exports = router;