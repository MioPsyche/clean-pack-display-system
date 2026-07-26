import type { ReactNode } from 'react';
import { EmptyState } from '../ui/EmptyState';

export type RecordColumn<T> = {
  key: string;
  header: string;
  render: (record: T) => ReactNode;
  cellClassName?: string;
};

type RecordTableProps<T extends { id: string }> = {
  records: T[];
  columns: RecordColumn<T>[];
  caption: string;
  minWidthClassName: string;
  isLoading?: boolean;
  loadingDescription?: string;
  emptyTitle: string;
  emptyDescription: string;
  onDeleteRecord?: (record: T) => void;
  deletingId?: string | null;
};

export function RecordNameCell({ name, avatarClassName }: { name: string; avatarClassName: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${avatarClassName}`}
      >
        {Array.from(name)[0] ?? '?'}
      </span>
      <span className="font-semibold">{name}</span>
    </div>
  );
}

export function RecordTable<T extends { id: string }>({
  records,
  columns,
  caption,
  minWidthClassName,
  isLoading = false,
  loadingDescription = '正在从后端读取记录，请稍候。',
  emptyTitle,
  emptyDescription,
  onDeleteRecord,
  deletingId = null,
}: RecordTableProps<T>) {
  if (records.length === 0) {
    return (
      <EmptyState
        title={isLoading ? '正在加载数据…' : emptyTitle}
        description={isLoading ? loadingDescription : emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-panel-soft">
      <p className="border-b border-carbon/10 bg-mist/60 px-5 py-2 text-center text-xs font-medium text-steel md:hidden">
        ← 左右滑动查看完整表格 →
      </p>
      <div className="overflow-x-auto">
        <table className={`w-full ${minWidthClassName} text-left text-sm`}>
          <caption className="sr-only">{caption}</caption>
          <thead className="border-b border-carbon/10 bg-carbon text-xs uppercase tracking-[0.18em] text-white/72">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-5 py-4">
                {column.header}
              </th>
            ))}
            {onDeleteRecord ? (
              <th scope="col" className="px-5 py-4">
                操作
              </th>
            ) : null}
          </tr>
          </thead>
          <tbody className="divide-y divide-carbon/10">
          {records.map((record) => (
            <tr
              key={record.id}
              className="align-top text-carbon transition-colors duration-150 hover:bg-mist/60"
            >
              {columns.map((column) => (
                <td key={column.key} className={column.cellClassName ?? 'px-5 py-4'}>
                  {column.render(record)}
                </td>
              ))}
              {onDeleteRecord ? (
                <td className="whitespace-nowrap px-5 py-4">
                  <button
                    type="button"
                    disabled={deletingId !== null}
                    onClick={() => onDeleteRecord(record)}
                    className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === record.id ? '删除中…' : '删除'}
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
