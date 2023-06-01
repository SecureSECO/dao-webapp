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
import { BigNumber } from 'ethers';

import { useDiamondSDKContext } from '../context/DiamondGovernanceSDK';
import { FetchVariableResult, fetchVariableValue } from './useDaoVariable';

export type UseDaoVariablesData = {
  loading: boolean;
  error: string | null;
  variables: InterfaceVariables[] | null;
  values: Record<string, Record<string, FetchVariableResult>> | null;
};

export type UseDaoVariablesProps = {
  useDummyData?: boolean;
  fetchWithValues?: boolean;
};

export const useDaoVariables = ({
  useDummyData = false,
  fetchWithValues = false,
}: UseDaoVariablesProps): UseDaoVariablesData => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [variables, setVariables] = useState<InterfaceVariables[] | null>(null);
  const [values, setValues] = useState<Record<
    string,
    Record<string, FetchVariableResult>
  > | null>(null);
  const { client } = useDiamondSDKContext();

  const fetchVariables = async (client: DiamondGovernanceClient) => {
    try {
      const _variables = await client.sugar.GetVariables();
      setVariables(_variables);
    } catch (e) {
      console.error(e);
      setError('Could not fetch DAO variables');
    } finally {
      setLoading(false);
    }
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

  const fetchVariablesWithValues = async (client: DiamondGovernanceClient) => {
    try {
      const _variables = await client.sugar.GetVariables();
      const _values = await Promise.all(
        _variables.map((v) => fetchInterfaceVariableValues(v, client))
      );

      let result: Record<string, Record<string, FetchVariableResult>> = {};
      for (let i = 0; i < _variables.length; i++) {
        result[_variables[i].interfaceName] = _values[i];
      }

      setVariables(_variables);
      setValues(result);
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

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (!client) return;
    if (fetchWithValues) {
      fetchVariablesWithValues(client);
    } else {
      fetchVariables(client);
    }
  }, [client]);

  return {
    loading,
    error,
    variables,
    values,
  };
};
