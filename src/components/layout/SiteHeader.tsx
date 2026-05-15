import { type MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { navigationItems, projectProfile } from '../../data/projectProfile';
import { cn } from '../../utils/cn';
import { scrollToSection } from '../../utils/scrollToSection';
import { MobileNav } from './MobileNav';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navLinkClassName =
    'shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold text-carbon/78 transition-[background-color,color,box-shadow] duration-200 hover:bg-white/[0.62] hover:text-carbon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua xl:px-4';

  function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    scrollToSection(href);
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] border-b border-aqua/15 bg-[#EAF8F5]/[0.82] text-carbon shadow-[0_10px_34px_rgba(7,21,22,0.06)] backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex min-w-0 shrink-0 items-center gap-3 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] bg-[linear-gradient(135deg,#071516,#0A2D35)] text-xl font-black text-mint shadow-sm ring-1 ring-white/70 transition-transform duration-200 group-hover:-translate-y-0.5">
            叶
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-[0.95rem] font-bold tracking-[-0.02em] text-carbon sm:text-base">
              {projectProfile.shortName}
            </span>
            <span className="hidden text-xs font-medium tracking-[-0.01em] text-steel sm:block">
              Dachuang Showcase V1.0
            </span>
          </span>
        </Link>

        <nav
          aria-label="首页主导航"
          className="hidden min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto lg:flex"
        >
          {navigationItems.map((item) => (
            item.href.startsWith('/') ? (
              <Link key={item.href} to={item.href} className={navLinkClassName}>
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className={navLinkClassName}
                onClick={(event) => handleAnchorClick(event, item.href)}
              >
                {item.label}
              </a>
            )
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            to="/admin"
            className="inline-flex h-12 items-center justify-center rounded-full border border-aqua/18 bg-white/[0.46] px-5 text-sm font-semibold text-carbon shadow-sm backdrop-blur-xl transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-aqua/35 hover:bg-white/[0.72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
          >
            本地后台
          </Link>
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#071516,#0A4250)] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(7,21,22,0.16)] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(7,21,22,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
            onClick={(event) => handleAnchorClick(event, '#contact')}
          >
            预约演示
          </a>
        </div>

        <button
          type="button"
          aria-label="打开移动端导航"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-aqua/15 bg-white/[0.58] shadow-sm backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-200 hover:border-aqua/40 hover:bg-white/[0.88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua lg:hidden"
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
