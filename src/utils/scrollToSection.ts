const DEFAULT_NAVBAR_OFFSET = 96;

export function scrollToSection(href: string, navbarOffset = DEFAULT_NAVBAR_OFFSET) {
  if (!href.startsWith('#')) {
    return;
  }

  const sectionId = href.slice(1);
  const section = document.getElementById(sectionId);

  if (!section) {
    return;
  }

  const title = section.querySelector('h1, h2');
  const target = title instanceof HTMLElement ? title : section;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarOffset;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: 'smooth',
  });

  window.history.replaceState(null, '', href);
}
