import { Footer, Navbar } from '../components';
import { Hero, About, Explore, GetStarted, WhatsNew, World, Insights, Feedback } from '../sections';

const Page = () => (
  <div className="bg-primary-black overflow-hidden">
    <Navbar />
    <Hero />
    <About />
    <Explore />
    <GetStarted />
    <WhatsNew />
    <World />
    <Insights />
    <Feedback />
    <Footer />
  </div>
);

export default Page;
