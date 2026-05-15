import { Link } from 'react-router-dom';
import type { NavigationItem } from '../../types/project';

type MobileNavProps = {
  items: NavigationItem[];
  onNavigate: () => void;
};

export function MobileNav({ items, onNavigate }: MobileNavProps) {
  return (
    <div className="border-t border-white/40 bg-white/[0.68] px-4 py-3 shadow-lg backdrop-blur-2xl backdrop-saturate-150 sm:px-6 lg:hidden">
      <nav className="mx-auto grid max-w-7xl gap-2 rounded-[1.5rem] border border-white/55 bg-white/[0.72] p-2 shadow-sm backdrop-blur-2xl backdrop-saturate-150">
        {items.map((item) => (
          item.href.startsWith('/') ? (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className="rounded-2xl border border-carbon/10 bg-carbon px-4 py-3 text-sm font-semibold text-white transition-[background-color,border-color,color] duration-200 hover:bg-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
            >
              {item.label}
            </Link>
          ) : (
            <a
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-800 transition-[background-color,border-color,color] duration-200 hover:border-aqua/20 hover:bg-white/[0.86] hover:text-carbon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
            >
              {item.label}
            </a>
          )
        ))}
        <Link
          to="/admin"
          onClick={onNavigate}
          className="rounded-2xl border border-aqua/15 bg-white/[0.72] px-4 py-3 text-sm font-semibold text-carbon transition-[background-color,border-color,color] duration-200 hover:border-aqua/30 hover:bg-white/[0.9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
        >
          本地后台
        </Link>
        <a
          href="#contact"
          onClick={onNavigate}
          className="rounded-2xl bg-carbon px-4 py-3 text-sm font-semibold text-white transition-[background-color,border-color,color] duration-200 hover:bg-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
        >
          预约演示
        </a>
      </nav>
    </div>
  );
}
