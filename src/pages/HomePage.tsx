import { SiteFooter } from '../components/layout/SiteFooter';
import { SiteHeader } from '../components/layout/SiteHeader';
import { AchievementSection } from '../sections/home/AchievementSection';
import { ApplicationScenariosSection } from '../sections/home/ApplicationScenariosSection';
import { ContactActionSection } from '../sections/home/ContactActionSection';
import { DeviceStructureSection } from '../sections/home/DeviceStructureSection';
import { HeroSection } from '../sections/home/HeroSection';
import { InnovationSection } from '../sections/home/InnovationSection';
import { PainPointSection } from '../sections/home/PainPointSection';
import { PrototypeSection } from '../sections/home/PrototypeSection';
import { SolutionSection } from '../sections/home/SolutionSection';
import { TeamSection } from '../sections/home/TeamSection';
import { TechSpecsSection } from '../sections/home/TechSpecsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#F6FBF9_0%,#EEF7F4_40%,#F8FBFC_100%)] text-carbon">
      <SiteHeader />
      <main className="overflow-x-hidden">
        <HeroSection />
        <PainPointSection />
        <SolutionSection />
        <DeviceStructureSection />
        <PrototypeSection />
        <InnovationSection />
        <TechSpecsSection />
        <ApplicationScenariosSection />
        <AchievementSection />
        <TeamSection />
        <ContactActionSection />
      </main>
      <SiteFooter />
    </div>
  );
}
