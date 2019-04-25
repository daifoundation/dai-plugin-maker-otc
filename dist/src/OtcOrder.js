"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OtcSellOrder = exports.OtcBuyOrder = exports["default"] = void 0;

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ethers = require("ethers");

var _Currency = require("./Currency");

var OtcOrder =
/*#__PURE__*/
function () {
  function OtcOrder() {
    (0, _classCallCheck2["default"])(this, OtcOrder);
  }

  (0, _createClass2["default"])(OtcOrder, [{
    key: "fillAmount",
    value: function fillAmount() {
      return this._fillAmount;
    }
  }, {
    key: "fees",
    value: function fees() {
      return this._txMgr.getTransaction(this.promise).fees();
    }
  }, {
    key: "created",
    value: function created() {
      return this._txMgr.getTransaction(this.promise).timestamp();
    }
  }, {
    key: "transact",
    value: function transact(contract, method, args, transactionManager, options) {
      var _this = this;

      this._contract = contract;
      this._txMgr = transactionManager;
      this._otc = options.otc;
      delete options.otc;
      var promise = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var txo;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return 0;

              case 2:
                _context.next = 4;
                return contract[method].apply(contract, [].concat((0, _toConsumableArray2["default"])(args), [(0, _objectSpread2["default"])({}, options, {
                  promise: promise
                })]));

              case 4:
                txo = _context.sent;

                _this._parseLogs(txo.receipt.logs);

                return _context.abrupt("return", _this);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
      this.promise = promise;
      return promise;
    }
  }, {
    key: "_parseLogs",
    value: function _parseLogs(logs) {
      var _this2 = this;

      var contract = this._otc ? this._otc : this._contract;
      var LogTrade = contract["interface"].events.LogTrade; // TODO convert string to hex without web3

      var topic = _ethers.utils.keccak256(this._txMgr.get('web3')._web3.utils.toHex(LogTrade.signature));

      var receiptEvents = logs.filter(function (e) {
        return e.topics[0].toLowerCase() === topic.toLowerCase() && e.address.toLowerCase() === contract.address.toLowerCase();
      });
      var total = receiptEvents.reduce(function (acc, event) {
        var parsedLog = LogTrade.parse(event.data);
        return acc.add(parsedLog[_this2._logKey]);
      }, _ethers.utils.bigNumberify('0'));
      this._fillAmount = this._unit.wei(total.toString());
    }
  }]);
  return OtcOrder;
}();

exports["default"] = OtcOrder;

var OtcBuyOrder =
/*#__PURE__*/
function (_OtcOrder) {
  (0, _inherits2["default"])(OtcBuyOrder, _OtcOrder);

  function OtcBuyOrder() {
    var _this3;

    (0, _classCallCheck2["default"])(this, OtcBuyOrder);
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(OtcBuyOrder).call(this));
    _this3._logKey = 'buy_amt';
    _this3._unit = _Currency.DAI;
    return _this3;
  }

  (0, _createClass2["default"])(OtcBuyOrder, null, [{
    key: "build",
    value: function build(contract, method, args, transactionManager) {
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var order = new OtcBuyOrder();
      order.transact(contract, method, args, transactionManager, options);
      return order.promise;
    }
  }]);
  return OtcBuyOrder;
}(OtcOrder);

exports.OtcBuyOrder = OtcBuyOrder;

var OtcSellOrder =
/*#__PURE__*/
function (_OtcOrder2) {
  (0, _inherits2["default"])(OtcSellOrder, _OtcOrder2);

  function OtcSellOrder(currency) {
    var _this4;

    (0, _classCallCheck2["default"])(this, OtcSellOrder);
    _this4 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(OtcSellOrder).call(this));
    _this4._logKey = 'pay_amt';
    _this4._unit = currency;
    return _this4;
  }

  (0, _createClass2["default"])(OtcSellOrder, null, [{
    key: "build",
    value: function build(contract, method, args, transactionManager, currency) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
      var order = new OtcSellOrder(currency);
      order.transact(contract, method, args, transactionManager, options);
      return order.promise;
    }
  }]);
  return OtcSellOrder;
}(OtcOrder);

exports.OtcSellOrder = OtcSellOrder;