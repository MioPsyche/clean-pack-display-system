import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser, isLocalDemoSession } from '../api/auth';
import { clearBookings, deleteBooking, fetchBookings } from '../api/bookings';
import { ApiError, isAuthError, isUnreachableError } from '../api/client';
import {
  fetchDevices,
  fetchOperationLogs,
  runDeviceAction,
  type Device,
  type DeviceAction,
  type OperationLog,
} from '../api/devices';
import { clearInquiries, deleteInquiry, fetchInquiries } from '../api/inquiries';
import { AdminStatCards } from '../components/admin/AdminStatCards';
import { AdminToolbar, type ConsultationTypeFilter } from '../components/admin/AdminToolbar';
import { DemoBookingTable } from '../components/admin/DemoBookingTable';
import { DeviceStatusPanel } from '../components/admin/DeviceStatusPanel';
import { InquiryTable } from '../components/admin/InquiryTable';
import { OperationLogPanel } from '../components/admin/OperationLogPanel';
import { ProjectDataPanel } from '../components/admin/ProjectDataPanel';
import { SiteFooter } from '../components/layout/SiteFooter';
import { Button, buttonStyles } from '../components/ui/Button';
import type { DemoBookingRecord } from '../types/booking';
import type { InquiryRecord } from '../types/inquiry';
import { exportCsv, type CsvColumn } from '../utils/csv';
import { timestampToMillis } from '../utils/formatDate';
import {
  readStorageList,
  removeStorageKeys,
  removeStorageRecord,
  STORAGE_KEYS,
} from '../utils/localStorage';

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

type StatusTone = 'info' | 'success' | 'warning' | 'error';

type StatusMessage = {
  tone: StatusTone;
  text: string;
};

const statusToneStyles: Record<StatusTone, string> = {
  info: 'rounded-2xl border border-aqua/15 bg-aqua/10 px-4 py-3 text-sm font-semibold text-carbon',
  success: 'rounded-2xl border border-leaf/25 bg-leaf/15 px-4 py-3 text-sm font-semibold text-carbon',
  warning: 'rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800',
  error: 'rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700',
};

function recordMatchesKeyword(record: DemoBookingRecord | InquiryRecord, keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) {
    return true;
  }

  return [record.name, record.phone, record.organization]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(normalizedKeyword));
}

function apiErrorText(error: unknown) {
  return error instanceof ApiError ? error.message : '未知错误';
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
  const [dataMode, setDataMode] = useState<DataMode>(isLocalDemoSession() ? 'local' : 'backend');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busyDeviceId, setBusyDeviceId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const currentUser = useMemo(() => getStoredUser(), []);
  // 请求序号：只接受最新一次加载的结果，避免旧响应覆盖新数据
  const loadSeqRef = useRef(0);

  const handleSessionExpired = useCallback(() => {
    clearAuthSession();
    navigate('/login', { replace: true, state: { from: { pathname: '/admin' } } });
  }, [navigate]);

  const loadLocalRecords = useCallback(() => {
    setBookings(readStorageList<DemoBookingRecord>(STORAGE_KEYS.demoBookings));
    setInquiries(readStorageList<InquiryRecord>(STORAGE_KEYS.inquiries));
    setDevices([]);
    setOperationLogs([]);
    setDataMode('local');
  }, []);

  const loadAdminData = useCallback(async () => {
    // 本地演示登录不请求后端，直接读取本机数据，避免刷出一排 401
    if (isLocalDemoSession()) {
      loadLocalRecords();
      setStatusMessage({ tone: 'info', text: '当前为本地演示模式登录，展示本机浏览器中的演示数据。' });
      return;
    }

    const requestId = ++loadSeqRef.current;
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const [nextBookings, nextInquiries, nextDevices, nextOperationLogs] = await Promise.all([
        fetchBookings(),
        fetchInquiries(),
        fetchDevices(),
        fetchOperationLogs(),
      ]);

      if (loadSeqRef.current !== requestId) {
        return;
      }

      setBookings(nextBookings);
      setInquiries(nextInquiries);
      setDevices(nextDevices);
      setOperationLogs(nextOperationLogs);
      setDataMode('backend');
    } catch (error) {
      if (loadSeqRef.current !== requestId) {
        return;
      }

      if (isAuthError(error)) {
        handleSessionExpired();
        return;
      }

      if (isUnreachableError(error)) {
        loadLocalRecords();
        setStatusMessage({ tone: 'warning', text: '后端服务不可用，已切换到本地演示模式。' });
        return;
      }

      // 后端在线但返回了错误：保留当前数据并提示重试，而不是整页替换成本地数据
      setStatusMessage({
        tone: 'error',
        text: `后端数据加载失败：${apiErrorText(error)}，可点击“刷新数据”重试。`,
      });
    } finally {
      if (loadSeqRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, [handleSessionExpired, loadLocalRecords]);

  useEffect(() => {
    void loadAdminData();

    return () => {
      // 组件卸载后丢弃仍在途的响应
      loadSeqRef.current += 1;
    };
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
      (left, right) => timestampToMillis(right.createdAt) - timestampToMillis(left.createdAt),
    );
  }, [filteredBookings, filteredInquiries]);

  async function handleClearAll() {
    if (isClearing) {
      return;
    }

    const hasRecords = bookings.length > 0 || inquiries.length > 0;
    if (!hasRecords) {
      setStatusMessage({ tone: 'info', text: '当前没有可清空的演示数据。' });
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
      setIsClearing(true);
      try {
        const results = await Promise.allSettled([clearBookings(), clearInquiries()]);
        const failures = results.filter(
          (result): result is PromiseRejectedResult => result.status === 'rejected',
        );

        if (failures.some((failure) => isAuthError(failure.reason))) {
          handleSessionExpired();
          return;
        }

        await loadAdminData();

        if (failures.length > 0) {
          setStatusMessage({
            tone: 'error',
            text: `部分记录清空失败：${apiErrorText(failures[0].reason)}，请刷新后重试。`,
          });
        } else {
          setStatusMessage({ tone: 'success', text: '后端预约和询价记录已清空。' });
        }
      } finally {
        setIsClearing(false);
      }
      // 后端模式不再落到本地删除，避免后端清空失败时误删本机 localStorage 数据
      return;
    }

    removeStorageKeys([STORAGE_KEYS.demoBookings, STORAGE_KEYS.inquiries]);
    loadLocalRecords();
    setStatusMessage({ tone: 'success', text: '本地演示数据已清空。' });
  }

  async function handleDeleteRecord(
    kind: 'booking' | 'inquiry',
    record: DemoBookingRecord | InquiryRecord,
  ) {
    if (deletingId) {
      return;
    }

    const label = kind === 'booking' ? '预约演示' : '询价意向';
    const confirmed = window.confirm(`确认删除${label}记录「${record.name}」？该操作无法恢复。`);
    if (!confirmed) {
      return;
    }

    const removeFromState = () => {
      if (kind === 'booking') {
        setBookings((current) => current.filter((item) => item.id !== record.id));
      } else {
        setInquiries((current) => current.filter((item) => item.id !== record.id));
      }
    };

    if (dataMode === 'backend' && typeof record.backendId === 'number') {
      setDeletingId(record.id);
      try {
        if (kind === 'booking') {
          await deleteBooking(record.backendId);
        } else {
          await deleteInquiry(record.backendId);
        }
        removeFromState();
        setStatusMessage({ tone: 'success', text: `已删除${label}记录「${record.name}」。` });
      } catch (error) {
        if (isAuthError(error)) {
          handleSessionExpired();
          return;
        }

        setStatusMessage({ tone: 'error', text: `删除失败：${apiErrorText(error)}` });

        // 记录可能已在其他窗口被删除：刷新列表让页面与后端保持一致
        if (error instanceof ApiError && error.status === 404) {
          void loadAdminData();
        }
      } finally {
        setDeletingId(null);
      }
      return;
    }

    if (dataMode === 'local') {
      try {
        removeStorageRecord(
          kind === 'booking' ? STORAGE_KEYS.demoBookings : STORAGE_KEYS.inquiries,
          record.id,
        );
      } catch {
        setStatusMessage({ tone: 'error', text: '本地存储不可用，删除失败，请检查浏览器设置。' });
        return;
      }
      removeFromState();
      setStatusMessage({ tone: 'success', text: `已删除本地${label}记录「${record.name}」。` });
      return;
    }

    setStatusMessage({ tone: 'error', text: '该记录缺少后端标识，无法删除，请刷新数据后重试。' });
  }

  function handleExportCsv() {
    if (exportRecords.length === 0) {
      setStatusMessage({ tone: 'info', text: '当前筛选条件下没有可导出的记录。' });
      return;
    }

    try {
      exportCsv(
        `leaf-clean-admin-records-${formatTimestampForFilename()}.csv`,
        exportColumns,
        exportRecords,
      );
      setStatusMessage({ tone: 'success', text: `已导出 ${exportRecords.length} 条记录到 CSV 文件。` });
    } catch {
      setStatusMessage({ tone: 'error', text: 'CSV 导出失败，请重试或更换浏览器。' });
    }
  }

  async function handleDeviceAction(deviceId: number, action: DeviceAction) {
    setBusyDeviceId(deviceId);
    setStatusMessage(null);

    try {
      const { device } = await runDeviceAction(deviceId, action);
      setDevices((current) => current.map((item) => (item.id === device.id ? device : item)));

      try {
        setOperationLogs(await fetchOperationLogs());
      } catch {
        // 日志刷新失败不影响已成功的设备操作
      }

      setStatusMessage({ tone: 'success', text: '模拟设备操作已写入后端操作日志。' });
    } catch (error) {
      if (isAuthError(error)) {
        handleSessionExpired();
        return;
      }

      // 单次操作失败只提示，不清空页面数据、不切换数据模式
      setStatusMessage({ tone: 'error', text: `模拟设备操作失败：${apiErrorText(error)}` });
    } finally {
      setBusyDeviceId(null);
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
  const banner: StatusMessage = statusMessage ?? {
    tone: dataMode === 'backend' ? 'info' : 'warning',
    text: dataMode === 'backend' ? '当前使用后端数据库模式' : '当前使用本地演示模式',
  };

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
        <div className={statusToneStyles[banner.tone]} role="status" aria-live="polite">
          {banner.text}
        </div>

        <AdminStatCards bookings={bookings} inquiries={inquiries} sourceLabel={sourceLabel} />
        <AdminToolbar
          consultationType={consultationType}
          keyword={keyword}
          resultCount={filteredResultCount}
          dataMode={dataMode}
          isLoading={isLoading}
          isClearing={isClearing}
          onConsultationTypeChange={setConsultationType}
          onKeywordChange={setKeyword}
          onRefresh={() => void loadAdminData()}
          onClearAll={() => void handleClearAll()}
          onExportCsv={handleExportCsv}
        />
        <ProjectDataPanel dataMode={dataMode} />
        <DeviceStatusPanel
          devices={devices}
          dataMode={dataMode}
          busyDeviceId={busyDeviceId}
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
              isLoading={isLoading}
              emptyTitle={hasKeyword ? '没有匹配的预约演示记录' : '暂无预约演示记录'}
              emptyDescription={emptyDescription}
              onDeleteRecord={(record) => void handleDeleteRecord('booking', record)}
              deletingId={deletingId}
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
              isLoading={isLoading}
              emptyTitle={hasKeyword ? '没有匹配的询价意向记录' : '暂无询价记录'}
              emptyDescription={emptyDescription}
              onDeleteRecord={(record) => void handleDeleteRecord('inquiry', record)}
              deletingId={deletingId}
            />
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
