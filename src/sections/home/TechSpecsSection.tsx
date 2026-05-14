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
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/8">
        <div className="grid grid-cols-[1fr_1fr_1.2fr] gap-0 border-b border-white/10 bg-white/10 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-mint max-sm:hidden">
          <span>参数项</span>
          <span>当前值</span>
          <span>说明</span>
        </div>
        <div className="divide-y divide-white/10">
          {techSpecs.map((spec) => (
            <div
              key={spec.name}
              className="grid gap-3 px-5 py-5 text-sm text-white/82 sm:grid-cols-[1fr_1fr_1.2fr]"
            >
              <span className="font-semibold text-white">{spec.name}</span>
              <span>{spec.value}</span>
              <span className="text-white/62">{spec.note}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
