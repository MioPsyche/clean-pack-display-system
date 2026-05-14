import { projectProfile } from '../../data/projectProfile';
import { Badge } from '../../components/ui/Badge';
import { buttonStyles } from '../../components/ui/Button';

const heroStats = [
  { label: '系统版本', value: 'V1.0' },
  { label: '参数状态', value: '待实测' },
  { label: '数据模式', value: '本地演示' },
];

export function HeroSection() {
  return (
    <section
      id="overview"
      className="relative isolate scroll-mt-24 overflow-hidden bg-[linear-gradient(135deg,#F8FBFC_0%,#EEF7F4_46%,#FFFFFF_100%)] px-4 pb-20 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pb-28 lg:pt-24"
    >
      <div className="absolute inset-0 bg-industrial-grid bg-[length:64px_64px] opacity-55" />
      <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-mint/24 blur-3xl" />
      <div className="absolute right-[-10rem] top-[-6rem] h-[34rem] w-[34rem] rounded-full bg-aqua/18 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-40 w-[min(70rem,120vw)] -translate-x-1/2 rounded-full bg-white/[0.78] blur-3xl" />
      <div className="absolute right-0 top-0 hidden h-full w-1/2 bg-[linear-gradient(135deg,transparent,rgba(15,163,161,0.14))] lg:block" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="max-w-3xl">
          <Badge className="bg-white/[0.7]">Engineering Showcase</Badge>
          <h1 className="mt-6 max-w-4xl font-display text-[2.55rem] font-semibold leading-[1.03] tracking-[-0.06em] text-carbon text-balance sm:text-6xl lg:text-7xl">
            {projectProfile.shortName}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-graphite/82 sm:text-xl">
            {projectProfile.subtitle}
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-steel sm:text-base">
            {projectProfile.description}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className={buttonStyles({ size: 'lg', className: 'w-full px-8 sm:w-auto' })}>
              预约项目演示
            </a>
            <a
              href="#structure"
              className={buttonStyles({ variant: 'secondary', size: 'lg', className: 'w-full px-8 sm:w-auto' })}
            >
              查看设备结构
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.65rem] border border-white/80 bg-white/[0.78] p-4 shadow-panel-soft backdrop-blur-xl ring-1 ring-carbon/5 sm:p-5"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-steel">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-carbon">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="absolute -inset-4 rounded-[3rem] bg-[conic-gradient(from_160deg,rgba(103,232,201,0.34),rgba(15,163,161,0.08),rgba(255,255,255,0.18),rgba(103,232,201,0.34))] blur-2xl sm:-inset-5" />
          <div className="absolute -right-6 top-12 hidden h-28 w-28 rounded-full border border-aqua/25 bg-white/[0.54] backdrop-blur-xl lg:block" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,#071516,#0B2730)] p-2.5 shadow-glow ring-1 ring-aqua/20 sm:rounded-[2.75rem] sm:p-3">
            <div className="pointer-events-none absolute inset-2.5 z-10 rounded-[1.55rem] ring-1 ring-white/35 sm:inset-3 sm:rounded-[2.25rem]" />
            <div className="absolute left-4 top-4 z-20 rounded-full border border-white/60 bg-white/[0.88] px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-carbon shadow-panel-soft backdrop-blur sm:left-6 sm:top-6 sm:px-4 sm:text-xs">
              Prototype Display
            </div>
            <img
              src="/images/hero-machine.png"
              alt="智能叶菜洁净化包装设备主视觉图"
              width="1536"
              height="1024"
              fetchPriority="high"
              className="aspect-[4/3] w-full rounded-[1.55rem] bg-white object-contain p-2 sm:aspect-[3/2] sm:rounded-[2.25rem] sm:p-4"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/images/hero-device-placeholder.svg';
              }}
            />
            <div className="absolute bottom-6 right-6 z-20 hidden rounded-3xl border border-white/55 bg-white/[0.88] p-4 shadow-panel backdrop-blur-xl sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-aqua">Local Demo</p>
              <p className="mt-1 text-sm font-semibold text-carbon">静态数据 + localStorage</p>
            </div>
          </div>
          <div className="relative -mt-7 ml-3 mr-3 rounded-3xl border border-white/70 bg-white/[0.92] p-4 shadow-panel backdrop-blur-xl sm:absolute sm:-bottom-7 sm:left-8 sm:right-8 sm:ml-0 sm:mr-0 sm:p-5">
            <p className="text-sm font-semibold text-carbon">项目定位</p>
            <p className="mt-1 text-sm leading-6 text-steel">{projectProfile.positioning}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
