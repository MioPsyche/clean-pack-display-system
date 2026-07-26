export type CsvColumn<T> = {
  header: string;
  value: (record: T) => string | number | undefined;
};

function escapeCsvCell(value: string | number | undefined) {
  let text = value === undefined ? '' : String(value);

  // 防公式注入：以 = + - @ 或制表符开头的值前置单引号，
  // 避免公开表单填入的内容在 Excel/WPS 中被当作公式执行
  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function exportCsv<T>(filename: string, columns: CsvColumn<T>[], records: T[]) {
  const header = columns.map((column) => escapeCsvCell(column.header)).join(',');
  const rows = records.map((record) =>
    columns.map((column) => escapeCsvCell(column.value(record))).join(','),
  );
  const csv = `\uFEFF${[header, ...rows].join('\r\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();

  // 延迟释放，避免部分浏览器在下载尚未开始时就中断
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
