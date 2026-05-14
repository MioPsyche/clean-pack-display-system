import { painPoints } from '../../data/sections';
import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';

export function PainPointSection() {
  return (
    <SectionShell
      id="background"
      eyebrow="Problem"
      title="从叶菜采后处理痛点出发"
      description="本项目面向比赛展示和样机验证，不夸大商业化指标，重点表达流程连续化、洁净化和小型场景适配价值。"
    >
      <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
        {painPoints.map((point, index) => (
          <Card
            key={point.title}
            elevated
            className="group relative overflow-hidden transition-[background-color,border-color,box-shadow] duration-300 hover:border-aqua/25 hover:bg-white hover:shadow-panel"
          >
            <span className="absolute right-5 top-5 font-display text-5xl font-semibold tracking-[-0.06em] text-carbon/[0.04]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua">{point.tag}</p>
            <h3 className="relative mt-5 font-display text-xl font-semibold leading-snug tracking-[-0.03em] text-carbon sm:text-2xl">
              {point.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-steel">{point.description}</p>
            <div className="mt-8 h-1.5 rounded-full bg-carbon/5">
              <div className="h-full w-1/2 rounded-full bg-aqua transition-[width] duration-500 group-hover:w-full" />
            </div>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
