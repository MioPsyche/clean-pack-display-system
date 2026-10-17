import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HeroCarousel } from '../src/components/ui/HeroCarousel';
import { VideoShowcase } from '../src/components/ui/VideoShowcase';
import { HeroSection } from '../src/sections/home/HeroSection';
import { DeviceStructureSection } from '../src/sections/home/DeviceStructureSection';
import { PrototypeSection } from '../src/sections/home/PrototypeSection';
import { heroImages, prototypeVideo, structureVideos } from '../src/data/homeMedia';

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function click(selector: string) {
  const button = container.querySelector<HTMLButtonElement>(selector);
  expect(button).not.toBeNull();
  act(() => button!.click());
}

const currentImage = () => container.querySelector('img[aria-hidden="false"]')?.getAttribute('src');

describe('首页模型轮播', () => {
  it('每五秒切换，支持前后循环、指示点和暂停恢复', () => {
    vi.useFakeTimers();
    act(() => root.render(createElement(HeroCarousel)));
    expect(currentImage()).toBe(heroImages[0].src);
    act(() => vi.advanceTimersByTime(5000));
    expect(currentImage()).toBe(heroImages[1].src);
    click('[aria-label="上一张模型图"]');
    click('[aria-label="上一张模型图"]');
    expect(currentImage()).toBe(heroImages[2].src);
    click('[aria-label="下一张模型图"]');
    expect(currentImage()).toBe(heroImages[0].src);
    click('[aria-label^="查看第 2 张"]');
    click('[aria-pressed]');
    act(() => vi.advanceTimersByTime(10000));
    expect(currentImage()).toBe(heroImages[1].src);
    click('[aria-pressed]');
    act(() => vi.advanceTimersByTime(5000));
    expect(currentImage()).toBe(heroImages[2].src);
  });

  it('悬停、聚焦和页面隐藏时暂停，离开后恢复', () => {
    vi.useFakeTimers();
    act(() => root.render(createElement(HeroCarousel)));
    const region = container.querySelector('[role="region"]')!;
    act(() => region.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));
    act(() => vi.advanceTimersByTime(6000));
    expect(currentImage()).toBe(heroImages[0].src);
    act(() => region.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })));
    const button = container.querySelector('button')!;
    act(() => button.focus());
    act(() => vi.advanceTimersByTime(6000));
    expect(currentImage()).toBe(heroImages[0].src);
    act(() => button.blur());
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    act(() => vi.advanceTimersByTime(6000));
    expect(currentImage()).toBe(heroImages[0].src);
    hidden.mockReturnValue(false);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    act(() => vi.advanceTimersByTime(5000));
    expect(currentImage()).toBe(heroImages[1].src);
  });

  it('遵循减少动态效果偏好，仍可手动切换', () => {
    vi.useFakeTimers();
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    vi.spyOn(media, 'matches', 'get').mockReturnValue(true);
    vi.spyOn(window, 'matchMedia').mockReturnValue(media);
    act(() => root.render(createElement(HeroCarousel)));
    act(() => vi.advanceTimersByTime(15000));
    expect(currentImage()).toBe(heroImages[0].src);
    expect(container.textContent).toContain('手动切换');
    click('[aria-label="下一张模型图"]');
    expect(currentImage()).toBe(heroImages[1].src);
  });

  it('图片错误使用兜底且不反复重试，卸载清理计时器和监听器', () => {
    vi.useFakeTimers();
    const removeListener = vi.spyOn(document, 'removeEventListener');
    act(() => root.render(createElement(HeroCarousel)));
    const image = container.querySelector('img')!;
    act(() => image.dispatchEvent(new Event('error')));
    expect(image.getAttribute('src')).toBe('/images/hero-device-placeholder.svg');
    const setSrc = vi.spyOn(image, 'src', 'set');
    act(() => image.dispatchEvent(new Event('error')));
    expect(setSrc).not.toHaveBeenCalled();
    act(() => root.render(null));
    expect(vi.getTimerCount()).toBe(0);
    expect(removeListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });
});

describe('视频展示', () => {
  const props = { title: '测试素材', placeholder: '视频待提供' };

  it('没有素材时不渲染 video 或虚假播放按钮', () => {
    act(() => root.render(createElement(VideoShowcase, props)));
    expect(container.textContent).toContain('视频待提供');
    expect(container.querySelector('video, button')).toBeNull();
    expect(structureVideos).toHaveLength(3);
    expect([...structureVideos, prototypeVideo].every((video) => !video.src)).toBe(true);
  });

  it('有素材时提供原生控件，点击同时请求播放与全屏', async () => {
    act(() => root.render(createElement(VideoShowcase, { ...props, src: '/test-only.mp4' })));
    const video = container.querySelector('video')!;
    const play = vi.spyOn(video, 'play').mockResolvedValue();
    const fullscreen = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(video, 'requestFullscreen', { value: fullscreen, configurable: true });
    expect(video.controls).toBe(true);
    await act(async () => container.querySelector('button')!.click());
    expect(play).toHaveBeenCalledOnce();
    expect(fullscreen).toHaveBeenCalledOnce();
  });

  it('全屏拒绝或不支持时保留内嵌视频并提示', async () => {
    act(() => root.render(createElement(VideoShowcase, { ...props, src: '/test-only.mp4' })));
    const video = container.querySelector('video')!;
    vi.spyOn(video, 'play').mockResolvedValue();
    Object.defineProperty(video, 'requestFullscreen', { value: vi.fn().mockRejectedValue(new Error('denied')), configurable: true });
    await act(async () => container.querySelector('button')!.click());
    expect(container.textContent).toContain('暂时无法进入全屏');
    expect(container.querySelector('video')).toBe(video);
    Object.defineProperty(video, 'requestFullscreen', { value: undefined });
    await act(async () => container.querySelector('button')!.click());
    expect(container.textContent).toContain('当前浏览器不支持');
  });

  it('加载失败显示错误，更换地址后清除旧错误', () => {
    act(() => root.render(createElement(VideoShowcase, { ...props, src: '/missing.mp4' })));
    act(() => container.querySelector('video')!.dispatchEvent(new Event('error')));
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('视频加载失败');
    expect(container.querySelector('button')).toBeNull();
    act(() => root.render(createElement(VideoShowcase, { ...props, src: '/new.mp4' })));
    expect(container.querySelector('video')?.getAttribute('src')).toBe('/new.mp4');
  });
});

it('首页文案与四处视频占位符合批注，保持 V1.1 和锚点', () => {
  act(() => root.render(createElement('div', null, createElement(HeroSection), createElement(DeviceStructureSection), createElement(PrototypeSection))));
  expect(container.textContent).toContain('Integrated Leaf and Vegetable Cleaning Machine');
  expect(container.textContent).toContain('V1.1');
  expect(container.textContent).not.toContain('数据模式');
  expect(container.textContent).not.toContain('参数状态');
  expect(container.textContent).not.toContain('Module Note');
  expect(container.textContent).toContain('实物测试视频待拍摄');
  expect(container.querySelector('a[href="#contact"]')?.textContent?.trim()).toBe('项目演示');
  expect(container.querySelectorAll('#structure h3')).toHaveLength(5);
});
