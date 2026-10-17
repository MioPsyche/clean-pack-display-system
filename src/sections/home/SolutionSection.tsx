import { solutionTimeline } from '../../data/sections';
import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';

export function SolutionSection() {
  return (
    <SectionShell
      id="solution"
      dark
      eyebrow="Solution"
      title="以模块化流程组织设备方案"
      className="bg-[radial-gradient(circle_at_top_right,rgba(103,232,201,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,163,161,0.13),transparent_32%),#071516]"
    >
      <div className="relative">
        <div className="absolute left-0 top-12 hidden h-px w-full bg-gradient-to-r from-transparent via-mint/30 to-transparent lg:block" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {solutionTimeline.map((item) => (
            <Card
              key={item.phase}
              className="group relative bg-none border-white/15 bg-white/[0.065] text-white shadow-[0_22px_70px_rgba(0,0,0,0.22)] ring-1 ring-white/10 transition-[background-color,border-color,box-shadow] duration-300 hover:border-mint/25 hover:bg-white/[0.095] hover:shadow-[0_26px_76px_rgba(0,0,0,0.28)]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-4xl font-semibold tracking-[-0.05em] text-mint">
                  {item.phase}
                </span>
                <span className="mt-2 h-3 w-3 rounded-full border border-mint/40 bg-mint/80 opacity-80 shadow-[0_0_24px_rgba(103,232,201,0.45)] transition-opacity duration-200 group-hover:opacity-100" />
              </div>
              <h3 className="mt-8 font-display text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/76">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
