import { innovations } from '../../data/sections';
import { SectionShell } from '../../components/layout/SectionShell';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export function InnovationSection() {
  return (
    <SectionShell
      eyebrow="Innovation"
      title="核心创新点围绕工程落地与展示闭环"
      description="创新点不只描述机械结构，也包含展示系统、参数规范和比赛演示流程的完整性。"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
        {innovations.map((item) => (
          <Card
            key={item.title}
            elevated
            className="relative overflow-hidden transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-aqua/20"
          >
            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[3rem] bg-[linear-gradient(135deg,rgba(15,163,161,0.14),rgba(232,248,245,0.8))]" />
            <Badge tone="leaf">{item.tag}</Badge>
            <h3 className="relative mt-6 font-display text-xl font-semibold leading-snug tracking-[-0.03em] text-carbon sm:text-2xl">
              {item.title}
            </h3>
            <p className="relative mt-4 text-sm leading-7 text-steel">{item.description}</p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
