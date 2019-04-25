import { DAI, ETH, WETH } from '../src/Currency';
import { placeLimitOrder, createDai } from './helpers';
import Maker from '@makerdao/dai';
import MakerOtc from '../dist/src/index.js';

let service;

async function buildTestService() {
  const maker = await Maker.create('test', {
    plugins: [MakerOtc],
    log: false,
    web3: {
      pollingInterval: 50
    }
  });
  await maker.authenticate();
  service = maker.service('exchange');
}

beforeAll(async () => {
  await buildTestService();
  await createDai(service);
});

beforeEach(async () => {
  await buildTestService();
});

test('sell Dai, console log the balances (used for debugging)', async done => {
  let order;
  /* eslint-disable-next-line */
  let initialBalance;
  /* eslint-disable-next-line */
  let finalBalance;
  let daiToken;

  return placeLimitOrder(service)
    .then(() => {
      const oasisContract = service
        .get('smartContract')
        .getContractByName('MAKER_OTC');
      return oasisContract.getBestOffer(
        '0x7ba25f791fa76c3ef40ac98ed42634a8bc24c238',
        '0xc226f3cd13d508bc319f4f4290172748199d6612'
      );
    })
    .then(() => {
      const ethereumTokenService = service.get('token');
      daiToken = ethereumTokenService.getToken(DAI);
      return daiToken.balanceOf(
        service.get('web3').currentAddress()
      );
    })
    .then(balance => {
      initialBalance = balance;
      const wethToken = service.get('token').getToken(WETH);
      return wethToken.balanceOf(
        service.get('web3').currentAddress()
      );
    })
    .then(() => {
      const oasisContract = service
        .get('smartContract')
        .getContractByName('MAKER_OTC');
      return daiToken.approveUnlimited(oasisContract.address);
    })
    .then(() => {
      const oasisContract = service
        .get('smartContract')
        .getContractByName('MAKER_OTC');
      return daiToken.allowance(
        service.get('web3').currentAddress(),
        oasisContract.address
      );
    })
    .then(() => {
      order = service.sellDai('0.01', WETH);
      return order;
    })
    .then(() => {
      const ethereumTokenService = service.get('token');
      const token = ethereumTokenService.getToken(WETH);
      return token.balanceOf(service.get('web3').currentAddress());
    })
    .then(() => {
      const ethereumTokenService = service.get('token');
      const token = ethereumTokenService.getToken(DAI);
      return token.balanceOf(service.get('web3').currentAddress());
    })
    .then(balance => {
      finalBalance = balance;
      done();
    });
});

test('sell Dai', async () => {
  await placeLimitOrder(service);
  const order = await service.sellDai('0.01', WETH);
  expect(order.fees().gt(ETH.wei(80000))).toBeTruthy();
  expect(order.fillAmount()).toEqual(WETH(0.0005));
});

test('buy Dai', async () => {
  await placeLimitOrder(service, true);
  const order = await service.buyDai('0.01', WETH);
  expect(order.fees().gt(ETH.wei(80000))).toBeTruthy();
  expect(order.fillAmount().toString()).toEqual(DAI(0.04).toString());
});

test('buy Dai with wei amount', async () => {
  await placeLimitOrder(service, true);
  const order = await service.buyDai(DAI.wei(10000000000000000), WETH);
  expect(order.fees().gt(ETH.wei(80000))).toBeTruthy();
  expect(order.fillAmount().toString()).toEqual(DAI(0.04).toString());
});