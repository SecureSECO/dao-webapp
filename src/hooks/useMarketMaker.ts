/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { DiamondGovernanceClient } from '@plopmenz/diamond-governance-sdk';
import { BigNumber, constants } from 'ethers';
import { useProvider } from 'wagmi';

import { useDiamondSDKContext } from '../context/DiamondGovernanceSDK';
import {
  assertUnreachable,
  getErrorMessage,
  isNullOrUndefined,
  promiseObjectAll,
} from '../lib/utils';

export type SwapKind = 'Mint' | 'Burn';

export interface useMarketMakerProps {
  /*
   * Mint: DAI is swapped for SECOIN, Burn: SECOIN is swapped for DAI.
   */
  swapKind: SwapKind;
  /*
   * Amount of DAI/SECOIN to be swapped, spend from the users wallet
   */
  amount: BigNumber | undefined | null;
  /*
   * Slippage percentage to be applied to the expected return.
   * That is, when the actual return will be lower than the expected return,
   * what percentage of the expected return is still acceptable for the user as actual return.
   * Slippage must be a number between(inclusive) 0 and 100, where 100 corresponds to 100% slippage.
   */
  slippage: number | undefined | null;
  /*
   * Data fetching will only happen iff enabled is true.
   * This can be useful to prevent unneeded computation.
   */
  enabled?: boolean;
}

// Special Error case indicating error is caused by invalid user input,
// rather than an error raised by the smart contracts.
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/*
 * Applies a slippage percentage to an amount.
 * @param slippage The slippage to apply, must be a between/equal 0 and 100. Only one decimal of precision will be used
 */
export const applySlippage = (amount: BigNumber, slippage: number) => {
  if (slippage > 100) throw new ValidationError('Slippage is more than 100%');
  if (slippage < 0) throw new ValidationError('Slippage is less than 0%');

  const slippageBN = BigNumber.from((slippage * 10).toFixed(0)); // e.g.: 12.3456% becomes 123 (essentially per mille)
  const slippageFactor = BigNumber.from(1000).sub(slippageBN); // e.g. 123 becomes 877
  return amount.mul(slippageFactor).div(1000); // times slippageFactor, divide by 1000 to correct for per mille
};

/*
 * useMarketMaker is a hook for swapping SECOIN and DAI.
 *
 * MarketMaker is provided by the DiamondGovernanceSDK and smart contracts.
 * MarketMaker provides the ability to swap SECOIN with DAI (token with fixed/stable monetary value) and vice versa.
 * The useMarketMaker hook is a convenient react hook around the MarketMaker.
 * Apart from the DiamondGovernanceSDK, this hook also relies on a wagmi provider.
 * This is needed to convert GAS fees to an actual price.
 *
 * @param props - see useMarketMakerProps for parameters
 */
export const useMarketMaker = ({
  swapKind,
  amount,
  slippage,
  enabled = true,
}: useMarketMakerProps) => {
  const { client } = useDiamondSDKContext();
  const [estimatedGas, setEstimatedGas] = useState<null | BigNumber>(null);
  const [expectedReturn, setExpectedReturn] = useState<null | BigNumber>(null);
  const [contractAddress, setContractAddress] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Provider is needed for converting GAS to a gas Price.
  const provider = useProvider();

  const fetchData = async (client: DiamondGovernanceClient) => {
    try {
      setIsLoading(true);
      setError(null);
      // Reset data to null
      // Except for contractAddress, as this is a constant. Thus if it has been set, it is always correct.
      setEstimatedGas(null);
      setExpectedReturn(null);

      // Try to set contract address as soon as possible.
      const marketMaker = await client.sugar.GetABCMarketMaker();
      setContractAddress(marketMaker.address);

      // Start promise as soon as possible/needed
      const gasPricePromise = provider.getGasPrice();

      if (isNullOrUndefined(amount))
        throw new ValidationError('Amount is not valid');
      if (amount.isZero()) {
        setExpectedReturn(constants.Zero);
        throw new ValidationError('Amount is zero');
      }
      if (isNullOrUndefined(slippage) || isNaN(slippage))
        throw new ValidationError('Slippage is not valid');

      if (swapKind === 'Mint') {
        // Get and set expected return
        const mintAmount = await marketMaker.calculateMint(amount);
        setExpectedReturn(mintAmount);

        // Get and set estimated gas
        const minAmount = applySlippage(mintAmount, slippage);
        const gasValues = await promiseObjectAll({
          gas: marketMaker.estimateGas.mint(amount, minAmount),
          gasPrice: gasPricePromise,
        });
        setEstimatedGas(gasValues.gas.mul(gasValues.gasPrice));
      }

      if (swapKind === 'Burn') {
        // Get and set expected return
        const burnWithoutFee = await marketMaker.calculateBurn(amount);
        const exitFee = await marketMaker.calculateExitFee(burnWithoutFee);
        const burnAmount = burnWithoutFee.sub(exitFee);
        setExpectedReturn(burnAmount);

        // Get and set estimated gas
        const minAmount = applySlippage(burnAmount, slippage);
        const gasValues = await promiseObjectAll({
          gas: marketMaker.estimateGas.burn(amount, minAmount),
          gasPrice: gasPricePromise,
        });

        setEstimatedGas(gasValues.gas.mul(gasValues.gasPrice));
      }
    } catch (e) {
      // Set error. If it is a ValidationError, the error message can be used to show to the user.
      // Otherwise, the user error message should be a more general message.
      if (e instanceof ValidationError) {
        setError(getErrorMessage(e));
      } else {
        console.error(e);
        setError('Could not retrieve estimates');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const performSwap = async () => {
    // Thrown errors should be caught by the caller of performSwap.
    if (!client) throw new Error('Client is not set');
    if (isNullOrUndefined(amount) || isNullOrUndefined(expectedReturn))
      throw new Error('Amount is not valid');
    if (isNullOrUndefined(slippage) || isNaN(slippage))
      throw new Error('Slippage is not valid');

    const marketMaker = await client.sugar.GetABCMarketMaker();
    const minAmount = applySlippage(expectedReturn, slippage);

    if (swapKind === 'Mint') {
      return marketMaker.mint(amount, minAmount);
    }
    if (swapKind === 'Burn') {
      return marketMaker.burn(amount, minAmount);
    }

    assertUnreachable();
  };

  useEffect(() => {
    if (!enabled || !client) return;
    fetchData(client);

    //Set interval such that data is fetched every 10 seconds
    const id = setInterval(() => fetchData(client), 10000);
    return () => clearInterval(id);
  }, [client, amount?._hex, slippage, swapKind, enabled]);

  return {
    isLoading,
    error,
    estimatedGas,
    expectedReturn,
    performSwap,
    contractAddress,
  };
};
