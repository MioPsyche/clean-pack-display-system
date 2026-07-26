import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';

export type ConsultationTypeFilter = 'all' | 'demo' | 'inquiry';

type AdminToolbarProps = {
  consultationType: ConsultationTypeFilter;
  keyword: string;
  resultCount: number;
  dataMode: 'backend' | 'local';
  isLoading?: boolean;
  isClearing?: boolean;
  onConsultationTypeChange: (value: ConsultationTypeFilter) => void;
  onKeywordChange: (value: string) => void;
  onRefresh: () => void;
  onClearAll: () => void;
  onExportCsv: () => void;
};

export function AdminToolbar({
  consultationType,
  keyword,
  resultCount,
  dataMode,
  isLoading = false,
  isClearing = false,
  onConsultationTypeChange,
  onKeywordChange,
  onRefresh,
  onClearAll,
  onExportCsv,
}: AdminToolbarProps) {
  const filterItems: Array<{ label: string; value: ConsultationTypeFilter }> = [
    { label: '全部记录', value: 'all' },
    { label: '预约演示', value: 'demo' },
    { label: '询价意向', value: 'inquiry' },
  ];

  return (
    <section className="rounded-[2.25rem] border border-white/70 bg-white/88 p-5 shadow-panel backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-2 border-b border-carbon/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-aqua">Control Panel</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-carbon">
            后台记录管理
          </h2>
        </div>
        <div className="w-fit rounded-2xl bg-mist px-4 py-2 text-sm font-semibold text-carbon tabular-nums">
          当前结果：{resultCount} 条
        </div>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-carbon">咨询类型</span>
            <div className="grid rounded-2xl border border-carbon/10 bg-mist/70 p-1 sm:grid-cols-3">
              {filterItems.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onConsultationTypeChange(item.value)}
                  className={cn(
                    'rounded-xl px-4 py-2.5 text-sm font-semibold transition-[background-color,color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua',
                    consultationType === item.value
                      ? 'bg-carbon text-white shadow-panel-soft'
                      : 'text-steel hover:bg-white hover:text-carbon',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="关键词搜索"
            name="admin-keyword"
            type="search"
            autoComplete="off"
            value={keyword}
            placeholder="搜索姓名、联系方式或单位…"
            onChange={(event) => onKeywordChange(event.target.value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[26rem]">
          <Button variant="secondary" disabled={isLoading} onClick={onRefresh}>
            {isLoading ? '刷新中…' : '刷新数据'}
          </Button>
          <Button variant="secondary" disabled={isLoading} onClick={onExportCsv}>
            导出 CSV
          </Button>
          <Button
            variant="secondary"
            className="border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 focus-visible:outline-red-500"
            disabled={isLoading || isClearing}
            onClick={onClearAll}
          >
            {isClearing ? '清空中…' : '清空全部'}
          </Button>
        </div>
      </div>

      <p className="mt-5 rounded-2xl bg-mist/70 px-4 py-3 text-xs leading-5 text-steel">
        {dataMode === 'backend'
          ? '后台数据来自本地 Express + SQLite 后端。清空操作会调用后端 DELETE 接口。'
          : '当前使用本地演示模式。后台数据来自当前浏览器 localStorage，清空操作只删除本机浏览器中的演示记录。'}
      </p>
    </section>
  );
}
