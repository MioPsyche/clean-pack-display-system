import { structureVideos } from '../../data/homeMedia';
import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';
import { VideoShowcase } from '../../components/ui/VideoShowcase';

export function DeviceStructureSection() {
  return (
    <SectionShell
      id="structure"
      eyebrow="Structure"
      title="SolidWorks 爆炸图与设备结构展示"
      description="结构展示区使用已提供的设备爆炸图素材，重点呈现装配关系、关键模块和后续样机说明空间。"
      className="bg-[linear-gradient(180deg,rgba(246,251,249,0)_0%,rgba(238,247,244,0.92)_100%)]"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.28fr)_minmax(320px,0.72fr)] lg:gap-7">
        <Card elevated className="flex items-center overflow-hidden p-2.5 sm:p-3">
          <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,#071516,#0A2D35)] sm:rounded-[1.85rem]">
            <div className="absolute inset-0 bg-industrial-grid bg-[length:42px_42px] opacity-10" />
            <div className="absolute left-4 top-4 z-10 rounded-full border border-white/50 bg-white/[0.88] px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-carbon backdrop-blur sm:left-5 sm:top-5 sm:px-4 sm:text-xs">
              Exploded View
            </div>
            <img
              src="/images/machine-exploded_1.webp"
              alt="智能叶菜洁净化包装设备 SolidWorks 爆炸图"
              width="1536"
              height="1024"
              loading="lazy"
              className="relative aspect-[4/3] w-full bg-white object-contain p-2 sm:aspect-[3/2] sm:p-4"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/images/solidworks-exploded-placeholder.svg';
              }}
            />
          </div>
        </Card>

        <div className="grid gap-4">
          {structureVideos.map((item) => (
            <Card key={item.title} className="border-white/75 bg-white/[0.88] p-5 sm:p-6">
              <h3 className="mb-4 font-display text-xl font-semibold tracking-[-0.03em] text-carbon">
                {item.title}
              </h3>
              <VideoShowcase {...item} compact />
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:mt-7 lg:gap-7">
        <Card elevated className="overflow-hidden p-2.5 sm:p-3">
          <img
            src="/images/hero-machine.webp"
            alt="智能叶菜洁净化包装设备物理样机图"
            width="1536"
            height="1024"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-[1.45rem] bg-white object-contain p-2 sm:aspect-[3/2] sm:rounded-[1.7rem] sm:p-4"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/machine-real.jpg';
            }}
          />
          <div className="px-3 pb-3 pt-5">
            <h3 className="text-center font-display text-xl font-semibold text-aqua sm:text-2xl">物理样机图</h3>
          </div>
        </Card>

        <Card elevated className="overflow-hidden p-2.5 sm:p-3">
          <img
            src="/images/structure-detail.webp"
            alt="智能叶菜洁净化包装设备结构细节图"
            width="1536"
            height="1024"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-[1.45rem] bg-white object-contain p-2 sm:aspect-[3/2] sm:rounded-[1.7rem] sm:p-4"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/prototype-placeholder.svg';
            }}
          />
          <div className="px-3 pb-3 pt-5">
            <h3 className="text-center font-display text-xl font-semibold text-aqua sm:text-2xl">结构细节图</h3>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}
