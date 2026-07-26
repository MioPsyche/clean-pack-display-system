import type { InquiryRecord } from '../../types/inquiry';
import { formatDateTime } from '../../utils/formatDate';
import { RecordNameCell, RecordTable, type RecordColumn } from './RecordTable';

type InquiryTableProps = {
  records: InquiryRecord[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onDeleteRecord?: (record: InquiryRecord) => void;
  deletingId?: string | null;
};

const columns: RecordColumn<InquiryRecord>[] = [
  {
    key: 'name',
    header: '联系人',
    render: (record) => <RecordNameCell name={record.name} avatarClassName="bg-leaf/20 text-carbon" />,
  },
  {
    key: 'phone',
    header: '电话',
    cellClassName: 'px-5 py-4 font-medium tabular-nums',
    render: (record) => record.phone,
  },
  {
    key: 'organization',
    header: '合作方',
    cellClassName: 'px-5 py-4 text-steel',
    render: (record) => record.organization ?? '未填写',
  },
  {
    key: 'expectedScenario',
    header: '应用场景',
    render: (record) => (
      <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold text-carbon">
        {record.expectedScenario ?? '未填写'}
      </span>
    ),
  },
  {
    key: 'budgetRange',
    header: '预算范围',
    cellClassName: 'px-5 py-4 text-steel',
    render: (record) => record.budgetRange ?? '未填写',
  },
  {
    key: 'message',
    header: '说明',
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

export function InquiryTable({
  records,
  isLoading = false,
  emptyTitle = '暂无询价记录',
  emptyDescription = '在前台页面提交询价意向后，这里会展示相应记录。',
  onDeleteRecord,
  deletingId,
}: InquiryTableProps) {
  return (
    <RecordTable
      records={records}
      columns={columns}
      caption="询价意向记录表"
      minWidthClassName="min-w-[1100px]"
      isLoading={isLoading}
      loadingDescription="正在读取询价意向记录，请稍候。"
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      onDeleteRecord={onDeleteRecord}
      deletingId={deletingId}
    />
  );
}
