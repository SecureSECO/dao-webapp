import React from 'react';

interface TableColumn {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
    return (
      <table className="table-auto border-collapse w-full rounded-lg">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-2 bg-popover text-primary font-medium ${
                  index === 0 ? 'rounded-tl-lg' : ''
                } ${index === columns.length - 1 ? 'rounded-tr-lg' : ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-card'}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border-t border-gray-200">
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

export { Table };