export type CsvColumn<T> = {
  header: string;
  value: (record: T) => string | number | undefined;
};

function escapeCsvCell(value: string | number | undefined) {
  const text = value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportCsv<T>(filename: string, columns: CsvColumn<T>[], records: T[]) {
  const header = columns.map((column) => escapeCsvCell(column.header)).join(',');
  const rows = records.map((record) =>
    columns.map((column) => escapeCsvCell(column.value(record))).join(','),
  );
  const csv = `\uFEFF${[header, ...rows].join('\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
