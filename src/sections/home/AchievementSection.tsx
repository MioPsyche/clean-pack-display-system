import { achievements } from '../../data/achievements';
import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';

export function AchievementSection() {
  return (
    <SectionShell
      id="achievements"
      dark
      eyebrow="Achievement"
      title="成果展示保留可更新空间"
      description="竞赛、软著、专利和样机材料在数据文件中集中维护，未确定内容使用 TODO。"
    >
      <Card className="bg-none mb-8 overflow-hidden border-white/15 bg-white/[0.065] p-3 text-white shadow-[0_22px_70px_rgba(0,0,0,0.22)] ring-1 ring-white/10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <img
            src="/images/structure-detail.png"
            alt="智能叶菜洁净化包装设备结构细节展示"
            width="1536"
            height="1024"
            loading="lazy"
            className="aspect-[3/2] w-full rounded-[1.6rem] bg-white object-contain"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/prototype-placeholder.svg';
            }}
          />
          <div className="px-3 pb-3 lg:px-4 lg:pb-0">
            <p className="text-sm font-semibold text-mint">阶段成果素材</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
              结构细节与模块展示
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/76">
              当前成果展示侧重设备结构、样机素材和软件系统整理。涉及测试指标、获奖、专利或论文的内容仍以实际材料为准。
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {achievements.map((achievement) => (
          <Card
            key={`${achievement.type}-${achievement.title}`}
            className="bg-none min-h-44 border-white/15 bg-white/[0.065] text-white shadow-[0_22px_70px_rgba(0,0,0,0.2)] ring-1 ring-white/10 transition-[background-color,border-color,box-shadow] duration-300 hover:border-mint/25 hover:bg-white/[0.095] hover:shadow-[0_26px_76px_rgba(0,0,0,0.26)]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">{achievement.type}</p>
            <h3 className="mt-5 font-display text-xl font-semibold leading-snug tracking-[-0.03em] text-white">
              {achievement.title}
            </h3>
            <p className="mt-5 w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/78">
              {achievement.status}
            </p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
