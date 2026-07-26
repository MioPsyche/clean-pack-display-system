import type { DemoBookingRecord } from '../../types/booking';
import { formatDateTime } from '../../utils/formatDate';
import { RecordNameCell, RecordTable, type RecordColumn } from './RecordTable';

type DemoBookingTableProps = {
  records: DemoBookingRecord[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onDeleteRecord?: (record: DemoBookingRecord) => void;
  deletingId?: string | null;
};

const columns: RecordColumn<DemoBookingRecord>[] = [
  {
    key: 'name',
    header: '联系人',
    render: (record) => <RecordNameCell name={record.name} avatarClassName="bg-aqua/10 text-aqua" />,
  },
  {
    key: 'phone',
    header: '电话',
    cellClassName: 'px-5 py-4 font-medium tabular-nums',
    render: (record) => record.phone,
  },
  {
    key: 'organization',
    header: '单位/学院',
    cellClassName: 'px-5 py-4 text-steel',
    render: (record) => record.organization ?? '未填写',
  },
  {
    key: 'preferredDate',
    header: '期望日期',
    render: (record) => (
      <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold text-carbon">
        {record.preferredDate ?? '未填写'}
      </span>
    ),
  },
  {
    key: 'message',
    header: '需求',
    cellClassName: 'max-w-sm break-words px-5 py-4 leading-6 text-steel',
    render: (record) => record.message ?? '未填写',
  },
  {
    key: 'createdAt',
    header: '提交时间',
    cellClassName: 'whitespace-nowrap px-5 py-4 text-steel tabular-nums',
    render: (record) => formatDateTime(record.createdAt),
  },
];

export function DemoBookingTable({
  records,
  isLoading = false,
  emptyTitle = '暂无预约演示记录',
  emptyDescription = '在前台页面提交预约演示后，这里会展示相应记录。',
  onDeleteRecord,
  deletingId,
}: DemoBookingTableProps) {
  return (
    <RecordTable
      records={records}
      columns={columns}
      caption="预约演示记录表"
      minWidthClassName="min-w-[960px]"
      isLoading={isLoading}
      loadingDescription="正在读取预约演示记录，请稍候。"
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      onDeleteRecord={onDeleteRecord}
      deletingId={deletingId}
    />
  );
}
