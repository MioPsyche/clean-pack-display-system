import type { OperationLog } from '../../api/devices';
import { formatDateTime } from '../../utils/formatDate';
import { EmptyState } from '../ui/EmptyState';

type OperationLogPanelProps = {
  logs: OperationLog[];
  dataMode: 'backend' | 'local';
};

const MAX_VISIBLE_LOGS = 50;

const actionLabels: Record<string, string> = {
  start: '启动',
  stop: '停止',
  warning_on: '开启警示',
  warning_off: '关闭警示',
};

export function OperationLogPanel({ logs, dataMode }: OperationLogPanelProps) {
  const visibleLogs = logs.slice(0, MAX_VISIBLE_LOGS);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-aqua">Operation Logs</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.03em] text-carbon">
            模拟操作日志
          </h2>
        </div>
        <p className="text-sm font-semibold text-steel">
          {logs.length > MAX_VISIBLE_LOGS
            ? `共 ${logs.length} 条，显示最近 ${MAX_VISIBLE_LOGS} 条`
            : `共 ${logs.length} 条`}
        </p>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          title="暂无操作日志"
          description={
            dataMode === 'local'
              ? '当前使用本地演示模式，未读取后端操作日志。'
              : '执行模拟设备控制后，这里会显示后端记录的操作日志。'
          }
        />
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-panel-soft">
          <p className="border-b border-carbon/10 bg-mist/60 px-5 py-2 text-center text-xs font-medium text-steel md:hidden">
            ← 左右滑动查看完整表格 →
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">模拟设备操作日志表</caption>
              <thead className="border-b border-carbon/10 bg-carbon text-xs uppercase tracking-[0.18em] text-white/72">
              <tr>
                <th scope="col" className="px-5 py-4">日志 ID</th>
                <th scope="col" className="px-5 py-4">设备 ID</th>
                <th scope="col" className="px-5 py-4">操作</th>
                <th scope="col" className="px-5 py-4">说明</th>
                <th scope="col" className="px-5 py-4">时间</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-carbon/10">
              {visibleLogs.map((log) => (
                <tr key={log.id} className="align-top text-carbon transition-colors duration-150 hover:bg-mist/60">
                  <td className="px-5 py-4 font-semibold tabular-nums">{log.id}</td>
                  <td className="px-5 py-4 text-steel tabular-nums">{log.deviceId ?? '未关联'}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold text-carbon">
                      {actionLabels[log.action] ?? log.action}
                    </span>
                  </td>
                  <td className="max-w-md break-words px-5 py-4 leading-6 text-steel">
                    {log.detail ?? '无'}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-steel tabular-nums">
                    {formatDateTime(log.createdAt)}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
