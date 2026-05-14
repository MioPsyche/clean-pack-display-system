import { Link } from 'react-router-dom';
import type { NavigationItem } from '../../types/project';

type MobileNavProps = {
  items: NavigationItem[];
  onNavigate: () => void;
};

export function MobileNav({ items, onNavigate }: MobileNavProps) {
  return (
    <div className="border-t border-carbon/10 bg-white/[0.96] px-4 py-4 shadow-panel backdrop-blur-2xl md:hidden">
      <nav className="grid gap-2">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold text-carbon transition-[background-color,border-color,color] duration-200 hover:border-aqua/20 hover:bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
          >
            {item.label}
          </a>
        ))}
        <Link
          to="/admin"
          onClick={onNavigate}
          className="mt-2 rounded-2xl bg-carbon px-4 py-3 text-sm font-semibold text-white transition-[background-color,box-shadow] duration-200 hover:bg-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
        >
          本地后台
        </Link>
      </nav>
    </div>
  );
}
