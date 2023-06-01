/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import {
  DiamondGovernanceClient,
  InterfaceVariables,
} from '@plopmenz/diamond-governance-sdk';

import { useDiamondSDKContext } from '../context/DiamondGovernanceSDK';
import { FetchVariableResult, fetchVariableValue } from './useDaoVariable';

export type UseDaoVariablesData = {
  loading: boolean;
  error: string | null;
  variables: InterfaceVariables[] | null;
  /** Set of interface+method identifiers for all fetched variables */
  variableMap: Set<string> | null;
  values: Record<string, Record<string, FetchVariableResult>> | null;
  refetch: () => void;
};

export type UseDaoVariablesProps = {
  useDummyData?: boolean;
  fetchWithValues?: boolean;
};

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

export const useDaoVariables = ({
  useDummyData = false,
  fetchWithValues = false,
}: UseDaoVariablesProps): UseDaoVariablesData => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [variables, setVariables] = useState<InterfaceVariables[] | null>(null);
  const [variableMap, setVariableMap] = useState<Set<string> | null>(null);
  const [values, setValues] = useState<Record<
    string,
    Record<string, FetchVariableResult>
  > | null>(null);
  const { client } = useDiamondSDKContext();

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
    if (!client) return;
    fetchVariables(client);
  };

  useEffect(() => {
    refetch();
  }, [client]);

  useEffect(() => {
    if (!variables) return;
    const _variableMap = new Set<string>();
    variables.forEach((v) => {
      v.variables.forEach((vv) => {
        _variableMap.add(
          `${v.interfaceName}.set${vv.variableName}(${vv.variableType})`
        );
      });
    });
    setVariableMap(_variableMap);
  }, [variables]);

  return {
    loading,
    error,
    variables,
    variableMap,
    values,
    refetch,
  };
};
