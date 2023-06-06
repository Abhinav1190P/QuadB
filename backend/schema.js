const mongoose = require('mongoose');

const btcinrSchema = new mongoose.Schema({
  base_unit: String,
  quote_unit: String,
  low: String,
  high: String,
  last: String,
  type: String,
  open: String,
  volume: String,
  sell: String,
  buy: String,
  at: Number,
  name: String
});

const BtcInr = mongoose.model('BtcInr', btcinrSchema);

module.exports = {BtcInr};
