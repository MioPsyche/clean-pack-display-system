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
      className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#F6FBF9_0%,#E8F8F5_48%,#F9FCFB_100%)] px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="absolute inset-0 bg-industrial-grid bg-[length:64px_64px] opacity-70" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-mint/24 blur-3xl" />
      <div className="absolute right-0 top-0 h-[34rem] w-[34rem] rounded-full bg-aqua/16 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-40 w-[70rem] -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(135deg,transparent,rgba(15,163,161,0.14))]" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="max-w-3xl">
          <Badge>Engineering Showcase</Badge>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-carbon text-balance sm:text-6xl lg:text-7xl">
            {projectProfile.shortName}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite/78 sm:text-xl">
            {projectProfile.subtitle}
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-steel sm:text-base">
            {projectProfile.description}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className={buttonStyles({ size: 'lg', className: 'px-8' })}>
              预约项目演示
            </a>
            <a
              href="#structure"
              className={buttonStyles({ variant: 'secondary', size: 'lg', className: 'px-8' })}
            >
              查看设备结构
            </a>
          </div>

          <div className="mt-11 grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.65rem] border border-white/70 bg-white/72 p-5 shadow-panel-soft backdrop-blur-xl ring-1 ring-carbon/5"
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

        <div className="relative">
          <div className="absolute -inset-5 rounded-[3.25rem] bg-[conic-gradient(from_160deg,rgba(103,232,201,0.36),rgba(15,163,161,0.08),rgba(163,230,53,0.22),rgba(103,232,201,0.36))] blur-2xl" />
          <div className="absolute -right-6 top-12 hidden h-28 w-28 rounded-full border border-aqua/25 bg-white/54 backdrop-blur-xl lg:block" />
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/80 bg-carbon p-3 shadow-glow ring-1 ring-aqua/20">
            <div className="pointer-events-none absolute inset-3 z-10 rounded-[2.25rem] ring-1 ring-white/45" />
            <div className="absolute left-6 top-6 z-20 rounded-full border border-white/60 bg-white/86 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-carbon shadow-panel-soft backdrop-blur">
              Prototype Display
            </div>
            <img
              src="/images/hero-machine.png"
              alt="智能叶菜洁净化包装设备主视觉图"
              width="1536"
              height="1024"
              className="aspect-[3/2] w-full rounded-[2.25rem] object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/images/hero-device-placeholder.svg';
              }}
            />
            <div className="absolute bottom-6 right-6 z-20 hidden rounded-3xl border border-white/55 bg-white/88 p-4 shadow-panel backdrop-blur-xl sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-aqua">Local Demo</p>
              <p className="mt-1 text-sm font-semibold text-carbon">静态数据 + localStorage</p>
            </div>
          </div>
          <div className="relative -mt-8 ml-4 mr-4 rounded-3xl border border-white/60 bg-white/90 p-5 shadow-panel backdrop-blur-xl sm:absolute sm:-bottom-7 sm:left-8 sm:right-8 sm:ml-0 sm:mr-0">
            <p className="text-sm font-semibold text-carbon">项目定位</p>
            <p className="mt-1 text-sm leading-6 text-steel">{projectProfile.positioning}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
