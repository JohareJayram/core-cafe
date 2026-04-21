import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LandingClient from './LandingClient';

export const metadata = {
  title: 'CORE Cafe — Order Your Way. No Waiting | Hinjwadi Pune',
  description: 'Experience the future of cafe dining at CORE Cafe, Hinjwadi Phase 3 Pune. Scan our table QR, browse the menu, and order premium coffee & snacks — no waiter needed.',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <LandingClient />
      <Footer />
    </>
  );
}
