/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import {
  FetchVariableResult,
  fetchVariableValue,
} from '@/src/hooks/useDaoVariable';
import {
  DiamondGovernanceClient,
  InterfaceVariables,
} from '@secureseco-dao/diamond-governance-sdk';

export type UseDaoVariablesValuesData = Record<
  string,
  Record<string, FetchVariableResult>
>;

export type UseDaoVariablesData = {
  loading: boolean;
  error: string | null;
  variables: InterfaceVariables[] | null;
  values: UseDaoVariablesValuesData | null;
  refetch: () => void;
};

export type UseDaoVariablesProps = {
  useDummyData?: boolean;
  fetchWithValues?: boolean;
};

/**
 * Fetches the values of all variables in an interface.
 * @param interfaceVariables The interface and its variables to fetch the values for.
 * @param client The DiamondGovernanceClient to use for fetching the variables.
 * @returns The values of the variables.
 * @see fetchVariableValue
 */
const fetchInterfaceVariableValues = async (
  interfaceVariables: InterfaceVariables,
  client: DiamondGovernanceClient
): Promise<Record<string, FetchVariableResult>> => {
  const variableValues = await Promise.all(
    interfaceVariables.variables.map((v) =>
      fetchVariableValue(
        interfaceVariables.interfaceName,
        v.variableName,
        client
      )
    )
  );

  let result: Record<string, FetchVariableResult> = {};
  for (let i = 0; i < interfaceVariables.variables.length; i++) {
    result[interfaceVariables.variables[i].variableName] = variableValues[i];
  }

  return result;
};

const defaultProps: UseDaoVariablesProps = {
  useDummyData: false,
  fetchWithValues: false,
};

/**
 * Hook to fetch the DAO variables for the DAO that the current Diamond Governance client has been instantiated with.
 * @param props The properties to configure the hook.
 * @param props.useDummyData Whether to use dummy data instead of fetching the variables from the DAO.
 * @param props.fetchWithValues Whether to fetch the values of the variables as well.
 * @returns An object containing the DAO variables, loading state and error state.
 * @see fetchInterfaceVariableValues
 */
export const useDaoVariables = (
  props?: UseDaoVariablesProps
): UseDaoVariablesData => {
  const { useDummyData, fetchWithValues } = Object.assign(defaultProps, props);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [variables, setVariables] = useState<InterfaceVariables[] | null>(null);
  const [values, setValues] = useState<Record<
    string,
    Record<string, FetchVariableResult>
  > | null>(null);
  const { anonClient } = useDiamondSDKContext();

  const fetchVariables = async (client: DiamondGovernanceClient) => {
    try {
      const _variables = await client.sugar.GetVariables();
      setVariables(_variables);
      if (fetchWithValues) {
        const _values = await Promise.all(
          _variables.map((v) => fetchInterfaceVariableValues(v, client))
        );

        let result: Record<string, Record<string, FetchVariableResult>> = {};
        for (let i = 0; i < _variables.length; i++) {
          result[_variables[i].interfaceName] = _values[i];
        }
        setValues(result);
      }
    } catch (e) {
      console.error(e);
      setError('Could not fetch DAO variables');
    } finally {
      setLoading(false);
    }
  };

  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setVariables([
      {
        interfaceName: 'interface1',
        variables: [
          { variableName: 'var1', variableType: 'uint8', changeable: true },
          { variableName: 'var2', variableType: 'uint64', changeable: true },
        ],
      },
      {
        interfaceName: 'interface2',
        variables: [
          { variableName: 'var1', variableType: 'uint8', changeable: true },
          { variableName: 'var2', variableType: 'uint64', changeable: true },
        ],
      },
    ]);
    setValues({
      interface1: {
        var1: 12,
        var2: 64,
      },
      interface2: {
        var1: 12,
        var2: 64,
      },
    });
  };

  const refetch = () => {
    if (useDummyData) return setDummyData();
    if (!anonClient) return;
    fetchVariables(anonClient);
  };

  useEffect(() => {
    refetch();
  }, [anonClient]);

  return {
    loading,
    error,
    variables,
    values,
    refetch,
  };
};
