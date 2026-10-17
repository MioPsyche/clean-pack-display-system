import { useRef, useState } from 'react';
import type { ShowcaseVideo } from '../../data/homeMedia';
import { cn } from '../../utils/cn';

type VideoShowcaseProps = ShowcaseVideo & { dark?: boolean; compact?: boolean };

export function VideoShowcase(props: VideoShowcaseProps) {
  // 更换素材时重置错误状态，避免旧视频的错误影响新视频。
  return <VideoContent key={props.src ?? 'pending'} {...props} />;
}

function VideoContent({ title, src, poster, placeholder, dark = false, compact = false }: VideoShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [notice, setNotice] = useState('');

  function playFullscreen() {
    const video = videoRef.current;
    if (!video) return;
    setNotice('');
    // 两个调用均在用户点击内触发，避免等待播放后丢失全屏的用户手势权限。
    void video.play().catch(() => setNotice('播放未能启动，请使用视频播放控件重试。'));
    if (video.requestFullscreen) {
      void video.requestFullscreen().catch(() => setNotice('暂时无法进入全屏，可继续在页面内播放。'));
    } else {
      setNotice('当前浏览器不支持此全屏入口，请使用视频自带控件或在页面内播放。');
    }
  }

  return (
    <div className="min-w-0">
      {src && !failed ? (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            aria-label={`${title}视频`}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full rounded-2xl bg-carbon object-contain"
            onError={() => setFailed(true)}
          />
          <button
            type="button"
            onClick={playFullscreen}
            className={cn('mt-3 min-h-11 rounded-full border px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua', dark ? 'border-white/25 text-white hover:bg-white/10' : 'border-aqua/30 text-carbon hover:bg-aqua/10')}
          >
            全屏播放
          </button>
        </>
      ) : (
        <div
          className={cn(
            'flex w-full flex-col items-center justify-center rounded-2xl border p-4 text-center',
            compact ? 'aspect-video lg:aspect-[3/1]' : 'aspect-video',
            dark ? 'border-white/15 bg-white/[0.045] text-white/80' : 'border-aqua/15 bg-frost text-graphite/80',
          )}
        >
          <svg aria-hidden="true" viewBox="0 0 32 24" fill="none" className={cn('mb-3 h-7 w-9', dark ? 'text-mint/70' : 'text-aqua/70')}>
            <rect x="1" y="1" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="m23 9 8-5v16l-8-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <p role={failed ? 'alert' : undefined} className="text-sm font-medium sm:text-base">
            {failed ? '视频加载失败，请刷新页面或稍后重试。' : placeholder}
          </p>
        </div>
      )}
      <p role="status" className={cn('text-sm leading-6', notice && !failed ? 'mt-2' : 'sr-only', dark ? 'text-white/80' : 'text-steel')}>
        {failed ? '' : notice}
      </p>
    </div>
  );
}
