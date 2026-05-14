import { useState } from 'react';
import { Link } from 'react-router-dom';
import { navigationItems, projectProfile } from '../../data/projectProfile';
import { cn } from '../../utils/cn';
import { buttonStyles } from '../ui/Button';
import { MobileNav } from './MobileNav';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navLinkClassName =
    'shrink-0 rounded-full px-3 py-2 text-xs font-semibold text-carbon/72 transition-[background-color,color,border-color,box-shadow] duration-200 hover:bg-carbon hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua xl:px-3.5 xl:text-sm';

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] border-b border-slate-900/10 bg-white/[0.84] shadow-[0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-10">
        <Link
          to="/"
          className="group flex min-w-0 shrink-0 items-center gap-3 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#071516,#0A4250)] text-lg font-black text-mint shadow-panel-soft ring-1 ring-white/70 transition-transform duration-200 group-hover:-translate-y-0.5">
            叶
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-bold tracking-[-0.02em] text-carbon sm:text-base">
              {projectProfile.shortName}
            </span>
            <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-steel sm:block">
              Dachuang Showcase V1.0
            </span>
          </span>
        </Link>

        <nav
          aria-label="首页主导航"
          className="hidden min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto rounded-full border border-carbon/10 bg-white/[0.74] p-1 shadow-panel-soft backdrop-blur-xl lg:flex"
        >
          {navigationItems.map((item) => (
            item.href.startsWith('/') ? (
              <Link key={item.href} to={item.href} className={navLinkClassName}>
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className={navLinkClassName}>
                {item.label}
              </a>
            )
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <a href="#contact" className={buttonStyles({ variant: 'primary', size: 'sm' })}>
            预约演示
          </a>
        </div>

        <button
          type="button"
          aria-label="打开移动端导航"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-carbon/10 bg-white shadow-panel-soft transition-[background-color,border-color,box-shadow] duration-200 hover:border-aqua/40 hover:bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua lg:hidden"
        >
          <span className="space-y-1.5">
            <span className={cn('block h-0.5 w-5 bg-carbon transition-transform duration-200', isOpen && 'translate-y-2 rotate-45')} />
            <span className={cn('block h-0.5 w-5 bg-carbon transition-opacity duration-200', isOpen && 'opacity-0')} />
            <span className={cn('block h-0.5 w-5 bg-carbon transition-transform duration-200', isOpen && '-translate-y-2 -rotate-45')} />
          </span>
        </button>
      </div>
      {isOpen ? <MobileNav items={navigationItems} onNavigate={() => setIsOpen(false)} /> : null}
    </header>
  );
}
