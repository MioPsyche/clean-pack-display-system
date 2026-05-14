import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';

export function PrototypeSection() {
  return (
    <SectionShell
      dark
      eyebrow="Prototype"
      title="物理样机与工程验证展示"
      description="本区域使用已提供的样机照片展示设备外观和阶段成果，具体测试数据继续以待实测标注。"
      className="bg-[radial-gradient(circle_at_20%_0%,rgba(103,232,201,0.13),transparent_32%),#071516]"
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
        <div className="space-y-5">
          <Card className="bg-none border-white/15 bg-white/[0.065] text-white shadow-[0_22px_70px_rgba(0,0,0,0.2)] ring-1 ring-white/10">
            <p className="text-sm font-semibold text-mint">样机状态</p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
              已接入样机展示素材
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/76">
              当前展示设备整体外观和结构细节，后续可继续补充运行过程、调试记录和测试结论。
            </p>
          </Card>
          <Card className="bg-none border-white/15 bg-white/[0.065] text-white shadow-[0_22px_70px_rgba(0,0,0,0.2)] ring-1 ring-white/10">
            <p className="text-sm font-semibold text-mint">答辩提示</p>
            <p className="mt-3 text-sm leading-7 text-white/76">
              对未完成测试的数据保持“待实测”标注，可以提升项目表达的工程可信度。
            </p>
          </Card>
        </div>
        <Card className="bg-none overflow-hidden border-white/15 bg-white/[0.065] p-2.5 shadow-[0_22px_70px_rgba(0,0,0,0.22)] ring-1 ring-white/10 sm:p-3">
          <img
            src="/images/structure-detail.png"
            alt="智能叶菜洁净化包装设备结构细节展示"
            width="1536"
            height="1024"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-[1.35rem] bg-white object-contain p-2 sm:aspect-[3/2] sm:rounded-[1.6rem] sm:p-4"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/prototype-placeholder.svg';
            }}
          />
        </Card>
      </div>
    </SectionShell>
  );
}
