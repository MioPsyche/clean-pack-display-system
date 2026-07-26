import { achievements } from '../../data/achievements';
import { projectProfile } from '../../data/projectProfile';
import { applicationScenarios, innovations, painPoints } from '../../data/sections';
import { techSpecs } from '../../data/specs';
import { teamMembers } from '../../data/team';
import { Card } from '../ui/Card';

type ProjectDataPanelProps = {
  dataMode?: 'backend' | 'local';
};

export function ProjectDataPanel({ dataMode = 'local' }: ProjectDataPanelProps) {
  const groups = [
    { label: '痛点卡片', value: painPoints.length },
    { label: '创新点', value: innovations.length },
    { label: '技术参数', value: techSpecs.length },
    { label: '应用场景', value: applicationScenarios.length },
    { label: '成果记录', value: achievements.length },
    { label: '团队角色', value: teamMembers.length },
  ];

  return (
    <Card elevated className="bg-white">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-aqua">Project Data Overview</p>
          <h2 className="mt-2 break-words font-display text-2xl font-semibold text-carbon">
            {projectProfile.name}
          </h2>
          <p className="mt-3 max-w-3xl break-words text-sm leading-7 text-steel">
            {projectProfile.description}
          </p>
        </div>
        <span className="w-fit rounded-full bg-carbon px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
          {dataMode === 'backend' ? 'backend data' : 'local demo'}
        </span>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.label} className="rounded-3xl bg-mist p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">{group.label}</p>
            <p className="mt-3 font-display text-3xl font-semibold text-carbon">{group.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
