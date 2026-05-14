import type { InquiryRecord } from '../../types/inquiry';
import { EmptyState } from '../ui/EmptyState';

type InquiryTableProps = {
  records: InquiryRecord[];
  emptyTitle?: string;
  emptyDescription?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function InquiryTable({
  records,
  emptyTitle = '暂无询价记录',
  emptyDescription = '在前台页面提交询价意向后，这里会读取 localStorage 并展示记录。',
}: InquiryTableProps) {
  if (records.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-panel-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left text-sm">
          <caption className="sr-only">询价意向记录表</caption>
          <thead className="border-b border-carbon/10 bg-carbon text-xs uppercase tracking-[0.18em] text-white/72">
          <tr>
            <th scope="col" className="px-5 py-4">联系人</th>
            <th scope="col" className="px-5 py-4">电话</th>
            <th scope="col" className="px-5 py-4">合作方</th>
            <th scope="col" className="px-5 py-4">应用场景</th>
            <th scope="col" className="px-5 py-4">预算范围</th>
            <th scope="col" className="px-5 py-4">说明</th>
            <th scope="col" className="px-5 py-4">提交时间</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-carbon/10">
          {records.map((record) => (
            <tr key={record.id} className="align-top text-carbon transition-colors duration-150 hover:bg-mist/60">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf/20 text-sm font-bold text-carbon">
                    {record.name.slice(0, 1)}
                  </span>
                  <span className="font-semibold">{record.name}</span>
                </div>
              </td>
              <td className="px-5 py-4 font-medium tabular-nums">{record.phone}</td>
              <td className="px-5 py-4 text-steel">{record.organization ?? '未填写'}</td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold text-carbon">
                  {record.expectedScenario ?? '未填写'}
                </span>
              </td>
              <td className="px-5 py-4 text-steel">{record.budgetRange ?? '未填写'}</td>
              <td className="max-w-sm break-words px-5 py-4 leading-6 text-steel">
                {record.message ?? '未填写'}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-steel tabular-nums">
                {formatDate(record.createdAt)}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
