import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../api/auth';
import { clearBookings, fetchBookings } from '../api/bookings';
import {
  fetchDevices,
  fetchOperationLogs,
  runDeviceAction,
  type Device,
  type DeviceAction,
  type OperationLog,
} from '../api/devices';
import { clearInquiries, fetchInquiries } from '../api/inquiries';
import { AdminStatCards } from '../components/admin/AdminStatCards';
import { AdminToolbar, type ConsultationTypeFilter } from '../components/admin/AdminToolbar';
import { DemoBookingTable } from '../components/admin/DemoBookingTable';
import { DeviceStatusPanel } from '../components/admin/DeviceStatusPanel';
import { InquiryTable } from '../components/admin/InquiryTable';
import { OperationLogPanel } from '../components/admin/OperationLogPanel';
import { ProjectDataPanel } from '../components/admin/ProjectDataPanel';
import { SiteFooter } from '../components/layout/SiteFooter';
import { Button } from '../components/ui/Button';
import { buttonStyles } from '../components/ui/Button';
import type { DemoBookingRecord } from '../types/booking';
import type { InquiryRecord } from '../types/inquiry';
import { exportCsv, type CsvColumn } from '../utils/csv';
import { readStorageList, removeStorageKeys, STORAGE_KEYS } from '../utils/localStorage';

type ExportRecord = {
  consultationType: string;
  name: string;
  phone: string;
  organization?: string;
  topic?: string;
  budgetRange?: string;
  message?: string;
  createdAt: string;
};

type DataMode = 'backend' | 'local';

function recordMatchesKeyword(record: DemoBookingRecord | InquiryRecord, keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) {
    return true;
  }

  return [record.name, record.phone, record.organization]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(normalizedKeyword));
}

function formatTimestampForFilename(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
  ].join('');
}

const exportColumns: CsvColumn<ExportRecord>[] = [
  { header: '咨询类型', value: (record) => record.consultationType },
  { header: '姓名', value: (record) => record.name },
  { header: '联系方式', value: (record) => record.phone },
  { header: '单位/学院', value: (record) => record.organization },
  { header: '咨询主题', value: (record) => record.topic },
  { header: '预算范围', value: (record) => record.budgetRange },
  { header: '留言说明', value: (record) => record.message },
  { header: '提交时间', value: (record) => record.createdAt },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<DemoBookingRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);
  const [consultationType, setConsultationType] = useState<ConsultationTypeFilter>('all');
  const [keyword, setKeyword] = useState('');
  const [dataMode, setDataMode] = useState<DataMode>('backend');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeviceBusy, setIsDeviceBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const currentUser = useMemo(() => getStoredUser(), []);

  const loadLocalRecords = useCallback(() => {
    setBookings(readStorageList<DemoBookingRecord>(STORAGE_KEYS.demoBookings));
    setInquiries(readStorageList<InquiryRecord>(STORAGE_KEYS.inquiries));
    setDevices([]);
    setOperationLogs([]);
    setDataMode('local');
  }, []);

  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    setStatusMessage('');

    try {
      const [nextBookings, nextInquiries, nextDevices, nextOperationLogs] = await Promise.all([
        fetchBookings(),
        fetchInquiries(),
        fetchDevices(),
        fetchOperationLogs(),
      ]);

      setBookings(nextBookings);
      setInquiries(nextInquiries);
      setDevices(nextDevices);
      setOperationLogs(nextOperationLogs);
      setDataMode('backend');
    } catch {
      loadLocalRecords();
      setStatusMessage('当前使用本地演示模式');
    } finally {
      setIsLoading(false);
    }
  }, [loadLocalRecords]);

  useEffect(() => {
    void loadAdminData();
  }, [loadAdminData]);

  const filteredBookings = useMemo(() => {
    if (consultationType === 'inquiry') {
      return [];
    }

    return bookings.filter((record) => recordMatchesKeyword(record, keyword));
  }, [bookings, consultationType, keyword]);

  const filteredInquiries = useMemo(() => {
    if (consultationType === 'demo') {
      return [];
    }

    return inquiries.filter((record) => recordMatchesKeyword(record, keyword));
  }, [inquiries, consultationType, keyword]);

  const exportRecords = useMemo<ExportRecord[]>(() => {
    const bookingRecords: ExportRecord[] = filteredBookings.map((record) => ({
      consultationType: '预约演示',
      name: record.name,
      phone: record.phone,
      organization: record.organization,
      topic: record.preferredDate ? `期望日期：${record.preferredDate}` : undefined,
      message: record.message,
      createdAt: record.createdAt,
    }));

    const inquiryRecords: ExportRecord[] = filteredInquiries.map((record) => ({
      consultationType: '询价意向',
      name: record.name,
      phone: record.phone,
      organization: record.organization,
      topic: record.expectedScenario,
      budgetRange: record.budgetRange,
      message: record.message,
      createdAt: record.createdAt,
    }));

    return [...bookingRecords, ...inquiryRecords].sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
  }, [filteredBookings, filteredInquiries]);

  async function handleClearAll() {
    const hasRecords = bookings.length > 0 || inquiries.length > 0;
    if (!hasRecords) {
      window.alert('当前没有可清空的演示数据。');
      return;
    }

    const confirmed = window.confirm(
      dataMode === 'backend'
        ? '确认清空后端数据库中的预约演示和询价记录？该操作无法恢复。'
        : '确认清空全部本地演示数据？该操作会删除当前浏览器中的预约演示和询价记录，且无法恢复。',
    );

    if (!confirmed) {
      return;
    }

    if (dataMode === 'backend') {
      try {
        await Promise.all([clearBookings(), clearInquiries()]);
        await loadAdminData();
        setStatusMessage('后端预约和询价记录已清空。');
        return;
      } catch {
        setStatusMessage('当前使用本地演示模式');
      }
    }

    removeStorageKeys([STORAGE_KEYS.demoBookings, STORAGE_KEYS.inquiries]);
    loadLocalRecords();
  }

  function handleExportCsv() {
    if (exportRecords.length === 0) {
      window.alert('当前筛选条件下没有可导出的记录。');
      return;
    }

    exportCsv(
      `leaf-clean-admin-records-${formatTimestampForFilename()}.csv`,
      exportColumns,
      exportRecords,
    );
  }

  async function handleDeviceAction(deviceId: number, action: DeviceAction) {
    setIsDeviceBusy(true);
    setStatusMessage('');

    try {
      await runDeviceAction(deviceId, action);
      const [nextDevices, nextOperationLogs] = await Promise.all([
        fetchDevices(),
        fetchOperationLogs(),
      ]);

      setDevices(nextDevices);
      setOperationLogs(nextOperationLogs);
      setDataMode('backend');
      setStatusMessage('模拟设备操作已写入后端操作日志。');
    } catch {
      loadLocalRecords();
      setStatusMessage('当前使用本地演示模式，无法执行后端模拟设备控制。');
    } finally {
      setIsDeviceBusy(false);
    }
  }

  function handleLogout() {
    clearAuthSession();
    navigate('/login', { replace: true });
  }

  const hasKeyword = keyword.trim().length > 0;
  const filteredResultCount = filteredBookings.length + filteredInquiries.length;
  const emptyDescription = hasKeyword
    ? '当前关键词或咨询类型下没有匹配记录。请调整筛选条件，或回到前台提交新的演示数据。'
    : dataMode === 'backend'
      ? '在前台页面提交记录后，这里会从后端数据库读取并展示数据。'
      : '在前台页面提交记录后，这里会读取 localStorage 并展示数据。';
  const showBookings = consultationType === 'all' || consultationType === 'demo';
  const showInquiries = consultationType === 'all' || consultationType === 'inquiry';
  const sourceLabel = dataMode === 'backend' ? '后端数据库记录' : '当前浏览器本地记录';

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#F6FBF9_0%,#E8F8F5_100%)] text-carbon">
      <header className="relative overflow-hidden border-b border-carbon/10 bg-carbon px-5 py-7 text-white sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-industrial-grid bg-[length:56px_56px] opacity-10" />
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-aqua/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-[1400px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">
              Admin Console
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              比赛展示用管理后台
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/68">
              本页面仅用于比赛展示和现场演示。设备控制为后端数据库模拟状态，不接真实硬件。
            </p>
            <p className="mt-2 text-xs font-semibold text-white/56">
              当前用户：{currentUser?.username ?? '未识别'}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className={buttonStyles({
                variant: 'secondary',
                className: 'border-white/20 bg-white/10 text-white hover:bg-white hover:text-carbon',
              })}
            >
              返回前台展示
            </Link>
            <Button
              variant="secondary"
              className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-carbon"
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-8 px-5 py-10 sm:px-8 lg:px-10">
        <div
          className={
            dataMode === 'backend'
              ? 'rounded-2xl border border-aqua/15 bg-aqua/10 px-4 py-3 text-sm font-semibold text-carbon'
              : 'rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800'
          }
        >
          {dataMode === 'backend'
            ? statusMessage || '当前使用后端数据库模式'
            : statusMessage || '当前使用本地演示模式'}
        </div>

        <AdminStatCards bookings={bookings} inquiries={inquiries} sourceLabel={sourceLabel} />
        <AdminToolbar
          consultationType={consultationType}
          keyword={keyword}
          resultCount={filteredResultCount}
          dataMode={dataMode}
          isLoading={isLoading}
          onConsultationTypeChange={setConsultationType}
          onKeywordChange={setKeyword}
          onRefresh={() => void loadAdminData()}
          onClearAll={handleClearAll}
          onExportCsv={handleExportCsv}
        />
        <ProjectDataPanel />
        <DeviceStatusPanel
          devices={devices}
          dataMode={dataMode}
          isBusy={isDeviceBusy}
          onAction={(deviceId, action) => void handleDeviceAction(deviceId, action)}
        />
        <OperationLogPanel logs={operationLogs} dataMode={dataMode} />

        {showBookings ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-aqua">Demo Records</p>
                <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.03em] text-carbon">
                  预约演示记录
                </h2>
              </div>
              <p className="text-sm font-semibold text-steel">共 {filteredBookings.length} 条</p>
            </div>
            <DemoBookingTable
              records={filteredBookings}
              emptyTitle={hasKeyword ? '没有匹配的预约演示记录' : '暂无预约演示记录'}
              emptyDescription={emptyDescription}
            />
          </section>
        ) : null}

        {showInquiries ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-aqua">Inquiry Records</p>
                <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.03em] text-carbon">
                  询价意向记录
                </h2>
              </div>
              <p className="text-sm font-semibold text-steel">共 {filteredInquiries.length} 条</p>
            </div>
            <InquiryTable
              records={filteredInquiries}
              emptyTitle={hasKeyword ? '没有匹配的询价意向记录' : '暂无询价记录'}
              emptyDescription={emptyDescription}
            />
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
