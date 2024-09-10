const Currency = require('../models/currencyModel');

// Add a new currency
exports.addCurrency = async (req, res) => {
  const { code, name, symbol } = req.body;

  if (!code) {
    return res.status(404).json({
      status: 'fail',
      message: 'Currency code is required',
    });
  }

  if (!name) {
    return res.status(404).json({
      status: 'fail',
      message: 'Currency name is required',
    });
  }

  if (!symbol) {
    return res.status(404).json({
      status: 'fail',
      message: 'Currency symbol is required',
    });
  }

  try {
    const existingCurrency = await Currency.findOne({ code });
    if (existingCurrency) {
      return res.status(400).json({ message: 'Currency already exists' });
    }

    const currency = new Currency({ code, name, symbol });
    await currency.save();
    res.status(201).json({
      status: 'success',
      data: {
        currency,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.editCurrency = async (req, res) => {
  const { code, name, symbol, status } = req.body;
  const currencyId = req.params.currencyId;

  try {
    const currency = await Currency.findById(currencyId);

    if (!currency) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid currency',
      });
    }

    if (code) {
      currency.code = code;
    }
    if (name) {
      currency.name = name;
    }
    if (symbol) {
      currency.symbol = symbol;
    }
    if (status) {
      currency.status = status;
    }

    const updatedCurrency = await currency.save();

    res.status(200).json({
      status: 'success',
      data: {
        updatedCurrency,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};