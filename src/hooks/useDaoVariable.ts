/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { isNullOrUndefined } from '@/src/lib/utils';
import { DiamondGovernanceClient } from '@secureseco-dao/diamond-governance-sdk';
import { BigNumber } from 'ethers';

export type UseDaoVariableData = {
  loading: boolean;
  error: string | null;
  value: FetchVariableResult | null;
};

export type UseDaoVariableProps = {
  interfaceName?: string;
  variableName?: string;
  useDummyData?: boolean;
};

export type FetchVariableResult =
  | string
  | BigNumber
  | number
  | null
  | undefined;

/**
 * Fetches the value of a variable from the DAO.
 * @param interfaceName The name of the interface to fetch the variable from.
 * @param variableName The name of the variable to fetch.
 * @param client The DiamondGovernanceClient to use for fetching the variable.
 * @returns The value of the variable.
 */
export const fetchVariableValue = async (
  interfaceName: string,
  variableName: string,
  client: DiamondGovernanceClient
): Promise<FetchVariableResult> => {
  const facet: any = await (client.pure as any)[interfaceName]();
  const value: any = await facet[`get${variableName}`]();
  return value as FetchVariableResult;
};

/**
 * Hook to fetch a variable from the DAO that the current Diamond Governance client has been instantiated with.
 * @param props The properties to configure the hook.
 * @param props.interfaceName The name of the interface to fetch the variable from.
 * @param props.variableName The name of the variable to fetch.
 * @param props.useDummyData Whether to use dummy data instead of fetching the variable from the DAO.
 * @returns An object containing the variable value, loading state and error state.
 */
export const useDaoVariable = ({
  interfaceName,
  variableName,
  useDummyData = false,
}: UseDaoVariableProps): UseDaoVariableData => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<FetchVariableResult | null>(null);
  const { anonClient } = useDiamondSDKContext();

  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setValue(1);
  };

  const setVariableValue = async (client: DiamondGovernanceClient) => {
    if (isNullOrUndefined(interfaceName) || isNullOrUndefined(variableName)) {
      return;
    }
    try {
      const _value = await fetchVariableValue(
        interfaceName,
        variableName,
        client
      );
      setValue(_value);
    } catch (e) {
      console.error(e);
      setError('Variable value could not be retrieved');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (useDummyData) return setDummyData();
    if (!anonClient) return;
    setVariableValue(anonClient);
  }, [anonClient, interfaceName, variableName]);

  return {
    loading,
    error,
    value,
  };
};
