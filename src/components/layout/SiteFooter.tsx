import { Link } from 'react-router-dom';
import { projectProfile } from '../../data/projectProfile';

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#061018_0%,#071516_45%,#0A2D35_100%)] px-4 py-10 text-white sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-industrial-grid bg-[length:64px_64px] opacity-[0.08]" />
      <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-7 border-t border-white/10 pt-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="font-display text-xl font-semibold">{projectProfile.shortName}</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">
            本项目页面用于大学生创新创业训练计划比赛展示，所有未完成实测的数据均以 TODO 或“待实测”标注。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm font-semibold text-white/70">
          <Link className="rounded-full border border-white/10 px-4 py-2 transition hover:border-mint/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint" to="/">
            前台展示
          </Link>
          <Link className="rounded-full border border-white/10 px-4 py-2 transition hover:border-mint/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint" to="/admin">
            本地模拟后台
          </Link>
          <Link className="rounded-full border border-white/10 px-4 py-2 transition hover:border-mint/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint" to="/#contact">
            预约询价
          </Link>
        </div>
      </div>
    </footer>
  );
}
