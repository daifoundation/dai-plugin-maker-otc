"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _MakerOtcService = _interopRequireDefault(require("./MakerOtcService"));

var _default = {
  addConfig: function addConfig(config) {
    return (0, _objectSpread2["default"])({}, config, {
      additionalServices: ['exchange'],
      exchange: [_MakerOtcService["default"]]
    });
  }
};
exports["default"] = _default;