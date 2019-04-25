"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _servicesCore = require("@makerdao/services-core");

var _OtcOrder = require("./OtcOrder");

var _Currency = require("../../eth/Currency");

var MakerOtcService =
/*#__PURE__*/
function (_PrivateService) {
  (0, _inherits2["default"])(MakerOtcService, _PrivateService);

  function MakerOtcService() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'exchange';
    (0, _classCallCheck2["default"])(this, MakerOtcService);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MakerOtcService).call(this, name, ['cdp', 'smartContract', 'token', 'web3', 'log', 'gas', 'allowance', 'transactionManager']));
  }
  /*
  daiAmount: amount of Dai to sell
  currency: currency to buy
  minFillAmount: minimum amount of token being bought required.  If this can't be met, the trade will fail
  */


  (0, _createClass2["default"])(MakerOtcService, [{
    key: "sellDai",
    value: function () {
      var _sellDai = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(amount, currency) {
        var minFillAmount,
            otcContract,
            daiToken,
            daiAddress,
            buyToken,
            daiAmountEVM,
            minFillAmountEVM,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                minFillAmount = _args.length > 2 && _args[2] !== undefined ? _args[2] : 0;
                otcContract = this.get('smartContract').getContractByName('MAKER_OTC');
                daiToken = this.get('token').getToken(_Currency.DAI);
                daiAddress = daiToken.address();
                buyToken = this.get('token').getToken(currency);
                daiAmountEVM = daiValueForContract(amount);
                minFillAmountEVM = daiValueForContract(minFillAmount);
                _context.next = 9;
                return this.get('allowance').requireAllowance(_Currency.DAI, otcContract.address);

              case 9:
                return _context.abrupt("return", _OtcOrder.OtcSellOrder.build(otcContract, 'sellAllAmount', [daiAddress, daiAmountEVM, buyToken.address(), minFillAmountEVM], this.get('transactionManager'), currency));

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sellDai(_x, _x2) {
        return _sellDai.apply(this, arguments);
      }

      return sellDai;
    }()
    /*
    daiAmount: amount of Dai to buy
    tokenSymbol: symbol of token to sell
    maxFillAmount: If the trade can't be done without selling more than the maxFillAmount of selling token, it will fail
    */

  }, {
    key: "buyDai",
    value: function () {
      var _buyDai = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(amount, tokenSymbol) {
        var maxFillAmount,
            otcContract,
            daiToken,
            daiAddress,
            daiAmountEVM,
            maxFillAmountEVM,
            sellTokenAddress,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                maxFillAmount = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
                otcContract = this.get('smartContract').getContractByName('MAKER_OTC');
                daiToken = this.get('token').getToken(_Currency.DAI);
                daiAddress = daiToken.address();
                daiAmountEVM = daiValueForContract(amount);
                maxFillAmountEVM = daiValueForContract(maxFillAmount);
                sellTokenAddress = this.get('token').getToken(tokenSymbol).address();
                _context2.next = 9;
                return this.get('allowance').requireAllowance(_Currency.WETH, otcContract.address);

              case 9:
                return _context2.abrupt("return", _OtcOrder.OtcBuyOrder.build(otcContract, 'buyAllAmount', [daiAddress, daiAmountEVM, sellTokenAddress, maxFillAmountEVM], this.get('transactionManager')));

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function buyDai(_x3, _x4) {
        return _buyDai.apply(this, arguments);
      }

      return buyDai;
    }()
  }]);
  return MakerOtcService;
}(_servicesCore.PrivateService);

exports["default"] = MakerOtcService;

function daiValueForContract(amount) {
  return (0, _Currency.getCurrency)(amount, _Currency.DAI).toFixed('wei');
}