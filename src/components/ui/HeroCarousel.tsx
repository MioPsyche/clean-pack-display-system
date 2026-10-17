import { useEffect, useState } from 'react';
import { heroImages } from '../../data/homeMedia';
import { cn } from '../../utils/cn';

const controlStyle = 'flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 px-3 text-sm text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint';

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const autoPlaying = !paused && !hovered && !focused && !hidden && !reducedMotion;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    const onVisibilityChange = () => setHidden(document.hidden);
    media.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      media.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!autoPlaying) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroImages.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [autoPlaying]);

  return (
    <div
      role="region"
      aria-roledescription="轮播"
      aria-label="设备模型图片"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.55rem] bg-white sm:aspect-[3/2] sm:rounded-[2.25rem]">
        {heroImages.map((item, slideIndex) => (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            aria-hidden={slideIndex !== index}
            width="1536"
            height="1024"
            fetchPriority={slideIndex === 0 ? 'high' : 'auto'}
            loading={slideIndex === 0 ? 'eager' : 'lazy'}
            className={cn(
              'absolute inset-0 h-full w-full object-contain p-2 transition-opacity duration-500 sm:p-4',
              slideIndex === index ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            onError={(event) => {
              const image = event.currentTarget;
              if (image.dataset.fallback) return;
              image.dataset.fallback = 'true';
              image.src = '/images/hero-device-placeholder.svg';
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-1 pt-3 sm:px-2">
        <div className="flex items-center gap-1">
          <button type="button" className={controlStyle} aria-label="上一张模型图" onClick={() => setIndex((current) => (current - 1 + heroImages.length) % heroImages.length)}>
            <span aria-hidden="true">‹</span>
          </button>
          {heroImages.map((item, slideIndex) => (
            <button
              key={item.src}
              type="button"
              className="flex h-11 w-9 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint"
              aria-label={`查看第 ${slideIndex + 1} 张：${item.alt}`}
              aria-current={slideIndex === index ? 'true' : undefined}
              onClick={() => setIndex(slideIndex)}
            >
              <span aria-hidden="true" className={cn('h-2 rounded-full transition-[width,background-color]', slideIndex === index ? 'w-5 bg-mint' : 'w-2 bg-white/45')} />
            </button>
          ))}
          <button type="button" className={controlStyle} aria-label="下一张模型图" onClick={() => setIndex((current) => (current + 1) % heroImages.length)}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
        {reducedMotion ? (
          <span className="px-2 text-xs text-white/75">手动切换</span>
        ) : (
          <button type="button" className={controlStyle} onClick={() => setPaused((current) => !current)} aria-pressed={paused}>
            {paused ? '恢复轮播' : '暂停轮播'}
          </button>
        )}
      </div>
      <p className="sr-only" aria-live={autoPlaying ? 'off' : 'polite'} aria-atomic="true">
        第 {index + 1} 张，共 {heroImages.length} 张：{heroImages[index].alt}
      </p>
    </div>
  );
}
