import React from 'react';
import SearchBar from '../components/SearchBar';
import OfferCard from '../components/OfferCard';
import VRSection from './VRSection';
import { Link } from 'react-router-dom';
import { BedDouble, Compass, Hotel } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import TouristInfoSection from '../components/TouristInfoSection';
import { useData } from '../contexts/DataContext';
import PartnersSection from '../components/PartnersSection';

const HomePage: React.FC = () => {
  const { offers } = useData();
  const featuredOffers = offers.slice(0, 4);
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549887552-cb13753b7a8f?q=80&w=1920&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">{t('heroTitle')}</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SearchBar />
      </div>

      {/* Quick Links */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <Link to="/offers?category=trip" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1 dark:bg-dark-blue dark:hover:shadow-sand/10">
                    <Compass size={48} className="mx-auto text-sand mb-4"/>
                    <h3 className="text-xl font-bold text-dark-blue dark:text-white">{t('organizedTrips')}</h3>
                </Link>
                 <Link to="/offers?category=hotel" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1 dark:bg-dark-blue dark:hover:shadow-sand/10">
                    <Hotel size={48} className="mx-auto text-sand mb-4"/>
                    <h3 className="text-xl font-bold text-dark-blue dark:text-white">{t('hotels')}</h3>
                </Link>
                 <Link to="/offers?category=guesthouse" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1 dark:bg-dark-blue dark:hover:shadow-sand/10">
                    <BedDouble size={48} className="mx-auto text-sand mb-4"/>
                    <h3 className="text-xl font-bold text-dark-blue dark:text-white">{t('guesthouses')}</h3>
                </Link>
            </div>
        </div>
      </section>

      {/* Featured Offers */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-blue dark:text-white">{t('featuredOffers')}</h2>
            <p className="text-gray-600 mt-2 dark:text-gray-300">{t('featuredOffersSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredOffers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </section>

      {/* Tourist Info Section */}
      <TouristInfoSection />

      {/* VR Section */}
      <VRSection />

      {/* Partners Section */}
      <PartnersSection />

    </div>
  );
};

export default HomePage;