import type { DemoBookingRecord } from '../../types/booking';
import type { InquiryRecord } from '../../types/inquiry';
import { Card } from '../ui/Card';

type AdminStatCardsProps = {
  bookings: DemoBookingRecord[];
  inquiries: InquiryRecord[];
};

function formatLatestDate(records: Array<{ createdAt: string }>) {
  const latest = records[0]?.createdAt;
  if (!latest) {
    return '暂无';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(latest));
}

const numberFormatter = new Intl.NumberFormat('zh-CN');

export function AdminStatCards({ bookings, inquiries }: AdminStatCardsProps) {
  const allRecords = [...bookings, ...inquiries].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  const stats = [
    { label: '预约演示记录', value: numberFormatter.format(bookings.length), tone: 'bg-aqua' },
    { label: '询价意向记录', value: numberFormatter.format(inquiries.length), tone: 'bg-leaf' },
    { label: '总提交记录', value: numberFormatter.format(allRecords.length), tone: 'bg-carbon' },
    { label: '最近提交', value: formatLatestDate(allRecords), tone: 'bg-mint' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} elevated className="relative overflow-hidden bg-white p-5">
          <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[2.5rem] bg-mist" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-steel">{stat.label}</p>
              <p className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-carbon tabular-nums">
                {stat.value}
              </p>
            </div>
            <span className={`mt-1 h-3 w-3 rounded-full ${stat.tone}`} aria-hidden="true" />
          </div>
          <p className="relative mt-5 border-t border-carbon/10 pt-4 text-xs font-semibold text-steel">
            当前浏览器本地记录
          </p>
        </Card>
      ))}
    </div>
  );
}
