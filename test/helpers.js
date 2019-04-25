export async function placeLimitOrder(otcService, sellDai) {
  const wethToken = otcService.get('token').getToken(WETH);
  const wethAddress = wethToken.address();
  const daiToken = otcService.get('token').getToken(DAI);
  const daiAddress = daiToken.address();
  const oasisAddress = otcService
    .get('smartContract')
    .getContractByName('MAKER_OTC').address;
  const sellToken = sellDai ? daiAddress : wethAddress;
  const buyToken = sellDai ? wethAddress : daiAddress;
  const value = sellDai ? utils.parseEther('2.0') : utils.parseEther('10.0');
  const position = sellDai ? 0 : 1;

  await wethToken.approveUnlimited(oasisAddress);
  await wethToken.deposit('1');
  await daiToken.approveUnlimited(oasisAddress);

  return await offer(
    otcService,
    utils.parseEther('0.5'),
    sellToken,
    value,
    buyToken,
    position
  );
}

async function offer(
  otcService,
  payAmount,
  payTokenAddress,
  buyAmount,
  buyTokenAddress,
  position
) {
  const oasisContract = otcService
    .get('smartContract')
    .getContractByName('MAKER_OTC');

  const tx = await oasisContract.offer(
    payAmount,
    payTokenAddress,
    buyAmount,
    buyTokenAddress,
    position
  );
  return await tx.mine();
}