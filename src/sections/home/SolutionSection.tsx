import { solutionTimeline } from '../../data/sections';
import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';

export function SolutionSection() {
  return (
    <SectionShell
      dark
      eyebrow="Solution"
      title="以模块化流程组织设备方案"
      description="页面中的能力描述用于项目展示，具体机械参数和性能指标以后续实测结果为准。"
      className="bg-[radial-gradient(circle_at_top_right,rgba(103,232,201,0.18),transparent_30%),#071516]"
    >
      <div className="grid gap-5 lg:grid-cols-4">
        {solutionTimeline.map((item) => (
          <Card
            key={item.phase}
            className="group bg-none border-white/15 bg-white/[0.065] text-white shadow-[0_22px_70px_rgba(0,0,0,0.22)] ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.095]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="font-display text-4xl font-semibold tracking-[-0.05em] text-mint">
                {item.phase}
              </span>
              <span className="mt-2 h-2 w-2 rounded-full bg-mint opacity-70 transition group-hover:opacity-100" />
            </div>
            <h3 className="mt-8 font-display text-xl font-semibold tracking-[-0.03em] text-white">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/76">{item.description}</p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
