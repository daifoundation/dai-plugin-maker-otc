import { PrivateService } from '@makerdao/services-core';
import { OtcBuyOrder, OtcSellOrder } from './OtcOrder';
import { getCurrency, DAI, WETH } from '../../eth/Currency';

export default class MakerOtcService extends PrivateService {
  constructor(name = 'exchange') {
    super(name, [
      'cdp',
      'smartContract',
      'token',
      'web3',
      'log',
      'gas',
      'allowance',
      'transactionManager'
    ]);
  }

  /*
  daiAmount: amount of Dai to sell
  currency: currency to buy
  minFillAmount: minimum amount of token being bought required.  If this can't be met, the trade will fail
  */
  async sellDai(amount, currency, minFillAmount = 0) {
    const otcContract = this.get('smartContract').getContractByName(
      'MAKER_OTC'
    );
    const daiToken = this.get('token').getToken(DAI);
    const daiAddress = daiToken.address();
    const buyToken = this.get('token').getToken(currency);
    const daiAmountEVM = daiValueForContract(amount);
    const minFillAmountEVM = daiValueForContract(minFillAmount);
    await this.get('allowance').requireAllowance(DAI, otcContract.address);
    return OtcSellOrder.build(
      otcContract,
      'sellAllAmount',
      [daiAddress, daiAmountEVM, buyToken.address(), minFillAmountEVM],
      this.get('transactionManager'),
      currency
    );
  }

  /*
  daiAmount: amount of Dai to buy
  tokenSymbol: symbol of token to sell
  maxFillAmount: If the trade can't be done without selling more than the maxFillAmount of selling token, it will fail
  */
  async buyDai(amount, tokenSymbol, maxFillAmount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
    const otcContract = this.get('smartContract').getContractByName(
      'MAKER_OTC'
    );
    const daiToken = this.get('token').getToken(DAI);
    const daiAddress = daiToken.address();
    const daiAmountEVM = daiValueForContract(amount);
    const maxFillAmountEVM = daiValueForContract(maxFillAmount);
    const sellTokenAddress = this.get('token')
      .getToken(tokenSymbol)
      .address();
    await this.get('allowance').requireAllowance(WETH, otcContract.address);
    return OtcBuyOrder.build(
      otcContract,
      'buyAllAmount',
      [daiAddress, daiAmountEVM, sellTokenAddress, maxFillAmountEVM],
      this.get('transactionManager')
    );
  }
}

function daiValueForContract(amount) {
  return getCurrency(amount, DAI).toFixed('wei');
}