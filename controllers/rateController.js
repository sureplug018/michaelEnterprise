const Currency = require('../models/currencyModel');
const Rate = require('../models/rateModel');

// Add a new exchange rate
exports.addRate = async (req, res) => {
  const { baseCurrencyCode, targetCurrencyCode, rate, visibleRate, direction } =
    req.body;

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
      rate,
      visibleRate,
      direction,
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
  const { newRate, visibleRate, direction } = req.body;

  const rateId = req.params.rateId;

  try {
    const rate = await Rate.findById(rateId);

    if (!rate) {
      return res.status(404).json({
        status: 'fail',
        message: 'Rate not found',
      });
    }

    if (newRate) {
      rate.rate = newRate;
    }

    if (visibleRate) {
      rate.visibleRate = visibleRate;
    }

    if (direction) {
      rate.direction = direction;
    }

    await rate.save();

    res.status(200).json({
      status: 'success',
      data: {
        rate,
      },
    });
  } catch (error) {
    console.error('Error editing exchange rate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get exchange rate for a specific currency pair
exports.getExchangeRate = async (req, res) => {
  const { base, target } = req.query;

  if (!base) {
    return res.status(404).json({
      status: 'fail',
      message: 'Base currency not found',
    });
  }

  if (!target) {
    return res.status(404).json({
      status: 'fail',
      message: 'Target currency not found',
    });
  }

  try {
    const baseCurrency = await Currency.findOne({ code: base });
    const targetCurrency = await Currency.findOne({ code: target });

    if (!baseCurrency || !targetCurrency) {
      return res.status(404).json({
        status: 'fail',
        message: 'Currency not found',
      });
    }

    const exchangeRate = await Rate.findOne({
      baseCurrency: baseCurrency._id,
      targetCurrency: targetCurrency._id,
    });

    if (exchangeRate) {
      if (exchangeRate.direction === 'forward') {
        return res.status(200).json({
          status: 'success',
          rate: exchangeRate.rate,
          visibleRate: `1 ${base} = ${exchangeRate.visibleRate} ${target}`,
        });
      }

      if (exchangeRate.direction === 'reverse') {
        return res.status(200).json({
          status: 'success',
          rate: exchangeRate.rate,
          visibleRate: `${exchangeRate.visibleRate} ${base} = 1 ${target}`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Error fetching exchange rate',
    });
  }
};
