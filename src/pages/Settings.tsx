/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { InterfaceVariables } from '@plopmenz/diamond-governance-sdk';
import { ColumnDef } from '@tanstack/react-table';

import {
  DataTable,
  HeaderSortableDecorator,
} from '../components/ui/DataTable';
import {
  UseDaoVariablesValuesData,
  useDaoVariables,
} from '../hooks/useDaoVariables';

type DisplaySetting = {
  interfaceName: string;
  variableName: string;
  value?: string;
  type: string;
};

const columns: ColumnDef<DisplaySetting>[] = [
  {
    accessorKey: 'interfaceName',
    header: ({ column }) => (
      <HeaderSortableDecorator column={column}>Plugin</HeaderSortableDecorator>
    ),
  },
  {
    accessorKey: 'variableName',
    header: ({ column }) => (
      <HeaderSortableDecorator column={column}>Parameter</HeaderSortableDecorator>
    ),
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <HeaderSortableDecorator column={column}>Value</HeaderSortableDecorator>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <HeaderSortableDecorator column={column}>Type</HeaderSortableDecorator>
    ),
  },
];

const toDisplayData = (
  variables: InterfaceVariables[] | null,
  values: UseDaoVariablesValuesData | null
): DisplaySetting[] => {
  if (variables === null) {
    return [];
  }

  const displayData = variables.flatMap((i) =>
    i.variables.map((v) => ({
      interfaceName: i.interfaceName,
      variableName: v.variableName,
      type: v.variableType,
      value:
        values?.[i.interfaceName]?.[v.variableName]?.toString() ?? 'Loading...',
    }))
  );

  return displayData;
};

const Settings = () => {
  const { variables, values, error } = useDaoVariables({
    fetchWithValues: true,
  });

  const displayData = toDisplayData(variables, values);

  return (
    <div className="flex flex-col gap-6">
      <HeaderCard title="Settings" />
      <DataTable columns={columns} data={displayData} />
    </div>
  );
};

export default Settings;
