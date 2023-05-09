import React from 'react';

interface TableColumn {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  rowLimit?: number;
}

/**
 * Component to display a table
 * @param props.columns The columns to display, and the string to access its data
 * @param props.data The data to display
 * @param props.rowLimit The maximum number of rows to display
 * @returns A <table/> element displaying the given data, or a message if the data exceeds the given limit
 */
const Table: React.FC<TableProps> = ({ columns, data, rowLimit = 15 }) => {
  if (data.length > rowLimit)
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        Data is too large to display
      </p>
    );

  return (
    <table className="w-full table-auto border-collapse overflow-hidden rounded-lg text-sm shadow-md">
      <thead className="bg-popover text-base">
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className="px-4 py-2 font-medium leading-5 text-primary-highlight"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="border-border">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="odd:bg-popover/50 even:bg-popover">
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className="border-t border-border px-4 py-2 text-center"
              >
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
