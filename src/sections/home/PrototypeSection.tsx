import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';
import { VideoShowcase } from '../../components/ui/VideoShowcase';
import { prototypeVideo } from '../../data/homeMedia';

export function PrototypeSection() {
  return (
    <SectionShell
      id="prototype"
      dark
      eyebrow="Prototype"
      title="物理样机与工程验证展示"
      className="bg-[radial-gradient(circle_at_20%_0%,rgba(103,232,201,0.13),transparent_32%),#071516]"
    >
      <Card className="bg-none overflow-hidden border-white/15 bg-white/[0.065] p-2.5 shadow-[0_22px_70px_rgba(0,0,0,0.22)] ring-1 ring-white/10 sm:p-3">
        <VideoShowcase {...prototypeVideo} dark />
      </Card>
    </SectionShell>
  );
}
