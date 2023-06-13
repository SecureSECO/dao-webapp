/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { DiamondGovernanceClient } from '@plopmenz/diamond-governance-sdk';
import { BigNumber } from 'ethers';
import { useProvider } from 'wagmi';

import { useDiamondSDKContext } from '../context/DiamondGovernanceSDK';
import {
  assertUnreachable,
  getErrorMessage,
  isNullOrUndefined,
  promiseObjectAll,
} from '../lib/utils';

export type SwapKind = 'Mint' | 'Burn';

export interface useSwapProps {
  swapKind: SwapKind;
  amount: BigNumber | undefined | null;
  //number between 0 and 100
  slippage: number | undefined | null;
  enabled?: boolean;
}

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
  const slippageBN = BigNumber.from((slippage * 10).toFixed(0)); // e.g.: 12.3456% becomes 123 (essentially per mille)
  const slippageFactor = BigNumber.from(1000).sub(slippageBN); // e.g. 123 becomes 877
  return amount.mul(slippageFactor).div(1000); // times slippageFactor, divide by 1000 to correct for per mille
};

export const useMarketMaker = ({
  swapKind,
  amount,
  slippage,
  enabled = true,
}: useSwapProps) => {
  const { client } = useDiamondSDKContext();
  const [estimatedGas, setEstimatedGas] = useState<null | BigNumber>(null);
  const [expectedReturn, setExpectedReturn] = useState<null | BigNumber>(null);
  const [contractAddress, setContractAddress] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const provider = useProvider();

  const fetchData = async (client: DiamondGovernanceClient) => {
    try {
      setIsLoading(true);
      setError(null);
      // Try to set contract address as soon as possible.
      const marketMaker = await client.sugar.GetABCMarketMaker();
      setContractAddress(marketMaker.address);

      if (isNullOrUndefined(amount) || amount.isZero())
        throw new ValidationError('Amount is not valid');
      if (isNullOrUndefined(slippage) || isNaN(slippage))
        throw new ValidationError('Slippage is not valid');

      if (swapKind === 'Mint') {
        const mintAmount = await marketMaker.calculateMint(amount);
        const minAmount = applySlippage(mintAmount, slippage);
        const gas = await marketMaker.estimateGas.mint(amount, minAmount);
        const gasPrice = await provider.getGasPrice();

        setEstimatedGas(gas.mul(gasPrice));
        setExpectedReturn(mintAmount);
      }

      if (swapKind === 'Burn') {
        const burnAmount = await marketMaker.calculateBurn(amount);
        const minAmount = applySlippage(burnAmount, slippage);
        const values = await promiseObjectAll({
          gas: marketMaker.estimateGas.burn(amount, minAmount),
          exitFee: marketMaker.calculateExitFee(amount),
        });
        const gasPrice = await provider.getGasPrice();

        setEstimatedGas(values.gas.mul(gasPrice));
        setExpectedReturn(burnAmount.sub(values.exitFee));
      }
    } catch (e) {
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
