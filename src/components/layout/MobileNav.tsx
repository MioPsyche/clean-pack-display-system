import type { NavigationItem } from '../../types/project';

type MobileNavProps = {
  items: NavigationItem[];
  onNavigate: () => void;
};

export function MobileNav({ items, onNavigate }: MobileNavProps) {
  return (
    <div className="border-t border-carbon/10 bg-white px-5 py-5 shadow-panel md:hidden">
      <nav className="grid gap-2">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="rounded-2xl px-4 py-3 text-sm font-semibold text-carbon transition hover:bg-mist"
          >
            {item.label}
          </a>
        ))}
        <a
          href="/admin"
          className="mt-2 rounded-2xl bg-carbon px-4 py-3 text-sm font-semibold text-white"
        >
          本地后台
        </a>
      </nav>
    </div>
  );
}
