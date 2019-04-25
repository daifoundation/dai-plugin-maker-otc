import MakerOtcService from './MakerOtcService';

export default {
  addConfig: function(config) {
    return {
      ...config,
      additionalServices: ['exchange'],
      exchange: [MakerOtcService]
    }
  }
}