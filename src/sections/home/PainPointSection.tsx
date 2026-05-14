import { painPoints } from '../../data/sections';
import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';

export function PainPointSection() {
  return (
    <SectionShell
      id="solution"
      eyebrow="Problem"
      title="从叶菜采后处理痛点出发"
      description="本项目面向比赛展示和样机验证，不夸大商业化指标，重点表达流程连续化、洁净化和小型场景适配价值。"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {painPoints.map((point) => (
          <Card key={point.title} elevated className="group transition duration-300 hover:-translate-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua">{point.tag}</p>
            <h3 className="mt-5 font-display text-2xl font-semibold text-carbon">{point.title}</h3>
            <p className="mt-4 text-sm leading-7 text-steel">{point.description}</p>
            <div className="mt-8 h-1.5 rounded-full bg-carbon/5">
              <div className="h-full w-1/2 rounded-full bg-aqua transition-all duration-500 group-hover:w-full" />
            </div>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
