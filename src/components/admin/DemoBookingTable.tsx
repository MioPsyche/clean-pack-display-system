import type { DemoBookingRecord } from '../../types/booking';
import { formatDateTime } from '../../utils/formatDate';
import { EmptyState } from '../ui/EmptyState';

type DemoBookingTableProps = {
  records: DemoBookingRecord[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function DemoBookingTable({
  records,
  isLoading = false,
  emptyTitle = '暂无预约演示记录',
  emptyDescription = '在前台页面提交预约演示后，这里会展示相应记录。',
}: DemoBookingTableProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        title={isLoading ? '正在加载数据…' : emptyTitle}
        description={isLoading ? '正在读取预约演示记录，请稍候。' : emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-panel-soft">
      <p className="border-b border-carbon/10 bg-mist/60 px-5 py-2 text-center text-xs font-medium text-steel md:hidden">
        ← 左右滑动查看完整表格 →
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <caption className="sr-only">预约演示记录表</caption>
          <thead className="border-b border-carbon/10 bg-carbon text-xs uppercase tracking-[0.18em] text-white/72">
          <tr>
            <th scope="col" className="px-5 py-4">联系人</th>
            <th scope="col" className="px-5 py-4">电话</th>
            <th scope="col" className="px-5 py-4">单位/学院</th>
            <th scope="col" className="px-5 py-4">期望日期</th>
            <th scope="col" className="px-5 py-4">需求</th>
            <th scope="col" className="px-5 py-4">提交时间</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-carbon/10">
          {records.map((record) => (
            <tr key={record.id} className="align-top text-carbon transition-colors duration-150 hover:bg-mist/60">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-aqua/10 text-sm font-bold text-aqua">
                    {Array.from(record.name)[0] ?? '?'}
                  </span>
                  <span className="font-semibold">{record.name}</span>
                </div>
              </td>
              <td className="px-5 py-4 font-medium tabular-nums">{record.phone}</td>
              <td className="px-5 py-4 text-steel">{record.organization ?? '未填写'}</td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold text-carbon">
                  {record.preferredDate ?? '未填写'}
                </span>
              </td>
              <td className="max-w-sm break-words px-5 py-4 leading-6 text-steel">
                {record.message ?? '未填写'}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-steel tabular-nums">
                {formatDateTime(record.createdAt)}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
