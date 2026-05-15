import { techSpecs } from '../../data/specs';
import { SectionShell } from '../../components/layout/SectionShell';

export function TechSpecsSection() {
  return (
    <SectionShell
      id="specs"
      dark
      eyebrow="Specs"
      title="技术参数采用透明标注"
      description="未完成实验验证的指标不填写虚假数值，统一保留“待实测”或 TODO。"
      className="bg-[linear-gradient(135deg,#071516_0%,#10201F_55%,#0A2A28_100%)]"
    >
      <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.07] shadow-[0_26px_80px_rgba(0,0,0,0.22)] backdrop-blur sm:rounded-[2rem]">
        <div className="hidden grid-cols-[1fr_1fr_1.2fr] gap-0 border-b border-white/10 bg-white/10 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-mint sm:grid">
          <span>参数项</span>
          <span>当前值</span>
          <span>说明</span>
        </div>
        <div className="divide-y divide-white/10">
          {techSpecs.map((spec) => (
            <div
              key={spec.name}
              className="grid gap-3 px-4 py-5 text-sm text-white/82 sm:grid-cols-[1fr_1fr_1.2fr] sm:px-5"
            >
              <span className="font-semibold text-white">
                <span className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mint/70 sm:hidden">
                  参数项
                </span>
                {spec.name}
              </span>
              <span className="break-words">
                <span className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mint/70 sm:hidden">
                  当前值
                </span>
                {spec.value}
              </span>
              <span className="break-words text-white/62">
                <span className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mint/70 sm:hidden">
                  说明
                </span>
                {spec.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
