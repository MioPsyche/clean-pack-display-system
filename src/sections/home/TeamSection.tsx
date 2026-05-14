import { teamMembers } from '../../data/team';
import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';

export function TeamSection() {
  return (
    <SectionShell
      id="team"
      eyebrow="Team"
      title="团队分工清晰，便于答辩说明"
      description="团队成员姓名暂以 TODO 占位，后续替换为真实姓名、学院、年级与职责。"
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Card elevated className="overflow-hidden p-3">
          <div className="relative overflow-hidden rounded-[1.6rem] bg-carbon">
            <img
              src="/images/team-placeholder.svg"
              alt="团队照片占位，待替换为真实团队照片"
              className="w-full opacity-95"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/images/team-placeholder.svg';
              }}
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/86 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-carbon">团队照片待补充</p>
              <p className="mt-1 text-xs leading-5 text-steel">当前保留正式占位，不生成虚构团队图片。</p>
            </div>
          </div>
        </Card>
        <div className="grid gap-4">
          {teamMembers.map((member) => (
            <Card key={`${member.role}-${member.name}`} className="bg-white">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-carbon">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-aqua">{member.role}</p>
                </div>
                <span className="w-fit rounded-full bg-mist px-3 py-1 text-xs font-semibold text-carbon">
                  项目成员
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-steel">{member.responsibility}</p>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
