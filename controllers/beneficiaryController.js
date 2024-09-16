const Beneficiary = require('../models/beneficiaryModel');

exports.editBeneficiary = async (req, res) => {
  const { beneficiaryId } = req.params;
  if (!beneficiaryId) {
    return res.status(200).json({
      status: 'fail',
      message: 'Beneficiary not found',
    });
  }

  try {
    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) {
      return res.status(200).json({
        status: 'fail',
        message: 'Beneficiary not found',
      });
    }
    const { accountName, bankName, accountNumber } = req.body;

    if (accountName) {
      beneficiary.accountName = accountName;
    }

    if (bankName) {
      beneficiary.bankName = bankName;
    }
    if (accountNumber) {
      beneficiary.accountNumber = accountNumber;
    }

    const update = await beneficiary.save();

    res.status(200).json({
      status: 'success',
      data: {
        update,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteBeneficiary = async (req, res) => {
  const { beneficiaryId } = req.params;

  if (!beneficiaryId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Beneficiary ID is required',
    });
  }

  try {
    // First, find the beneficiary by ID
    const beneficiary = await Beneficiary.findById(beneficiaryId);

    if (!beneficiary) {
      return res.status(404).json({
        status: 'fail',
        message: 'Beneficiary not found',
      });
    }

    // If the beneficiary exists, proceed to delete using deleteOne
    await Beneficiary.deleteOne({ _id: beneficiaryId });

    return res.status(200).json({
      status: 'success',
      message: 'Beneficiary deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.addBeneficiary = async (req, res) => {
  const user = req.user.id;
  const { accountName, bankName, accountNumber } = req.body;

  if (!accountName) {
    return res.status(400).json({
      status: 'fail',
      message: 'Account name is required',
    });
  }
  if (!bankName) {
    return res.status(400).json({
      status: 'fail',
      message: 'bank name is required',
    });
  }
  if (!accountNumber) {
    return res.status(400).json({
      status: 'fail',
      message: 'Account number is required',
    });
  }

  try {
    const verifyBeneficiary = await Beneficiary.findOne({ accountNumber });

    if (verifyBeneficiary) {
      return res.status(200).json({
        status: 'success',
        message: 'Beneficiary already exists',
      });
    }

    const beneficiary = await Beneficiary.create({
      user,
      accountName,
      bankName,
      accountNumber,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        beneficiary,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
