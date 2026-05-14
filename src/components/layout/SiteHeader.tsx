import { useState } from 'react';
import { Link } from 'react-router-dom';
import { navigationItems, projectProfile } from '../../data/projectProfile';
import { cn } from '../../utils/cn';
import { buttonStyles } from '../ui/Button';
import { MobileNav } from './MobileNav';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-carbon/10 bg-mist/86 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-carbon text-lg font-black text-mint">
            叶
          </span>
          <span>
            <span className="block font-display text-sm font-bold text-carbon sm:text-base">
              {projectProfile.shortName}
            </span>
            <span className="hidden text-xs font-medium text-steel sm:block">Dachuang Showcase V1.0</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-carbon/75 transition hover:bg-white hover:text-carbon"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/admin" className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
            本地后台
          </Link>
          <a href="#contact" className={buttonStyles({ variant: 'primary', size: 'sm' })}>
            预约演示
          </a>
        </div>

        <button
          type="button"
          aria-label="打开移动端导航"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-carbon/10 bg-white md:hidden"
        >
          <span className="space-y-1.5">
            <span className={cn('block h-0.5 w-5 bg-carbon transition', isOpen && 'translate-y-2 rotate-45')} />
            <span className={cn('block h-0.5 w-5 bg-carbon transition', isOpen && 'opacity-0')} />
            <span className={cn('block h-0.5 w-5 bg-carbon transition', isOpen && '-translate-y-2 -rotate-45')} />
          </span>
        </button>
      </div>
      {isOpen ? <MobileNav items={navigationItems} onNavigate={() => setIsOpen(false)} /> : null}
    </header>
  );
}
