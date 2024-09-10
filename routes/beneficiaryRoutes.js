const express = require('express');
const authController = require('../controllers/authController');
const beneficiaryController = require('../controllers/beneficiaryController');

const router = express.Router();

router.use(authController.protect);

router.post('/create-beneficiary', beneficiaryController.addBeneficiary);

router.patch('/edit-beneficiary', beneficiaryController.editBeneficiary);

router.delete('/delete-beneficiary', beneficiaryController.deleteBeneficiary);

module.exports = router;
