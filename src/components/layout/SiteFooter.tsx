import { Link } from 'react-router-dom';
import { projectProfile } from '../../data/projectProfile';

export function SiteFooter() {
  return (
    <footer className="bg-carbon px-5 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xl font-semibold">{projectProfile.shortName}</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">
            本项目页面用于大学生创新创业训练计划比赛展示，所有未完成实测的数据均以 TODO 或“待实测”标注。
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold text-white/70">
          <Link to="/">前台展示</Link>
          <Link to="/admin">本地模拟后台</Link>
          <a href="#contact">预约询价</a>
        </div>
      </div>
    </footer>
  );
}
