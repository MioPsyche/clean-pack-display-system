import { applicationScenarios } from '../../data/sections';
import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';

export function ApplicationScenariosSection() {
  return (
    <SectionShell
      eyebrow="Scenario"
      title="围绕轻量化场景构建展示价值"
      description="项目 V1.0 重点服务比赛展示、样机说明和合作意向收集，不承诺未验证的商业量产能力。"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {applicationScenarios.map((scenario, index) => (
          <Card key={scenario.title} className="min-h-64 bg-white">
            <span className="font-display text-5xl font-semibold text-aqua/20">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-6 font-display text-xl font-semibold text-carbon">{scenario.title}</h3>
            <p className="mt-4 text-sm leading-7 text-steel">{scenario.description}</p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
