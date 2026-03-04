import CinematicHero from '../components/CinematicHero';
import FloatingBookingBar from '../components/FloatingBookingBar';
import Rooms from '../components/Rooms';
import ImmersiveScrollStory from '../components/ImmersiveScrollStory';
import DestinationMagazine from '../components/DestinationMagazine';
import Events from '../components/Events';
import Contact from '../components/Contact';
import MobileStickyBar from '../components/MobileStickyBar';

export default function Home() {
  return (
    <div className="flex flex-col">
      <CinematicHero />
      <FloatingBookingBar />
      <Rooms />
      <ImmersiveScrollStory />
      <DestinationMagazine />
      <Events />
      <Contact />
      <MobileStickyBar />
    </div>
  );
}
