import Header from '../componets/Header/Header';
import BodyHome from '../layout/Home/BodyHome';
import Footer from '../componets/Footer/Footer';

export default function Home() {
  return (
    <div className="home">
      <Header />
      <BodyHome />
      <Footer />
    </div>
  );
}
