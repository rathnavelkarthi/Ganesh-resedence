import Hero from '../components/Hero';
import Rooms from '../components/Rooms';
import Amenities from '../components/Amenities';
import Experience from '../components/Experience';
import Explore from '../components/Explore';
import Events from '../components/Events';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Rooms />
      <Amenities />
      <Experience />
      <Explore />
      <Events />
      <Contact />
    </div>
  );
}
