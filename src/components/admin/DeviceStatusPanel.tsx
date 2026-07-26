import type { Device, DeviceAction } from '../../api/devices';
import { formatDateTime } from '../../utils/formatDate';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';

type DeviceStatusPanelProps = {
  devices: Device[];
  dataMode: 'backend' | 'local';
  busyDeviceId?: number | null;
  onAction: (deviceId: number, action: DeviceAction) => void;
};

const actionItems: Array<{ label: string; action: DeviceAction }> = [
  { label: '启动', action: 'start' },
  { label: '停止', action: 'stop' },
  { label: '开启警示', action: 'warning_on' },
  { label: '关闭警示', action: 'warning_off' },
];

const actionLabels: Record<DeviceAction, string> = {
  start: '启动',
  stop: '停止',
  warning_on: '开启警示',
  warning_off: '关闭警示',
};

function formatRunStatus(runStatus: string) {
  if (runStatus === 'running') {
    return '运行中';
  }

  if (runStatus === 'stopped') {
    return '已停止';
  }

  return runStatus;
}

export function DeviceStatusPanel({
  devices,
  dataMode,
  busyDeviceId = null,
  onAction,
}: DeviceStatusPanelProps) {
  if (devices.length === 0) {
    return (
      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-aqua">Device Simulation</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.03em] text-carbon">
            模拟设备状态
          </h2>
        </div>
        <EmptyState
          title="暂无后端设备状态"
          description={
            dataMode === 'local'
              ? '当前使用本地演示模式，未连接后端模拟设备接口。'
              : '后端暂未返回模拟设备数据。'
          }
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-aqua">Device Simulation</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.03em] text-carbon">
            模拟设备状态
          </h2>
        </div>
        <p className="text-sm font-semibold text-steel">仅模拟控制，不接真实硬件</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {devices.map((device) => {
          const isDeviceBusy = busyDeviceId === device.id;

          return (
            <Card key={device.id} elevated className="bg-white p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-steel">
                    Device #{device.id}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-carbon">
                    {device.name}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold text-carbon">
                      运行状态：{formatRunStatus(device.runStatus)}
                    </span>
                    <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-carbon">
                      警示：{device.warningStatus ? '开启' : '关闭'}
                    </span>
                    <span className="rounded-full bg-carbon/5 px-3 py-1 text-xs font-semibold text-steel">
                      最近操作：{device.lastAction ? actionLabels[device.lastAction] ?? device.lastAction : '暂无'}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-semibold text-steel">
                    更新时间：{formatDateTime(device.updatedAt, { withYear: false })}
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:min-w-64">
                  {actionItems.map((item) => (
                    <Button
                      key={item.action}
                      variant="secondary"
                      size="sm"
                      disabled={isDeviceBusy || dataMode === 'local'}
                      onClick={() => onAction(device.id, item.action)}
                    >
                      {isDeviceBusy ? '执行中…' : item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
