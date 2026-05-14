import { prototypeHighlights } from '../../data/sections';
import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';

export function DeviceStructureSection() {
  return (
    <SectionShell
      id="structure"
      eyebrow="Structure"
      title="SolidWorks 爆炸图与设备结构展示"
      description="结构展示区使用已提供的设备爆炸图素材，重点呈现装配关系、关键模块和后续样机说明空间。"
      className="bg-[linear-gradient(180deg,rgba(246,251,249,0)_0%,rgba(238,247,244,0.92)_100%)]"
    >
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.28fr)_minmax(340px,0.72fr)]">
        <Card elevated className="overflow-hidden p-3">
          <div className="relative overflow-hidden rounded-[1.85rem] bg-carbon">
            <div className="absolute left-5 top-5 z-10 rounded-full border border-white/50 bg-white/88 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-carbon backdrop-blur">
              Exploded View
            </div>
            <img
              src="/images/machine-exploded_1.png"
              alt="智能叶菜洁净化包装设备 SolidWorks 爆炸图"
              width="1536"
              height="1024"
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/images/solidworks-exploded-placeholder.svg';
              }}
            />
          </div>
          <div className="grid gap-3 px-3 pb-3 pt-5 text-sm leading-6 text-steel sm:grid-cols-3">
            <p>
              <span className="block font-semibold text-carbon">装配关系</span>
              展示框架、传动件与功能模块的空间关系。
            </p>
            <p>
              <span className="block font-semibold text-carbon">参数原则</span>
              未实测指标继续标注为“待实测”。
            </p>
            <p>
              <span className="block font-semibold text-carbon">展示用途</span>
              面向答辩讲解和后续材料整理。
            </p>
          </div>
        </Card>

        <div className="grid gap-4">
          {prototypeHighlights.map((item) => (
            <Card key={item.title} className="border-white/75 bg-white/88">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-aqua">Module Note</p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.03em] text-carbon">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-steel">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-7 md:grid-cols-2">
        <Card elevated className="overflow-hidden p-3">
          <img
            src="/images/hero-machine.png"
            alt="智能叶菜洁净化包装设备物理样机图"
            width="1536"
            height="1024"
            loading="lazy"
            className="aspect-[3/2] w-full rounded-[1.7rem] bg-white object-contain"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/machine-real.jpg';
            }}
          />
          <div className="px-3 pb-3 pt-5">
            <p className="text-sm font-semibold text-aqua">物理样机图</p>
            <p className="mt-2 text-sm leading-7 text-steel">
              用于展示设备整体外观和样机阶段成果，实际运行指标以后续测试记录为准。
            </p>
          </div>
        </Card>

        <Card elevated className="overflow-hidden p-3">
          <img
            src="/images/structure-detail.png"
            alt="智能叶菜洁净化包装设备结构细节图"
            width="1536"
            height="1024"
            loading="lazy"
            className="aspect-[3/2] w-full rounded-[1.7rem] bg-white object-contain"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/prototype-placeholder.svg';
            }}
          />
          <div className="px-3 pb-3 pt-5">
            <p className="text-sm font-semibold text-aqua">结构细节图</p>
            <p className="mt-2 text-sm leading-7 text-steel">
              用于辅助说明框架、传动、控制和功能模块的局部设计，不替代实测参数。
            </p>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}
