"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USD_WETH = exports.USD_PETH = exports.USD_MKR = exports.USD_ETH = exports.USD_DAI = exports.USD = exports.WETH = exports.PETH = exports.MKR = exports.ETH = exports.DAI = exports.getCurrency = exports.currencies = void 0;

var _lodash = _interopRequireDefault(require("lodash.values"));

var _currency = require("@makerdao/currency");

var tokens = {
  DAI: 'DAI',
  MKR: 'MKR',
  WETH: 'WETH',
  PETH: 'PETH',
  ETH: 'ETH'
};
var currencies = (0, _lodash["default"])(tokens).reduce(function (output, symbol) {
  output[symbol] = (0, _currency.createCurrency)(symbol);
  return output;
}, {
  USD: (0, _currency.createCurrency)('USD')
});
exports.currencies = currencies;
var getCurrency = (0, _currency.createGetCurrency)(currencies); // we export both the currencies object and the individual currencies because
// the latter is convenient when you know what you want to use, and the former
// is convenient when you are picking a currency based on a symbol from input

exports.getCurrency = getCurrency;
var DAI = currencies.DAI;
exports.DAI = DAI;
var ETH = currencies.ETH;
exports.ETH = ETH;
var MKR = currencies.MKR;
exports.MKR = MKR;
var PETH = currencies.PETH;
exports.PETH = PETH;
var WETH = currencies.WETH;
exports.WETH = WETH;
var USD = currencies.USD;
exports.USD = USD;
var USD_DAI = (0, _currency.createCurrencyRatio)(USD, DAI);
exports.USD_DAI = USD_DAI;
var USD_ETH = (0, _currency.createCurrencyRatio)(USD, ETH);
exports.USD_ETH = USD_ETH;
var USD_MKR = (0, _currency.createCurrencyRatio)(USD, MKR);
exports.USD_MKR = USD_MKR;
var USD_PETH = (0, _currency.createCurrencyRatio)(USD, PETH);
exports.USD_PETH = USD_PETH;
var USD_WETH = (0, _currency.createCurrencyRatio)(USD, WETH);
exports.USD_WETH = USD_WETH;
Object.assign(currencies, {
  USD_DAI: USD_DAI,
  USD_ETH: USD_ETH,
  USD_MKR: USD_MKR,
  USD_PETH: USD_PETH,
  USD_WETH: USD_WETH
});