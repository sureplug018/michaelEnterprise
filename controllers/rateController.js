const Currency = require('../models/Currency');
const Rate = require('../models/rateModel');

// Add a new exchange rate
exports.addRate = async (req, res) => {
  const { baseCurrencyCode, targetCurrencyCode, rate } = req.body;

  try {
    // Find the base and target currencies
    const baseCurrency = await Currency.findOne({ code: baseCurrencyCode });
    const targetCurrency = await Currency.findOne({ code: targetCurrencyCode });

    if (!baseCurrency || !targetCurrency) {
      return res.status(400).json({
        status: 'fail',
        message: 'One of the currency pairs not found',
      });
    }

    // Create a new exchange rate
    const newRate = new Rate({
      baseCurrency: baseCurrency._id,
      targetCurrency: targetCurrency._id,
      rate: rate,
      date: Date.now(),
    });

    await newRate.save();

    res.status(201).json({
      status: 'success',
      data: {
        newRate,
      },
    });
  } catch (err) {
    console.error('Error adding exchange rate:', err);
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Edit an existing exchange rate
exports.editExchangeRate = async (req, res) => {
  const { baseCurrencyCode, targetCurrencyCode, newRate } = req.body;

  try {
    // Find the base and target currencies
    const baseCurrency = await Currency.findOne({ code: baseCurrencyCode });
    const targetCurrency = await Currency.findOne({ code: targetCurrencyCode });

    if (!baseCurrency || !targetCurrency) {
      return res.status(400).json({
        status: 'fail',
        message: 'One or both currencies not found',
      });
    }

    // Find the existing exchange rate
    let exchangeRate = await Rate.findOne({
      baseCurrency: baseCurrency._id,
      targetCurrency: targetCurrency._id,
    });

    if (!exchangeRate) {
      return res.status(404).json({
        status: 'fail',
        message: 'Exchange rate not found',
      });
    }

    // Update the exchange rate
    exchangeRate.rate = newRate;
    exchangeRate.date = Date.now();
    await exchangeRate.save();

    res.status(200).json({ message: 'Exchange rate updated successfully' });
  } catch (error) {
    console.error('Error editing exchange rate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
